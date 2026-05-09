# -*- coding: utf-8 -*-
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import VistaRegistro, VistaPerfil, VistaCerrarSesion

# Todos los endpoints viven bajo el prefijo /api/auth/ (definido en config/urls.py).
# Login y refresco son de simplejwt — no requieren código personalizado.
urlpatterns = [
    # POST {username, email, contrasena} → {usuario, tokens}
    path('registro/', VistaRegistro.as_view(), name='auth-registro'),

    # POST {username, password} → {access, refresh}
    path('login/', TokenObtainPairView.as_view(), name='auth-login'),

    # POST {refresh} → {access}  — renueva el access token
    path('token/refresco/', TokenRefreshView.as_view(), name='auth-token-refresco'),

    # GET  → datos del usuario autenticado
    # PATCH {first_name, last_name, telefono} → actualiza perfil
    path('perfil/', VistaPerfil.as_view(), name='auth-perfil'),

    # POST {refresco} → invalida token, cierra sesión
    path('cerrar-sesion/', VistaCerrarSesion.as_view(), name='auth-cerrar-sesion'),
]