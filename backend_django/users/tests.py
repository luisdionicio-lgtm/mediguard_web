# -*- coding: utf-8 -*-
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from .models import AuditLog, Rol, UserRole, Usuario, VerificationToken


class RegistroUsuariosSprint1Tests(TestCase):
    def setUp(self):
        self.client = APIClient()
        Rol.objects.get_or_create(
            name=Rol.Nombre.CIUDADANO,
            defaults={'description': 'Usuario estándar del sistema'},
        )
        Rol.objects.get_or_create(
            name=Rol.Nombre.ADMIN,
            defaults={'description': 'Administrador del sistema'},
        )

    def test_register_creates_user_default_role_audit_and_tokens(self):
        response = self.client.post('/api/register/', {
            'first_name': 'Ana',
            'last_name': 'Torres',
            'email': 'ANA@example.com',
            'phone': '+51999888777',
            'password': 'ClaveSegura123!',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        usuario = Usuario.objects.get(email='ana@example.com')

        self.assertTrue(usuario.check_password('ClaveSegura123!'))
        self.assertTrue(usuario.roles.filter(name=Rol.Nombre.CIUDADANO).exists())
        self.assertTrue(AuditLog.objects.filter(user=usuario, action='USER_REGISTERED').exists())
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertIn('refresh', response.data['tokens'])
        self.assertIn('user', response.data)

    def test_register_api_saves_phone_in_sqlite(self):
        response = self.client.post('/api/register/', {
            'first_name': 'Luis',
            'last_name': 'Prueba',
            'email': 'luis.prueba@example.com',
            'phone': '+51999123456',
            'password': 'ClaveSegura123!',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        usuario = Usuario.objects.get(email='luis.prueba@example.com')
        self.assertEqual(usuario.phone, '+51999123456')
        self.assertEqual(response.data['user']['phone'], '+51999123456')

    def test_api_root_muestra_endpoints_creados(self):
        response = self.client.get('/api/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('register', response.data['auth'])
        self.assertIn('login', response.data['auth'])
        self.assertIn('logout', response.data['auth'])
        self.assertIn('token_refresh', response.data['auth'])
        self.assertNotIn('legacy_auth', response.data)
        self.assertNotIn('token_refresco', response.data['auth'])

    def test_spanish_auth_routes_are_not_exposed(self):
        self.assertEqual(self.client.get('/api/auth/registro/').status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(self.client.get('/api/auth/perfil/').status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(self.client.post('/api/auth/cerrar-sesion/').status_code, status.HTTP_404_NOT_FOUND)

    def test_login_funciona_con_email_y_password(self):
        Usuario.objects.create_user(
            email='usuario@example.com',
            password='ClaveSegura123!',
            first_name='Usuario',
            last_name='Demo',
        )

        response = self.client.post('/api/login/', {
            'email': 'usuario@example.com',
            'password': 'ClaveSegura123!',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_email_duplicado_es_rechazado(self):
        Usuario.objects.create_user(
            email='duplicado@example.com',
            password='ClaveSegura123!',
            first_name='Usuario',
            last_name='Original',
        )

        response = self.client.post('/api/register/', {
            'first_name': 'Usuario',
            'last_name': 'Duplicado',
            'email': 'duplicado@example.com',
            'password': 'ClaveSegura123!',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_register_checks_existing_user_by_email(self):
        Usuario.objects.create_user(
            email='verificado@example.com',
            password='ClaveSegura123!',
            first_name='Usuario',
            last_name='Verificado',
        )

        response = self.client.get('/api/register/', {'email': 'verificado@example.com'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['registered'])
        self.assertEqual(response.data['user']['email'], 'verificado@example.com')

    def test_get_register_returns_false_when_email_does_not_exist(self):
        response = self.client.get('/api/register/', {'email': 'noexiste@example.com'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['registered'])
        self.assertEqual(response.data['email'], 'noexiste@example.com')

    def test_nuevo_token_invalida_token_anterior_del_mismo_tipo(self):
        usuario = Usuario.objects.create_user(
            email='token@example.com',
            password='ClaveSegura123!',
            first_name='Token',
            last_name='Demo',
        )

        token_anterior = VerificationToken.objects.create(
            user=usuario,
            token_type=VerificationToken.TokenType.EMAIL_VERIFICATION,
        )
        token_nuevo = VerificationToken.objects.create(
            user=usuario,
            token_type=VerificationToken.TokenType.EMAIL_VERIFICATION,
        )

        token_anterior.refresh_from_db()
        token_nuevo.refresh_from_db()

        self.assertTrue(token_anterior.used)
        self.assertFalse(token_nuevo.used)

    def test_perfil_soporta_get_put_patch_y_delete(self):
        usuario = Usuario.objects.create_user(
            email='crud@example.com',
            password='ClaveSegura123!',
            first_name='Crud',
            last_name='Inicial',
            phone='+51999111000',
        )
        self.client.force_authenticate(user=usuario)

        response_get = self.client.get('/api/profile/')
        self.assertEqual(response_get.status_code, status.HTTP_200_OK)
        self.assertEqual(response_get.data['email'], 'crud@example.com')

        response_put = self.client.put('/api/profile/', {
            'first_name': 'Crud',
            'last_name': 'Actualizado',
            'phone': '+51999111222',
        }, format='json')
        self.assertEqual(response_put.status_code, status.HTTP_200_OK)
        usuario.refresh_from_db()
        self.assertEqual(usuario.last_name, 'Actualizado')
        self.assertEqual(usuario.phone, '+51999111222')

        response_patch = self.client.patch('/api/profile/', {
            'phone': '+51999111333',
        }, format='json')
        self.assertEqual(response_patch.status_code, status.HTTP_200_OK)
        usuario.refresh_from_db()
        self.assertEqual(usuario.phone, '+51999111333')

        response_delete = self.client.delete('/api/profile/')
        self.assertEqual(response_delete.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Usuario.objects.filter(email='crud@example.com').exists())

    def test_admin_puede_asignar_rol_admin_desde_api(self):
        admin = Usuario.objects.create_user(
            email='admin@example.com',
            password='ClaveSegura123!',
            first_name='Admin',
            last_name='Demo',
        )
        usuario = Usuario.objects.create_user(
            email='objetivo@example.com',
            password='ClaveSegura123!',
            first_name='Objetivo',
            last_name='Demo',
        )
        rol_admin = Rol.objects.get(name=Rol.Nombre.ADMIN)
        UserRole.objects.get_or_create(user=admin, role=rol_admin, defaults={'assigned_by': None})

        self.client.force_authenticate(user=admin)
        response = self.client.put(f'/api/users/{usuario.id}/roles/', {
            'roles': ['ADMIN'],
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['roles'], ['ADMIN'])
        usuario.refresh_from_db()
        self.assertTrue(usuario.is_staff)

    def test_usuario_no_admin_no_puede_asignar_roles(self):
        usuario = Usuario.objects.create_user(
            email='normal@example.com',
            password='ClaveSegura123!',
            first_name='Normal',
            last_name='Demo',
        )
        objetivo = Usuario.objects.create_user(
            email='objetivo2@example.com',
            password='ClaveSegura123!',
            first_name='Objetivo',
            last_name='Dos',
        )

        self.client.force_authenticate(user=usuario)
        response = self.client.put(f'/api/users/{objetivo.id}/roles/', {
            'roles': ['ADMIN'],
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_superusuario_registra_auditoria_como_admin(self):
        admin = Usuario.objects.create_superuser(
            email='superadmin@example.com',
            password='ClaveSegura123!',
            first_name='Super',
            last_name='Admin',
        )

        audit = AuditLog.objects.get(user=admin, action='USER_REGISTERED')

        self.assertEqual(audit.entity_type, 'admin')
        self.assertEqual(audit.metadata['assigned_role'], 'ADMIN')
        self.assertIn('ADMIN', audit.metadata['roles'])
