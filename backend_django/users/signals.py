# -*- coding: utf-8 -*-
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import AuditLog, Rol, UserRole, Usuario, VerificationToken


@receiver(post_save, sender=Usuario)
def asignar_rol_ciudadano_y_auditar(sender, instance, created, **kwargs):
    if not created:
        return

    rol_ciudadano = Rol.objects.filter(name=Rol.Nombre.CIUDADANO).first()
    if not rol_ciudadano:
        raise RuntimeError('Rol CIUDADANO no encontrado. Ejecuta las migraciones con datos semilla.')

    UserRole.objects.get_or_create(
        user=instance,
        role=rol_ciudadano,
        defaults={'assigned_by': None},
    )
    AuditLog.objects.create(
        user=instance,
        action='USER_REGISTERED',
        entity_type='users',
        entity_id=instance.id,
        metadata={'email': instance.email, 'assigned_role': Rol.Nombre.CIUDADANO},
    )


@receiver(post_save, sender=VerificationToken)
def invalidar_tokens_previos(sender, instance, created, **kwargs):
    if not created:
        return

    VerificationToken.objects.filter(
        user=instance.user,
        token_type=instance.token_type,
        used=False,
    ).exclude(id=instance.id).update(used=True)
