from django.contrib import admin
from django.urls import include, path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    base_url = request.build_absolute_uri('/api/')
    auth_base_url = request.build_absolute_uri('/api/auth/')

    return Response({
        'mensaje': 'MediGuard AI API',
        'auth': {
            'register': f'{base_url}register/',
            'login': f'{base_url}login/',
            'token_refresco': f'{auth_base_url}token/refresco/',
            'profile': f'{base_url}profile/',
            'cerrar_sesion': f'{base_url}logout/',
            'usuarios': f'{base_url}users/',
        },
        'legacy_auth': {
            'registro': f'{auth_base_url}registro/',
            'perfil': f'{auth_base_url}perfil/',
            'cerrar_sesion': f'{auth_base_url}cerrar-sesion/',
        },
        'contenido': {
            'guias': f'{base_url}guides/',
            'hospitales': f'{base_url}hospitals/',
            'noticias': f'{base_url}news/',
        },
        'emergencia': {
            'numeros': f'{base_url}emergency-numbers/',
            'sos': f'{base_url}sos-events/',
            'contactos': f'{base_url}emergency-contacts/',
        },
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/auth/', include('users.urls')),
    path('api/', include('users.urls')),
    path('api/', include('content.urls')),
    path('api/', include('emergency.urls')),
]
