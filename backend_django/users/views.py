# -*- coding: utf-8 -*-
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from .models import AuditLog, Usuario
from .serializers import (
    SerializadorActualizacionUsuario,
    SerializadorAsignacionRoles,
    SerializadorRegistro,
    SerializadorUsuario,
)


# ─────────────────────────────────────────────────────────────────────────────
# VistaRegistro
# POST /api/auth/registro/           → crea usuario
# GET  /api/auth/registro/?email=... → verifica si un usuario fue registrado
# Publica — no requiere autenticacion (AllowAny).
# ─────────────────────────────────────────────────────────────────────────────
class VistaRegistro(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = SerializadorRegistro
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        email = request.query_params.get('email', '').strip().lower()

        if request.user and request.user.is_authenticated and not email:
            return Response({
                'registrado': True,
                'usuario': SerializadorUsuario(request.user).data,
            }, status=status.HTTP_200_OK)

        if not email:
            return Response(
                {'error': 'Para verificar un registro envia el parametro ?email=correo@dominio.com.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        usuario = Usuario.objects.filter(email__iexact=email).first()
        if not usuario:
            return Response({
                'registrado': False,
                'email': email,
                'mensaje': 'No existe un usuario registrado con ese correo.',
            }, status=status.HTTP_200_OK)

        return Response({
            'registrado': True,
            'usuario': {
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
        serializador = self.get_serializer(data=request.data)
        serializador.is_valid(raise_exception=True)
        usuario = serializador.save()

        # Generar tokens tras registro exitoso
        refresh = RefreshToken.for_user(usuario)

        return Response({
            'usuario': SerializadorUsuario(usuario).data,
            'tokens': {
                'acceso': str(refresh.access_token),
                'refresco': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)


# ─────────────────────────────────────────────────────────────────────────────
# VistaPerfil
# GET    /api/auth/perfil/  → retorna datos del usuario autenticado
# PUT    /api/auth/perfil/  → reemplaza first_name, last_name, phone
# PATCH  /api/auth/perfil/  → actualiza parcialmente first_name, last_name, phone
# DELETE /api/auth/perfil/  → elimina la cuenta autenticada
# Privada — requiere Bearer token.
# Usa get_serializer_class para devolver el serializador correcto según el método.
# ─────────────────────────────────────────────────────────────────────────────
class VistaPerfil(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'put', 'patch', 'delete']

    def get_object(self):
        # El usuario autenticado ya viene en request.user — no necesita query extra.
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return SerializadorActualizacionUsuario
        return SerializadorUsuario

    def destroy(self, request, *args, **kwargs):
        usuario = self.get_object()
        usuario.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ─────────────────────────────────────────────────────────────────────────────
# VistaRolesUsuario
# GET /api/auth/usuarios/<id>/roles/       → consulta roles de un usuario
# PUT/PATCH /api/auth/usuarios/<id>/roles/ → reemplaza roles del usuario
# Privada — requiere Bearer token de un usuario ADMIN.
# ─────────────────────────────────────────────────────────────────────────────
class VistaRolesUsuario(APIView):
    permission_classes = [IsAuthenticated]

    def get_usuario(self, usuario_id):
        return generics.get_object_or_404(Usuario, id=usuario_id)

    def validar_admin(self, request):
        if not getattr(request.user, 'is_staff', False):
            return Response(
                {'error': 'Solo un usuario ADMIN puede consultar o modificar roles.'},
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


# ─────────────────────────────────────────────────────────────────────────────
# VistaCerrarSesion
# POST /api/auth/cerrar-sesion/  { "refresco": "<refresh_token>" }
# Privada — requiere Bearer token.
# Invalida el refresh token en la blacklist de simplejwt.
# El access token expira naturalmente en 60 minutos (no hay manera de revocarlo
# sin blacklist global — no es necesario para esta fase).
# ─────────────────────────────────────────────────────────────────────────────
class VistaCerrarSesion(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token_refresco = request.data.get('refresco')

        if not token_refresco:
            return Response(
                {'error': 'El campo "refresco" es requerido.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = RefreshToken(token_refresco)
            token.blacklist()
            return Response(
                {'mensaje': 'Sesión cerrada correctamente.'},
                status=status.HTTP_200_OK
            )
        except Exception:
            return Response(
                {'error': 'Token inválido o ya expirado.'},
                status=status.HTTP_400_BAD_REQUEST
            )

# ─────────────────────────────────────────────────────────────────────────────
# VistaListarUsuarios
# GET /api/users/ → listar todos los usuarios (solo ADMIN)
# ─────────────────────────────────────────────────────────────────────────────
class VistaListarUsuarios(generics.ListAPIView):
    queryset = Usuario.objects.all().order_by('-created_at')
    serializer_class = SerializadorUsuario
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not getattr(self.request.user, 'is_staff', False):
            return Usuario.objects.none()
        return super().get_queryset()

