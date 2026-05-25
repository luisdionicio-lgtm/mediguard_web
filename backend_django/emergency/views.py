from rest_framework import viewsets, permissions
from .models import NumeroServicioEmergencia, EventoSOS, ContactoEmergencia
from .serializers import NumeroServicioEmergenciaSerializer, EventoSOSSerializer, ContactoEmergenciaSerializer
from django.utils import timezone

class NumeroServicioEmergenciaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NumeroServicioEmergencia.objects.filter(activo=True).order_by('prioridad')
    serializer_class = NumeroServicioEmergenciaSerializer
    permission_classes = [permissions.IsAuthenticated]

class EventoSOSViewSet(viewsets.ModelViewSet):
    serializer_class = EventoSOSSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return EventoSOS.objects.filter(usuario=self.request.user).order_by('-activado_en')

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
        
    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.estado in [EventoSOS.Estado.RESUELTO, EventoSOS.Estado.FALSA_ALARMA] and not instance.resuelto_en:
            instance.resuelto_en = timezone.now()
            instance.calcular_duracion()
            instance.save()

class ContactoEmergenciaViewSet(viewsets.ModelViewSet):
    serializer_class = ContactoEmergenciaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ContactoEmergencia.objects.filter(usuario=self.request.user).order_by('-es_principal')

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
