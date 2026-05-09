# -*- coding: utf-8 -*-
from django.conf import settings
from django.core.validators import RegexValidator
from django.db import models


# ─── Validador de teléfono ────────────────────────────────────────────────────
# Reutilizado en ContactoEmergencia y NumeroServicioEmergencia.
# Acepta formatos internacionales: +51999888777, 51999888777, 999888777
validador_telefono = RegexValidator(
    regex=r'^\+?1?\d{7,15}$',
    message='Número inválido. Usa formato internacional: +51999888777',
)


# ═════════════════════════════════════════════════════════════════════════════
# ContactoEmergencia
# ─────────────────────────────────────────────────────────────────────────────
# Contactos personales de emergencia definidos por el usuario.
# HU-08: "Contactar servicios de emergencia desde la aplicación"
# HU-04: El botón SOS sabe a quién notificar gracias a estos contactos.
#
# Decisión de diseño:
# - ForeignKey a Usuario (no OneToOne) porque un usuario puede tener VARIOS contactos.
# - es_principal: permite al botón SOS identificar el contacto principal rápidamente
#   sin que el frontend decida esa lógica.
# - La llamada telefónica real la hace el cliente (React: protocolo tel:,
#   Android: Intent.ACTION_CALL) — el backend solo almacena el número.
# ═════════════════════════════════════════════════════════════════════════════
class ContactoEmergencia(models.Model):

    class Relacion(models.TextChoices):
        FAMILIAR = 'familiar', 'Familiar'
        AMIGO    = 'amigo',    'Amigo/a'
        MEDICO   = 'medico',   'Médico/a'
        VECINO   = 'vecino',   'Vecino/a'
        OTRO     = 'otro',     'Otro'

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='contactos_emergencia',
        verbose_name='Usuario',
    )
    nombre = models.CharField(
        max_length=100,
        verbose_name='Nombre completo',
    )
    telefono = models.CharField(
        max_length=20,
        validators=[validador_telefono],
        verbose_name='Teléfono',
    )
    relacion = models.CharField(
        max_length=20,
        choices=Relacion.choices,
        default=Relacion.OTRO,
        verbose_name='Relación',
    )
    es_principal = models.BooleanField(
        default=False,
        verbose_name='Es contacto principal',
        help_text='Contacto principal que se muestra primero en el botón SOS.',
    )
    creado_en = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Fecha de registro',
    )

    class Meta:
        verbose_name = 'Contacto de emergencia'
        verbose_name_plural = 'Contactos de emergencia'
        ordering = ['-es_principal', 'nombre']
        constraints = [
            models.UniqueConstraint(
                fields=['usuario', 'telefono'],
                name='telefono_unico_por_usuario',
            )
        ]
        indexes = [
            # SOS busca primero el contacto principal del usuario
            models.Index(fields=['usuario', 'es_principal']),
        ]

    def __str__(self):
        etiqueta = ' [Principal]' if self.es_principal else ''
        return f"{self.nombre} ({self.telefono}){etiqueta} — {self.usuario.username}"


