# -*- coding: utf-8 -*-
from django.contrib.auth.models import AbstractUser
from django.db import models


# ═════════════════════════════════════════════════════════════════════════════
# Usuario
# ─────────────────────────────────────────────────────────────────────────────
# Extiende AbstractUser de Django para agregar el campo de teléfono.
# Se utiliza como modelo de autenticación principal (AUTH_USER_MODEL).
# ═════════════════════════════════════════════════════════════════════════════
class Usuario(AbstractUser):
    """
    Modelo de usuario personalizado de MediGuard.
    Extiende AbstractUser para incluir el número de teléfono del usuario,
    utilizado en el módulo de emergencias y contactos SOS.
    """

    telefono = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        verbose_name='Teléfono',
        help_text='Número de teléfono del usuario en formato internacional. Ej: +51999888777',
    )

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f"{self.username} ({self.get_full_name() or self.email})"