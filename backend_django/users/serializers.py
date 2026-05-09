# -*- coding: utf-8 -*-
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Usuario


# ─────────────────────────────────────────────────────────────────────────────
# SerializadorRegistro
# Responsabilidad: validar y crear un nuevo usuario.
# Solo se usa en POST /api/auth/registro/
# La contraseña es write_only — nunca se devuelve en la respuesta.
# Valida unicidad de correo (AbstractUser no lo hace por defecto).
# ─────────────────────────────────────────────────────────────────────────────
class SerializadorRegistro(serializers.ModelSerializer):
    contrasena = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        source='password',
    )

    class Meta:
        model = Usuario
        fields = ['username', 'email', 'contrasena', 'first_name', 'telefono']
        extra_kwargs = {
            'email':      {'required': True},
            'first_name': {'required': False, 'default': ''},
            'telefono':   {'required': False, 'default': ''},
        }

    def validate_email(self, value):
        """
        AbstractUser permite correos duplicados por defecto.
        Esta validación asegura unicidad a nivel de serializer
        sin necesidad de modificar el modelo ni hacer nuevas migraciones.
        """
        if Usuario.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                'Ya existe una cuenta registrada con este correo electrónico.'
            )
        return value.lower()  # normalizar a minúsculas

    def create(self, validated_data):
        return Usuario.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            telefono=validated_data.get('telefono', ''),
        )


# ─────────────────────────────────────────────────────────────────────────────
# SerializadorUsuario
# Responsabilidad: exponer datos del usuario autenticado (solo lectura).
# Se usa en GET /api/auth/perfil/
# Nunca expone la contraseña. Todos los campos son read_only.
# ─────────────────────────────────────────────────────────────────────────────
class SerializadorUsuario(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'telefono', 'date_joined']
        read_only_fields = ['id', 'username', 'email', 'date_joined']


# ─────────────────────────────────────────────────────────────────────────────
# SerializadorActualizacionUsuario
# Responsabilidad: permitir actualización parcial del perfil.
# Se usa en PATCH /api/auth/perfil/
# Solo permite cambiar campos de perfil — NO permite cambiar username, email ni contraseña.
# El cambio de contraseña requiere un endpoint dedicado (fuera del scope actual).
# ─────────────────────────────────────────────────────────────────────────────
class SerializadorActualizacionUsuario(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['first_name', 'last_name', 'telefono']