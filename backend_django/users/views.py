# -*- coding: utf-8 -*-
import requests as http_requests
from django.conf import settings
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from .models import AuditLog, Rol, UserRole, Usuario
from .serializers import (
    SerializadorActualizacionUsuario,
    SerializadorAsignacionRoles,
    SerializadorRegistro,
    SerializadorUsuario,
)
from .tokens import build_token_for_user


# ─────────────────────────────────────────────────────────────────────────────
# Register view
# POST /api/register/           -> create user
# GET  /api/register/?email=... -> check whether an email is registered
# Public endpoint.
#
# Legacy: el frontend registra/loguea usuarios contra Spring Boot, no contra
# Django. Esta vista queda apagada salvo que ENABLE_LEGACY_DJANGO_REGISTER
# esté en True (ver settings.py). Los tests la activan explícitamente con
# @override_settings para seguir validando la lógica con POST/GET reales.
# ─────────────────────────────────────────────────────────────────────────────
class VistaRegistro(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = SerializadorRegistro
    permission_classes = [AllowAny]

    def _bloqueada_si_deshabilitada(self):
        if not settings.ENABLE_LEGACY_DJANGO_REGISTER:
            return Response(
                {'error': 'Endpoint deshabilitado. El registro/login se hace vía Spring Boot.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return None

    def list(self, request, *args, **kwargs):
        respuesta_bloqueada = self._bloqueada_si_deshabilitada()
        if respuesta_bloqueada:
            return respuesta_bloqueada

        email = request.query_params.get('email', '').strip().lower()

        if request.user and request.user.is_authenticated and not email:
            return Response({
                'registered': True,
                'user': SerializadorUsuario(request.user).data,
            }, status=status.HTTP_200_OK)

        if not email:
            return Response(
                {'error': 'Send the ?email=user@example.com query parameter to check registration.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        usuario = Usuario.objects.filter(email__iexact=email).first()
        if not usuario:
            return Response({
                'registered': False,
                'email': email,
                'message': 'No registered user exists with that email.',
            }, status=status.HTTP_200_OK)

        return Response({
            'registered': True,
            'user': {
                'id': str(usuario.id),
                'first_name': usuario.first_name,
                'last_name': usuario.last_name,
                'email': usuario.email,
                'phone': usuario.phone,
                'is_active': usuario.is_active,
                'is_verified': usuario.is_verified,
                'roles': list(usuario.roles.values_list('name', flat=True)),
            },
        }, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        respuesta_bloqueada = self._bloqueada_si_deshabilitada()
        if respuesta_bloqueada:
            return respuesta_bloqueada

        serializador = self.get_serializer(data=request.data)
        serializador.is_valid(raise_exception=True)
        usuario = serializador.save()

        refresh = RefreshToken.for_user(usuario)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        usuario_data = SerializadorUsuario(usuario).data

        return Response({
            'user': usuario_data,
            'tokens': {
                'access': access_token,
                'refresh': refresh_token,
            }
        }, status=status.HTTP_201_CREATED)


# Profile view
# GET/PUT/PATCH/DELETE /api/profile/
class VistaPerfil(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'put', 'patch', 'delete']

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return SerializadorActualizacionUsuario
        return SerializadorUsuario

    def destroy(self, request, *args, **kwargs):
        usuario = self.get_object()
        usuario.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# User roles view
# GET/PUT/PATCH /api/users/<id>/roles/
class VistaRolesUsuario(APIView):
    permission_classes = [IsAuthenticated]

    def get_usuario(self, usuario_id):
        return generics.get_object_or_404(Usuario, id=usuario_id)

    def validar_admin(self, request):
        if not getattr(request.user, 'is_staff', False):
            return Response(
                {'error': 'Only an ADMIN user can read or modify roles.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return None

    def get(self, request, usuario_id):
        respuesta_prohibida = self.validar_admin(request)
        if respuesta_prohibida:
            return respuesta_prohibida

        usuario = self.get_usuario(usuario_id)
        return Response(SerializadorUsuario(usuario).data, status=status.HTTP_200_OK)

    def put(self, request, usuario_id):
        return self.actualizar_roles(request, usuario_id)

    def patch(self, request, usuario_id):
        return self.actualizar_roles(request, usuario_id)

    def actualizar_roles(self, request, usuario_id):
        respuesta_prohibida = self.validar_admin(request)
        if respuesta_prohibida:
            return respuesta_prohibida

        usuario = self.get_usuario(usuario_id)
        serializador = SerializadorAsignacionRoles(
            instance=usuario,
            data=request.data,
            context={'request': request},
        )
        serializador.is_valid(raise_exception=True)
        usuario = serializador.save()

        AuditLog.objects.create(
            user=request.user,
            action='USER_ROLES_UPDATED',
            entity_type='users',
            entity_id=usuario.id,
            metadata={
                'target_email': usuario.email,
                'roles': list(usuario.roles.values_list('name', flat=True)),
            },
        )

        return Response(SerializadorUsuario(usuario).data, status=status.HTTP_200_OK)


# Logout view
# POST /api/logout/ { "refresh": "<refresh_token>" }
class VistaCerrarSesion(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response(
                {'error': 'The "refresh" field is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {'message': 'Session closed successfully.'},
                status=status.HTTP_200_OK
            )
        except Exception:
            return Response(
                {'error': 'Invalid or expired token.'},
                status=status.HTTP_400_BAD_REQUEST
            )

# Google OAuth view
# POST /api/auth/google/ { access_token: "<google-access-token>" }
class VistaGoogleAuth(APIView):
    permission_classes = [AllowAny]

    GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

    def post(self, request):
        access_token = request.data.get('access_token', '').strip()
        if not access_token:
            return Response({'error': 'El campo "access_token" es obligatorio.'}, status=status.HTTP_400_BAD_REQUEST)

        google_resp = http_requests.get(
            self.GOOGLE_USERINFO_URL,
            headers={'Authorization': f'Bearer {access_token}'},
            timeout=10,
        )
        if not google_resp.ok:
            return Response(
                {'error': 'Token de Google inválido o expirado.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        id_info = google_resp.json()
        email = id_info.get('email', '').lower()
        first_name = id_info.get('given_name', '')
        last_name = id_info.get('family_name', '')
        avatar_url = id_info.get('picture', '')

        if not email:
            return Response({'error': 'El token de Google no contiene email.'}, status=status.HTTP_400_BAD_REQUEST)

        usuario, created = Usuario.objects.get_or_create(
            email=email,
            defaults={
                'first_name': first_name,
                'last_name': last_name,
                'avatar_url': avatar_url,
                'is_active': True,
                'is_verified': True,
            },
        )

        if created:
            usuario.set_unusable_password()
            usuario.save(update_fields=['password'])
            rol_ciudadano, _ = Rol.objects.get_or_create(
                name=Rol.Nombre.CIUDADANO,
                defaults={'description': 'Usuario estándar del sistema'},
            )
            UserRole.objects.get_or_create(user=usuario, role=rol_ciudadano, defaults={'assigned_by': None})
            AuditLog.objects.create(
                user=usuario,
                action='USER_REGISTERED_GOOGLE',
                entity_type='users',
                entity_id=usuario.id,
                metadata={'email': email, 'provider': 'google'},
            )
        else:
            if not usuario.is_active:
                return Response({'error': 'Cuenta desactivada. Contacta al administrador.'}, status=status.HTTP_403_FORBIDDEN)
            updated_fields = []
            if avatar_url and not usuario.avatar_url:
                usuario.avatar_url = avatar_url
                updated_fields.append('avatar_url')
            if updated_fields:
                usuario.save(update_fields=updated_fields)

        refresh = build_token_for_user(usuario)
        access = refresh.access_token

        return Response({
            'access_token': str(access),
            'refresh_token': str(refresh),
            'user': {
                'id': str(usuario.id),
                'email': usuario.email,
                'first_name': usuario.first_name,
                'last_name': usuario.last_name,
                'avatar_url': usuario.avatar_url,
                'roles': list(usuario.roles.values_list('name', flat=True)),
                'is_verified': usuario.is_verified,
            },
        }, status=status.HTTP_200_OK)


# Auth me view
# GET /api/auth/me/
class VistaMe(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(SerializadorUsuario(request.user).data)


# Users list view
# GET /api/users/ -> list users, ADMIN only
class VistaListarUsuarios(generics.ListAPIView):
    queryset = Usuario.objects.all().order_by('-created_at')
    serializer_class = SerializadorUsuario
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not getattr(self.request.user, 'is_staff', False):
            return Usuario.objects.none()
        return super().get_queryset()

