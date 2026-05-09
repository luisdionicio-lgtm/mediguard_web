# -*- coding: utf-8 -*-
from django.contrib import admin
from .models import ContactoEmergencia, EventoSOS, NumeroServicioEmergencia


@admin.register(ContactoEmergencia)
class AdministradorContactoEmergencia(admin.ModelAdmin):
    list_display    = ['nombre', 'telefono', 'relacion', 'es_principal', 'usuario', 'creado_en']
    list_filter     = ['relacion', 'es_principal', 'creado_en']
    search_fields   = ['nombre', 'telefono', 'usuario__username', 'usuario__email']
    readonly_fields = ['creado_en']
    ordering        = ['-es_principal', 'nombre']


@admin.register(EventoSOS)
class AdministradorEventoSOS(admin.ModelAdmin):
    list_display    = ['usuario', 'estado', 'tiene_ubicacion', 'activado_en', 'resuelto_en']
    list_filter     = ['estado', 'activado_en']
    search_fields   = ['usuario__username', 'usuario__email', 'notas']
    readonly_fields = ['activado_en', 'tiene_ubicacion']
    ordering        = ['-activado_en']

    @admin.display(boolean=True, description='Tiene GPS')
    def tiene_ubicacion(self, obj):
        return obj.tiene_ubicacion


@admin.register(NumeroServicioEmergencia)
class AdministradorNumeroServicioEmergencia(admin.ModelAdmin):
    """
    Este admin es el panel de carga de datos iniciales.
    El administrador del sistema carga aquí los números institucionales
    (112, 105, 106, etc.) que luego la API expone al frontend y Android.
    """
    list_display  = ['nombre', 'telefono', 'tipo_servicio', 'codigo_pais', 'prioridad', 'activo']
    list_filter   = ['tipo_servicio', 'codigo_pais', 'activo']
    search_fields = ['nombre', 'telefono', 'descripcion']
    list_editable = ['prioridad', 'activo']  # editar prioridad y activo directo desde la lista
    ordering      = ['prioridad', 'nombre']
