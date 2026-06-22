# -*- coding: utf-8 -*-
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import Rol, UserRole, Usuario


class SerializadorRol(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = ['id', 'name', 'description']


class SerializadorRegistro(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
    )

    class Meta:
        model = Usuario
        fields = ['first_name', 'last_name', 'email', 'phone', 'password']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'phone': {'required': False, 'allow_null': True, 'allow_blank': True},
        }

    def validate_email(self, value):
        email = value.lower()
        if Usuario.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError('Ya existe una cuenta registrada con este correo electronico.')
        return email

    def validate_phone(self, value):
        return value or None

    def create(self, validated_data):
        user = Usuario.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone=validated_data.get('phone'),
        )
        rol_ciudadano, _ = Rol.objects.get_or_create(
            name=Rol.Nombre.CIUDADANO,
            defaults={'description': 'Usuario estándar del sistema'},
        )
        UserRole.objects.get_or_create(user=user, role=rol_ciudadano, defaults={'assigned_by': None})
        return user


class SerializadorUsuario(serializers.ModelSerializer):
    roles = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name')
    is_staff = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)

    class Meta:
        model = Usuario
        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'phone',
            'is_active',
            'is_verified',
            'last_login',
            'created_at',
            'updated_at',
            'roles',
            'is_staff',
            'is_superuser',
        ]
        read_only_fields = fields


class SerializadorActualizacionUsuario(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['first_name', 'last_name', 'phone']


class SerializadorAsignacionRoles(serializers.Serializer):
    roles = serializers.ListField(
        child=serializers.ChoiceField(choices=Rol.Nombre.values),
        allow_empty=False,
    )

    def validate_roles(self, value):
        return list(dict.fromkeys(value))

    def update(self, instance, validated_data):
        roles = Rol.objects.filter(name__in=validated_data['roles'])
        roles_por_nombre = {rol.name: rol for rol in roles}
        faltantes = set(validated_data['roles']) - set(roles_por_nombre.keys())

        if faltantes:
            raise serializers.ValidationError(
                f'Roles no encontrados: {", ".join(sorted(faltantes))}'
            )

        UserRole.objects.filter(user=instance).delete()
        for rol_name in validated_data['roles']:
            UserRole.objects.create(
                user=instance,
                role=roles_por_nombre[rol_name],
                assigned_by=self.context['request'].user,
            )

        return instance

    def create(self, validated_data):
        raise NotImplementedError('Este serializer solo actualiza roles.')
