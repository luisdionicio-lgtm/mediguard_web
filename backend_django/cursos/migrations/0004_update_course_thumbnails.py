# -*- coding: utf-8 -*-
"""
Migración de datos: asigna las imágenes locales (ya creadas manualmente en
frontend_react/public/images/) a los dos cursos que todavía mostraban el
placeholder genérico (ícono de estetoscopio) en /courses.

Es idempotente: usa .update() por slug, así que aplicarla varias veces deja
el mismo valor sin error. Si algún curso no existe (p. ej. porque el seed de
0002 aún no corrió en ese entorno), el filtro simplemente no encuentra filas
y no falla.
"""
from django.db import migrations

THUMBNAILS = {
    'respuesta-ante-sismos-terremotos': '/images/sismos_course.png',
    'seguridad-electrica-prevencion-incendios': '/images/incendios_electricidad_course.png',
}


def set_thumbnails(apps, schema_editor):
    Course = apps.get_model('cursos', 'Course')
    for slug, thumbnail_url in THUMBNAILS.items():
        Course.objects.filter(slug=slug).update(thumbnail_url=thumbnail_url)


def unset_thumbnails(apps, schema_editor):
    Course = apps.get_model('cursos', 'Course')
    Course.objects.filter(slug__in=THUMBNAILS.keys()).update(thumbnail_url=None)


class Migration(migrations.Migration):

    dependencies = [
        ('cursos', '0003_thumbnail_url_to_charfield'),
    ]

    operations = [
        migrations.RunPython(set_thumbnails, unset_thumbnails),
    ]
