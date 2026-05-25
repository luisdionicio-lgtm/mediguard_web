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
# Register view
# POST /api/register/           -> create user
# GET  /api/register/?email=... -> check whether an email is registered
# Public endpoint.
# ─────────────────────────────────────────────────────────────────────────────
class VistaRegistro(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = SerializadorRegistro
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
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

