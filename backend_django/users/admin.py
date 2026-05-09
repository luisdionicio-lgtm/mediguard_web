# -*- coding: utf-8 -*-
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario


@admin.register(Usuario)
class AdministradorUsuario(UserAdmin):
    """
    Extiende UserAdmin para incluir el campo teléfono.
    UserAdmin ya provee gestión de contraseñas, grupos y permisos.
    """
    list_display    = ['username', 'email', 'first_name', 'telefono', 'is_active', 'date_joined']
    list_filter     = ['is_active', 'is_staff', 'date_joined']
    search_fields   = ['username', 'email', 'first_name', 'telefono']

    # Agregar teléfono en la sección "Información personal" de la vista de edición
    fieldsets = UserAdmin.fieldsets + (
        ('Información adicional', {'fields': ('telefono',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información adicional', {'fields': ('telefono',)}),
    )
