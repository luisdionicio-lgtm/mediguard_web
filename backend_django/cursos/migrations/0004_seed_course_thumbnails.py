# -*- coding: utf-8 -*-
"""
Migración de datos: asigna thumbnail_url a los 8 cursos existentes.

Idempotente: usa el slug de cada curso para actualizar solo thumbnail_url;
si el curso no existe (por ejemplo en una BD nueva sin seed previo) se omite
sin fallar. Reversible: la migración inversa vuelve a dejar thumbnail_url
en NULL para estos mismos slugs.
"""
from django.db import migrations


THUMBNAILS = {
    'respuesta-ante-sismos-terremotos':
        'https://images.unsplash.com/photo-1704971152660-b56fcd93c04d'
        '?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0'
        '&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'seguridad-electrica-prevencion-incendios':
        'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed'
        '?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
        '&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2VndXJpZGFkJTIwZWxlY3RyaWNhfGVufDB8fDB8fHww',
    'primeros-auxilios-entorno-institucional':
        'https://images.unsplash.com/photo-1649260257572-91bf6f94cff6'
        '?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
        '&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByaW1lcm9zJTIwYXV4aWxpb3N8ZW58MHx8MHx8fDA%3D',
    'primeros-auxilios-pediatricos':
        'https://images.unsplash.com/photo-1692085654353-bad2a051e13d'
        '?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
        '&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByaW1lcm9zJTIwYXV4aWxpb3MlMjBwZWRpYXRyaWNvc3xlbnwwfHwwfHx8MA%3D%3D',
    'control-hemorragias':
        'https://plus.unsplash.com/premium_photo-1663100588111-96c6d633477f'
        '?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
        '&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGV0ZW5lciUyMHNhbmdyYWRvc3xlbnwwfHwwfHx8MA%3D%3D',
    'manejo-quemaduras':
        'https://plus.unsplash.com/premium_photo-1723672885268-97f9d20e879a'
        '?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
        '&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fHF1ZW1hZHVyYXMlMjBlbWVyZ2VuY2lhc3xlbnwwfHwwfHx8MA%3D%3D',
    'rcp-basico':
        'https://images.unsplash.com/photo-1769443649955-510e86ca9f75'
        '?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
        '&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJlYW5pbWFjaW9ufGVufDB8fDB8fHww',
    'fracturas-traumatismos':
        'https://plus.unsplash.com/premium_photo-1725075088417-c6e3a4904d3d'
        '?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
        '&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aHVlc28lMjByb3RvfGVufDB8fDB8fHww',
}


def set_thumbnails(apps, schema_editor):
    Course = apps.get_model('cursos', 'Course')
    for slug, url in THUMBNAILS.items():
        Course.objects.filter(slug=slug).update(thumbnail_url=url)


def clear_thumbnails(apps, schema_editor):
    Course = apps.get_model('cursos', 'Course')
    Course.objects.filter(slug__in=THUMBNAILS.keys()).update(thumbnail_url=None)


class Migration(migrations.Migration):

    dependencies = [
        ('cursos', '0003_thumbnail_url_to_charfield'),
    ]

    operations = [
        migrations.RunPython(set_thumbnails, clear_thumbnails),
    ]
