from django.db import migrations


ROLES = [
    ('CIUDADANO', 'Usuario estándar del sistema'),
    ('SOCORRISTA', 'Usuario socorrista'),
    ('COORDINADOR', 'Coordinador de emergencias'),
    ('ADMIN', 'Administrador del sistema'),
]


def seed_roles(apps, schema_editor):
    Rol = apps.get_model('users', 'Rol')
    for name, description in ROLES:
        Rol.objects.get_or_create(
            name=name,
            defaults={'description': description},
        )


class Migration(migrations.Migration):
    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_roles, migrations.RunPython.noop),
    ]
