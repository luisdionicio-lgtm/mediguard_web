# -*- coding: utf-8 -*-
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    VistaRegistro,
    VistaPerfil,
    VistaCerrarSesion,
    VistaRolesUsuario,
    VistaListarUsuarios,
    VistaMe,
)

urlpatterns = [
    path('register/', VistaRegistro.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('logout/', VistaCerrarSesion.as_view(), name='logout'),
    path('profile/', VistaPerfil.as_view(), name='profile'),
    path('users/', VistaListarUsuarios.as_view(), name='users-list'),
    path('users/<uuid:usuario_id>/roles/', VistaRolesUsuario.as_view(), name='user-roles'),
    path('auth/me/', VistaMe.as_view(), name='auth-me'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='auth-refresh'),
]
