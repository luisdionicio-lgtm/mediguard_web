# -*- coding: utf-8 -*-
import uuid

from django.contrib.auth.models import AbstractUser
from django.core.validators import EmailValidator, RegexValidator
from django.db import models


# =============================================================================
# Usuario
# -----------------------------------------------------------------------------
# Extiende AbstractUser alineado con el esquema SQL definido por el DBA.
#
# Equivalencia con la tabla SQL del DBA:
#   id            -> UUID PRIMARY KEY          (uuid.uuid4)
#   first_name    -> VARCHAR(100) NOT NULL     (override AbstractUser 150->100)
#   last_name     -> VARCHAR(100) NOT NULL     (override AbstractUser 150->100)
#   email         -> VARCHAR(255) UNIQUE       (override AbstractUser + unique)
#   phone         -> telefono VARCHAR(20) UNIQUE
#   password_hash -> password (manejado por AbstractUser / PBKDF2)
#   is_active     -> is_active (heredado de AbstractUser)
#   is_verified   -> esta_verificado BOOLEAN DEFAULT FALSE
#   last_login_at -> last_login (heredado de AbstractUser)
#   created_at    -> date_joined (heredado de AbstractUser)
#   updated_at    -> actualizado_en TIMESTAMPTZ auto_now
# =============================================================================
class Usuario(AbstractUser):
    """
    Modelo de usuario personalizado de MediGuard.
    Alineado con el esquema SQL del DBA.
    Extiende AbstractUser para incluir datos de perfil personal
    utilizados en el modulo de emergencias, contactos SOS y analitica.
    """

    class Genero(models.TextChoices):
        MASCULINO        = 'M', 'Masculino'
        FEMENINO         = 'F', 'Femenino'
        OTRO             = 'O', 'Otro'
        PREFIERO_NO_DECIR = 'N', 'Prefiero no decir'

    # ── Clave primaria UUID ────────────────────────────────────────────────────
    # Equivale a: id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name='ID',
    )

    # ── Nombre y apellido (override AbstractUser: 150 -> 100) ─────────────────
    # Equivale a: first_name VARCHAR(100) NOT NULL
    #             last_name  VARCHAR(100) NOT NULL
    first_name = models.CharField(
        max_length=100,
        verbose_name='Nombre',
        help_text='Nombre(s) del usuario.',
    )
    last_name = models.CharField(
        max_length=100,
        verbose_name='Apellido',
        help_text='Apellido(s) del usuario.',
    )

    # ── Correo electronico (override AbstractUser: sin unique -> UNIQUE) ───────
    # Equivale a: email VARCHAR(255) NOT NULL UNIQUE
    #             CONSTRAINT chk_email_format CHECK (email ~* '^...$')
    email = models.EmailField(
        max_length=255,
        unique=True,
        verbose_name='Correo electronico',
        validators=[EmailValidator(message='Formato de correo invalido. Ej: usuario@dominio.com')],
        help_text='Direccion de correo unica por usuario. Ej: maria@gmail.com',
    )

    # ── Telefono (phone UNIQUE) ────────────────────────────────────────────────
    # Equivale a: phone VARCHAR(20) UNIQUE
    telefono = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        unique=True,
        verbose_name='Telefono',
        validators=[
            RegexValidator(
                regex=r'^\+?\d{7,15}$',
                message='Numero invalido. Usa formato internacional: +51999888777',
            )
        ],
        help_text='Numero de telefono en formato internacional. Ej: +51999888777',
    )

    # ── Perfil personal ────────────────────────────────────────────────────────
    fecha_nacimiento = models.DateField(
        null=True,
        blank=True,
        verbose_name='Fecha de nacimiento',
        help_text='Utilizada para calcular la edad del usuario en reportes.',
    )
    foto_perfil = models.ImageField(
        upload_to='usuarios/fotos/',
        null=True,
        blank=True,
        verbose_name='Foto de perfil',
        help_text='Avatar del usuario. Ruta relativa en /media/usuarios/fotos/',
    )
    genero = models.CharField(
        max_length=1,
        choices=Genero.choices,
        blank=True,
        null=True,
        verbose_name='Genero',
    )
    pais = models.CharField(
        max_length=5,
        default='PE',
        verbose_name='Pais',
        help_text='Codigo ISO del pais. Ej: PE, CO, MX. Filtra servicios de emergencia locales.',
    )

    # ── Verificacion de cuenta ─────────────────────────────────────────────────
    # Equivale a: is_verified BOOLEAN NOT NULL DEFAULT FALSE
    esta_verificado = models.BooleanField(
        default=False,
        verbose_name='Cuenta verificada',
        help_text='True cuando el usuario confirma su correo electronico.',
    )

    # ── Auditoria ──────────────────────────────────────────────────────────────
    # Equivale a: updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    # Nota: created_at = date_joined (AbstractUser), last_login_at = last_login (AbstractUser)
    actualizado_en = models.DateTimeField(
        auto_now=True,
        verbose_name='Ultima actualizacion',
    )

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        indexes = [
            models.Index(fields=['email']),           # busqueda rapida por correo
            models.Index(fields=['pais']),             # filtrar usuarios por pais
            models.Index(fields=['esta_verificado']),  # analitica: verificados vs pendientes
        ]
        constraints = [
            # Equivale a: CONSTRAINT chk_email_format CHECK (email ~* '^...$')
            # Nota: la validacion real la hace EmailValidator en Python.
            # En PostgreSQL, Django crea un CheckConstraint si se especifica aqui.
            models.CheckConstraint(
                condition=models.Q(email__icontains='@'),
                name='chk_email_contiene_arroba',
            ),
        ]

    def __str__(self):
        return f"{self.get_full_name() or self.username} <{self.email}>"

    @property
    def nombre_completo(self):
        """Retorna el nombre completo del usuario."""
        return self.get_full_name()

    @property
    def edad(self):
        """Calcula la edad en anos. Retorna None si no hay fecha de nacimiento."""
        if not self.fecha_nacimiento:
            return None
        from datetime import date
        hoy = date.today()
        return hoy.year - self.fecha_nacimiento.year - (
            (hoy.month, hoy.day) < (self.fecha_nacimiento.month, self.fecha_nacimiento.day)
        )