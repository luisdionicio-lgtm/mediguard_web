from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NumeroServicioEmergenciaViewSet, EventoSOSViewSet, ContactoEmergenciaViewSet

router = DefaultRouter()
router.register(r'emergency-numbers', NumeroServicioEmergenciaViewSet, basename='emergency-number')
router.register(r'sos-events', EventoSOSViewSet, basename='sos-event')
router.register(r'emergency-contacts', ContactoEmergenciaViewSet, basename='emergency-contact')

urlpatterns = [
    path('', include(router.urls)),
]
