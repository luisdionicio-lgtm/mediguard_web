from rest_framework import serializers
from .models import NumeroServicioEmergencia, EventoSOS, ContactoEmergencia

class NumeroServicioEmergenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = NumeroServicioEmergencia
        fields = '__all__'

class EventoSOSSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventoSOS
        fields = '__all__'
        read_only_fields = ['usuario', 'activado_en', 'resuelto_en', 'duracion_segundos']

class ContactoEmergenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactoEmergencia
        fields = '__all__'
        read_only_fields = ['usuario']
