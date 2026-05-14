# -*- coding: utf-8 -*-
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import VistaRegistro, VistaPerfil, VistaCerrarSesion, VistaRolesUsuario, VistaListarUsuarios

# Todos los endpoints viven bajo el prefijo /api/auth/ (definido en config/urls.py).
# Login y refresco son de simplejwt. El identificador de login es email.
urlpatterns = [
    # POST {first_name, last_name, email, phone, contrasena} → {usuario, tokens}
    # GET ?email=correo@dominio.com → verifica si el registro existe
    # Rutas actuales (compatibilidad)
    path('registro/', VistaRegistro.as_view(), name='auth-registro'),
    path('login/', TokenObtainPairView.as_view(), name='auth-login'),
    path('token/refresco/', TokenRefreshView.as_view(), name='auth-token-refresco'),
    path('perfil/', VistaPerfil.as_view(), name='auth-perfil'),
    path('cerrar-sesion/', VistaCerrarSesion.as_view(), name='auth-cerrar-sesion'),
    path('usuarios/<uuid:usuario_id>/roles/', VistaRolesUsuario.as_view(), name='auth-usuario-roles'),

    # Rutas solicitadas en la nueva estructura
    path('register/', VistaRegistro.as_view(), name='register'),
    path('logout/', VistaCerrarSesion.as_view(), name='logout'),
    path('users/', VistaListarUsuarios.as_view(), name='users-list'),
    path('profile/', VistaPerfil.as_view(), name='profile'),
]
