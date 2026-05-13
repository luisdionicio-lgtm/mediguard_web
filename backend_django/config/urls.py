# -*- coding: utf-8 -*-
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Panel de administración Django
    path('admin/', admin.site.urls),

    # ── API REST ─────────────────────────────────────────────────────────────
    # Autenticación y usuarios
    path('api/auth/', include('users.urls')), # Mantenemos retrocompatibilidad
    path('api/', include('users.urls')), # Añade endpoints directos /api/login, /api/register, /api/profile
    
    # Contenido (Guides, Hospitals, News)
    path('api/', include('content.urls')),
    
    # Emergencia
    path('api/', include('emergency.urls')),
]