# -*- coding: utf-8 -*-
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Panel de administración Django
    path('admin/', admin.site.urls),

    # ── API REST ─────────────────────────────────────────────────────────────
    # Prefijo /api/ separa la API REST del admin y facilita el versionado futuro.
    # La futura app móvil consumirá exactamente los mismos endpoints.
    #
    # Autenticación: registro, login, refresco, perfil, cerrar-sesion
    path('api/auth/', include('users.urls')),

    # Futuras apps — agregar aquí cuando tengan HUs activas:
    # path('api/emergencia/', include('emergency.urls')),
]