# ═════════════════════════════════════════════════════════════════════════════
# EventoSOS
# ─────────────────────────────────────────────────────────────────────────────
# Registro de cada activación del botón SOS.
# HU-04: "Botón SOS visible para ayuda inmediata"
#
# Decisión de diseño:
# - El backend REGISTRA el evento y almacena coordenadas GPS opcionales.
# - El backend NO hace llamadas, NO envía SMS, NO envía notificaciones push.
#   Esas acciones son responsabilidad del cliente (React/Android).
# - ubicacion_* son opcionales porque en web el usuario puede no dar permisos GPS.
# - estado tiene ciclo de vida claro: activado → resuelto | falsa_alarma
# - El frontend consulta el historial vía GET /api/emergencia/sos/historial/
# ═════════════════════════════════════════════════════════════════════════════
class EventoSOS(models.Model):

    class Estado(models.TextChoices):
        ACTIVADO      = 'activado',      'Activado'
        RESUELTO      = 'resuelto',      'Resuelto'
        FALSA_ALARMA  = 'falsa_alarma',  'Falsa Alarma'

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='eventos_sos',
        verbose_name='Usuario',
    )
    estado = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.ACTIVADO,
        db_index=True,
        verbose_name='Estado',
    )
    # Coordenadas GPS opcionales — el cliente las envía si tiene permiso.
    # DecimalField: precisión de 6 decimales ≈ ~11 cm de exactitud. Suficiente.
    ubicacion_latitud = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
        verbose_name='Latitud',
        help_text='Latitud GPS del dispositivo al momento del SOS.',
    )
    ubicacion_longitud = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
        verbose_name='Longitud',
        help_text='Longitud GPS del dispositivo al momento del SOS.',
    )
    notas = models.TextField(
        blank=True,
        default='',
        verbose_name='Notas',
        help_text='Observaciones del usuario al resolver o marcar como falsa alarma.',
    )
    activado_en = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Activado el',
        help_text='Timestamp automático del momento de activación.',
    )
    resuelto_en = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Resuelto el',
        help_text='Cuándo fue resuelto o marcado como falsa alarma.',
    )

    class Meta:
        verbose_name = 'Evento SOS'
        verbose_name_plural = 'Eventos SOS'
        ordering = ['-activado_en']
        indexes = [
            models.Index(fields=['usuario', 'estado']),      # historial por usuario y estado
            models.Index(fields=['usuario', 'activado_en']), # historial cronológico
        ]

    def __str__(self):
        return f"SOS [{self.estado}] — {self.usuario.username} @ {self.activado_en:%Y-%m-%d %H:%M}"

    @property
    def tiene_ubicacion(self):
        """Indica si el evento tiene coordenadas GPS registradas."""
        return self.ubicacion_latitud is not None and self.ubicacion_longitud is not None


# ═════════════════════════════════════════════════════════════════════════════
# NumeroServicioEmergencia
# ─────────────────────────────────────────────────────────────────────────────
# Números de emergencia institucionales (112, 105, 106, etc.)
# HU-08: "Contactar servicios de emergencia desde la aplicación"
# HU-10: Pantalla principal muestra accesos rápidos a estos números.
#
# Decisión de diseño:
# - NO tiene ForeignKey a Usuario — es data global administrada desde el admin Django.
# - codigo_pais permite filtrar por país en el futuro (preparación para Android).
# - activo permite desactivar un número sin borrarlo de la BD.
# - Ordenado por prioridad: el 112 aparece primero.
# - La llamada la ejecuta el cliente — backend solo expone la lista vía GET.
# ═════════════════════════════════════════════════════════════════════════════
class NumeroServicioEmergencia(models.Model):

    class TipoServicio(models.TextChoices):
        POLICIA    = 'policia',    'Policía'
        AMBULANCIA = 'ambulancia', 'Ambulancia'
        BOMBEROS   = 'bomberos',   'Bomberos'
        GENERAL    = 'general',    'Emergencias General'
        OTRO       = 'otro',       'Otro'

    nombre = models.CharField(
        max_length=100,
        verbose_name='Nombre del servicio',
    )
    telefono = models.CharField(
        max_length=20,
        validators=[validador_telefono],
        verbose_name='Teléfono',
    )
    tipo_servicio = models.CharField(
        max_length=20,
        choices=TipoServicio.choices,
        default=TipoServicio.GENERAL,
        verbose_name='Tipo de servicio',
    )
    codigo_pais = models.CharField(
        max_length=5,
        default='PE',
        db_index=True,
        verbose_name='Código de país',
        help_text='Código ISO del país: PE, CO, MX, etc.',
    )
    descripcion = models.CharField(
        max_length=255,
        blank=True,
        default='',
        verbose_name='Descripción',
    )
    activo = models.BooleanField(
        default=True,
        db_index=True,
        verbose_name='Activo',
    )
    prioridad = models.PositiveSmallIntegerField(
        default=100,
        verbose_name='Prioridad',
        help_text='Menor número = mayor prioridad en la lista. El 112 debería tener prioridad=1.',
    )

    class Meta:
        verbose_name = 'Número de servicio de emergencia'
        verbose_name_plural = 'Números de servicios de emergencia'
        ordering = ['prioridad', 'nombre']
        constraints = [
            models.UniqueConstraint(
                fields=['telefono', 'codigo_pais'],
                name='telefono_unico_por_pais',
            )
        ]

    def __str__(self):
        estado = '✓' if self.activo else '✗'
        return f"[{estado}] {self.nombre} — {self.telefono} ({self.codigo_pais})"
