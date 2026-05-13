# Generated manually to normalize audit logs for admin users.

from django.db import migrations


def normalizar_auditoria_admin(apps, schema_editor):
    UserRole = apps.get_model('users', 'UserRole')
    AuditLog = apps.get_model('users', 'AuditLog')

    admin_roles = UserRole.objects.filter(role__name='ADMIN').select_related('user')

    for user_role in admin_roles:
        AuditLog.objects.filter(
            user_id=user_role.user_id,
            action='USER_REGISTERED',
        ).update(
            entity_type='admin',
            metadata={
                'email': user_role.user.email,
                'assigned_role': 'ADMIN',
                'roles': ['CIUDADANO', 'ADMIN'],
            },
        )


def revertir_auditoria_admin(apps, schema_editor):
    AuditLog = apps.get_model('users', 'AuditLog')

    AuditLog.objects.filter(
        action='USER_REGISTERED',
        entity_type='admin',
    ).update(entity_type='users')


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_seed_roles_and_existing_users'),
    ]

    operations = [
        migrations.RunPython(normalizar_auditoria_admin, revertir_auditoria_admin),
    ]
