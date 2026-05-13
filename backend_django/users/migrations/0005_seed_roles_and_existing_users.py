# Generated manually to seed Sprint 1 roles and backfill existing users.

from django.db import migrations


ROLES = [
    ('CIUDADANO', 'Usuario estándar del sistema'),
    ('SOCORRISTA', 'Voluntario certificado en primeros auxilios'),
    ('COORDINADOR', 'Coordina equipos de respuesta'),
    ('ADMIN', 'Administrador del sistema'),
]


def seed_roles_and_existing_users(apps, schema_editor):
    Rol = apps.get_model('users', 'Rol')
    Usuario = apps.get_model('users', 'Usuario')
    UserRole = apps.get_model('users', 'UserRole')
    AuditLog = apps.get_model('users', 'AuditLog')

    for name, description in ROLES:
        Rol.objects.get_or_create(name=name, defaults={'description': description})

    ciudadano = Rol.objects.get(name='CIUDADANO')

    for user in Usuario.objects.all():
        UserRole.objects.get_or_create(user=user, role=ciudadano, defaults={'assigned_by': None})
        AuditLog.objects.get_or_create(
            user=user,
            action='USER_REGISTERED',
            entity_type='users',
            entity_id=user.id,
            defaults={'metadata': {'email': user.email, 'assigned_role': 'CIUDADANO'}},
        )


def unseed_roles(apps, schema_editor):
    Rol = apps.get_model('users', 'Rol')
    Rol.objects.filter(name__in=[name for name, _ in ROLES]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_auditlog_rol_userrole_verificationtoken_and_more'),
    ]

    operations = [
        migrations.RunPython(seed_roles_and_existing_users, unseed_roles),
    ]
