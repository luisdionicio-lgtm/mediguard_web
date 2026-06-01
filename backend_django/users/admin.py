# -*- coding: utf-8 -*-
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import AuditLog, Rol, Usuario, VerificationToken


@admin.register(Usuario)
class AdministradorUsuario(UserAdmin):
    model = Usuario
    ordering = ['email']
    list_display = [
        'email',
        'first_name',
        'last_name',
        'phone',
        'roles_display',
        'is_staff',
        'is_superuser',
        'is_active',
        'is_verified',
        'created_at',
    ]
    list_filter = ['is_active', 'is_verified', 'created_at']
    search_fields = ['email', 'first_name', 'last_name', 'phone']
    readonly_fields = ['id', 'roles_display', 'is_staff', 'is_superuser', 'last_login', 'created_at', 'updated_at']

    fieldsets = (
        ('Credenciales', {'fields': ('email', 'password')}),
        ('Datos personales', {'fields': ('first_name', 'last_name', 'phone', 'avatar_url', 'bio')}),
        ('Roles y permisos', {'fields': ('roles_display', 'is_staff', 'is_superuser')}),
        ('Estado', {'fields': ('is_active', 'is_verified')}),
        ('Auditoria', {'fields': ('id', 'last_login', 'created_at', 'updated_at')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'phone', 'password1', 'password2'),
        }),
    )
    filter_horizontal = ()

    @admin.display(description='Roles')
    def roles_display(self, obj):
        roles = list(obj.roles.values_list('name', flat=True))
        return ', '.join(roles) if roles else 'Sin roles'


@admin.register(Rol)
class AdministradorRol(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['id', 'created_at']


@admin.register(VerificationToken)
class AdministradorVerificationToken(admin.ModelAdmin):
    list_display = ['user', 'token_type', 'used', 'expires_at', 'created_at']
    list_filter = ['token_type', 'used', 'created_at']
    search_fields = ['user__email', 'token']
    readonly_fields = ['id', 'token', 'created_at']


@admin.register(AuditLog)
class AdministradorAuditLog(admin.ModelAdmin):
    list_display = ['action', 'user', 'entity_type', 'entity_id', 'created_at']
    list_filter = ['action', 'entity_type', 'created_at']
    search_fields = ['action', 'user__email', 'entity_type']
    readonly_fields = ['id', 'user', 'action', 'entity_type', 'entity_id', 'metadata', 'created_at']
