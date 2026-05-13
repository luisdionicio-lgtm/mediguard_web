# -*- coding: utf-8 -*-
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import VistaRegistro, VistaPerfil, VistaCerrarSesion, VistaRolesUsuario

# Todos los endpoints viven bajo el prefijo /api/auth/ (definido en config/urls.py).
# Login y refresco son de simplejwt. El identificador de login es email.
urlpatterns = [
    # POST {first_name, last_name, email, phone, contrasena} → {usuario, tokens}
    # GET ?email=correo@dominio.com → verifica si el registro existe
    path('registro/', VistaRegistro.as_view(), name='auth-registro'),

    # POST {email, password} → {access, refresh}
    path('login/', TokenObtainPairView.as_view(), name='auth-login'),

    # POST {refresh} → {access}  — renueva el access token
    path('token/refresco/', TokenRefreshView.as_view(), name='auth-token-refresco'),

    # GET → datos del usuario autenticado
    # PUT/PATCH {first_name, last_name, phone} → actualiza perfil
    # DELETE → elimina la cuenta autenticada
    path('perfil/', VistaPerfil.as_view(), name='auth-perfil'),

    # POST {refresco} → invalida token, cierra sesión
    path('cerrar-sesion/', VistaCerrarSesion.as_view(), name='auth-cerrar-sesion'),

    # GET/PUT/PATCH {roles: ["ADMIN"]} → consulta o modifica roles de un usuario
    path('usuarios/<uuid:usuario_id>/roles/', VistaRolesUsuario.as_view(), name='auth-usuario-roles'),
]
