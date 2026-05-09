# -*- coding: utf-8 -*-
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Usuario
from .serializers import SerializadorRegistro, SerializadorUsuario, SerializadorActualizacionUsuario


# ─────────────────────────────────────────────────────────────────────────────
# VistaRegistro
# POST /api/auth/registro/
# Pública — no requiere autenticación (AllowAny).
# Crea el usuario y devuelve tokens JWT inmediatamente,
# evitando que el usuario tenga que hacer login por separado tras registrarse.
# ─────────────────────────────────────────────────────────────────────────────
class VistaRegistro(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = SerializadorRegistro
    permission_classes = [AllowAny]

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
# GET  /api/auth/perfil/  → retorna datos del usuario autenticado
# PATCH /api/auth/perfil/ → actualiza first_name, last_name, telefono
# Privada — requiere Bearer token.
# Usa get_serializer_class para devolver el serializador correcto según el método.
# ─────────────────────────────────────────────────────────────────────────────
class VistaPerfil(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch']  # PUT completo deshabilitado — solo PATCH parcial

    def get_object(self):
        # El usuario autenticado ya viene en request.user — no necesita query extra.
        return self.request.user

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return SerializadorActualizacionUsuario
        return SerializadorUsuario


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