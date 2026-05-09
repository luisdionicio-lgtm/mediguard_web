# -*- coding: utf-8 -*-
"""
Script de datos iniciales (seed) para NumeroServicioEmergencia.
Ejecutar con: python manage.py shell < seed_emergency.py
"""
from emergency.models import NumeroServicioEmergencia

numeros = [
    {
        'nombre': 'Emergencias General',
        'telefono': '112',
        'tipo_servicio': 'general',
        'codigo_pais': 'PE',
        'prioridad': 1,
        'descripcion': 'Número único de emergencias',
    },
    {
        'nombre': 'Policía Nacional',
        'telefono': '105',
        'tipo_servicio': 'policia',
        'codigo_pais': 'PE',
        'prioridad': 2,
        'descripcion': 'PNP - Policía Nacional del Perú',
    },
    {
        'nombre': 'Bomberos',
        'telefono': '116',
        'tipo_servicio': 'bomberos',
        'codigo_pais': 'PE',
        'prioridad': 3,
        'descripcion': 'Cuerpo General de Bomberos Voluntarios',
    },
    {
        'nombre': 'SAMU - Ambulancia',
        'telefono': '106',
        'tipo_servicio': 'ambulancia',
        'codigo_pais': 'PE',
        'prioridad': 4,
        'descripcion': 'Sistema de Atención Móvil de Urgencias',
    },
]

for n in numeros:
    obj, creado = NumeroServicioEmergencia.objects.get_or_create(
        telefono=n['telefono'],
        codigo_pais=n['codigo_pais'],
        defaults=n,
    )
    resultado = 'CREADO' if creado else 'YA EXISTE'
    print(resultado + ': ' + str(obj))

print('Seed completado. Total: ' + str(NumeroServicioEmergencia.objects.count()) + ' números.')
