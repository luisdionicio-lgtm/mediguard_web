# -*- coding: utf-8 -*-
import secrets
import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.validators import EmailValidator, RegexValidator
from django.db import models
from django.utils import timezone


def generar_token_verificacion():
    return secrets.token_hex(32)


def vencimiento_token_24h():
    return timezone.now() + timezone.timedelta(hours=24)


class Rol(models.Model):
    """Rol del sistema segun la tabla `roles` del DDL de Sprint 1."""

    class Nombre(models.TextChoices):
        CIUDADANO = 'CIUDADANO', 'Ciudadano'
        SOCORRISTA = 'SOCORRISTA', 'Socorrista'
        COORDINADOR = 'COORDINADOR', 'Coordinador'
        ADMIN = 'ADMIN', 'Admin'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True, choices=Nombre.choices)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'roles'
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'
        ordering = ['name']

    def __str__(self):
        return self.name


class UsuarioManager(BaseUserManager):
    """Manager para autenticar usuarios con email en lugar de username."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio.')

        email = self.normalize_email(email).lower()
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_active', True)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_verified', True)

        user = self._create_user(email, password, **extra_fields)
        rol_admin, _ = Rol.objects.get_or_create(
            name=Rol.Nombre.ADMIN,
            defaults={'description': 'Administrador del sistema'},
        )
        UserRole.objects.get_or_create(user=user, role=rol_admin, defaults={'assigned_by': None})
        AuditLog.objects.filter(
            user=user,
            action='USER_REGISTERED',
        ).update(
            entity_type='admin',
            metadata={
                'email': user.email,
                'assigned_role': Rol.Nombre.ADMIN,
                'roles': [Rol.Nombre.CIUDADANO, Rol.Nombre.ADMIN],
            },
        )
        return user


class Usuario(AbstractBaseUser):
    """
    Usuario alineado con la tabla `users` del DDL.

    Django conserva el atributo `password` para autenticacion, pero lo guarda en
    la columna fisica `password_hash` mediante `db_column`.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # type: ignore
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(
        max_length=255,
        unique=True,
        validators=[EmailValidator(message='Formato de correo invalido. Ej: usuario@dominio.com')],
    )
    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^\+?\d{7,15}$',
                message='Numero invalido. Usa formato internacional: +51999888777',
            )
        ],
    )
    password = models.CharField('password', max_length=255, db_column='password_hash')
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    last_login = models.DateTimeField(blank=True, null=True, db_column='last_login_at')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    roles = models.ManyToManyField(
        Rol,
        through='UserRole',
        through_fields=('user', 'role'),
        related_name='users',
        blank=True,
    )

    objects = UsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        db_table = 'users'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        indexes = [
            models.Index(fields=['email'], name='idx_users_email'),
            models.Index(
                fields=['is_active'],
                name='idx_users_is_active',
                condition=models.Q(is_active=True),
            ),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(email__regex=r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
                name='chk_email_format',
            ),
        ]

    def __str__(self):
        return f'{self.get_full_name()} <{self.email}>'

    @property
    def username(self):
        """Compatibilidad de lectura para codigo que aun espere `username`."""
        return self.email

    @property
    def is_staff(self):
        return self.roles.filter(name=Rol.Nombre.ADMIN).exists()

    @property
    def is_superuser(self):
        return self.is_staff

    def has_perm(self, perm, obj=None):
        return self.is_staff

    def has_module_perms(self, app_label):
        return self.is_staff

    def get_full_name(self):
        return f'{self.first_name} {self.last_name}'.strip()

    def get_short_name(self):
        return self.first_name or self.email


class UserRole(models.Model):
    """Tabla pivote `user_roles` para la relacion N:M entre usuarios y roles."""

    pk = models.CompositePrimaryKey('user', 'role')
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='user_id')
    role = models.ForeignKey(Rol, on_delete=models.RESTRICT, db_column='role_id')
    assigned_at = models.DateTimeField(auto_now_add=True)
    assigned_by = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='roles_asignados',
        db_column='assigned_by',
    )

    class Meta:
        db_table = 'user_roles'
        verbose_name = 'Rol de usuario'
        verbose_name_plural = 'Roles de usuario'

    def __str__(self):
        return f'{self.user.email} -> {self.role.name}'


class VerificationToken(models.Model):
    """Tokens de verificacion, recuperacion de clave y telefono."""

    class TokenType(models.TextChoices):
        EMAIL_VERIFICATION = 'EMAIL_VERIFICATION', 'Verificacion de email'
        PASSWORD_RESET = 'PASSWORD_RESET', 'Restablecimiento de password'
        PHONE_VERIFICATION = 'PHONE_VERIFICATION', 'Verificacion de telefono'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='verification_tokens')
    token = models.CharField(max_length=255, unique=True, default=generar_token_verificacion)
    token_type = models.CharField(max_length=50, choices=TokenType.choices)
    expires_at = models.DateTimeField(default=vencimiento_token_24h)
    used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'verification_tokens'
        verbose_name = 'Token de verificacion'
        verbose_name_plural = 'Tokens de verificacion'
        indexes = [
            models.Index(fields=['user'], name='idx_tokens_user_id'),
            models.Index(fields=['token'], name='idx_tokens_token', condition=models.Q(used=False)),
        ]
        constraints = [
            models.CheckConstraint(
                condition=~models.Q(used=True, expires_at__lt=models.F('created_at')),
                name='chk_token_not_expired_when_used',
            ),
        ]

    def __str__(self):
        return f'{self.token_type} - {self.user.email}'


class AuditLog(models.Model):
    """Bitacora de acciones relevantes del sistema."""

    objects = models.Manager()

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='audit_logs',
    )
    action = models.CharField(max_length=100)
    entity_type = models.CharField(max_length=50, blank=True, null=True)
    entity_id = models.UUIDField(blank=True, null=True)
    metadata = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'audit_log'
        verbose_name = 'Registro de auditoria'
        verbose_name_plural = 'Registros de auditoria'
        indexes = [
            models.Index(fields=['user'], name='idx_audit_user_id'),
            models.Index(fields=['action'], name='idx_audit_action'),
            models.Index(fields=['-created_at'], name='idx_audit_created'),
        ]

    def __str__(self):
        return f'{self.action} @ {self.created_at:%Y-%m-%d %H:%M}'
