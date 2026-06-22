from django.contrib import admin
from django.urls import include, path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    base_url = request.build_absolute_uri('/api/')

    return Response({
        'message': 'MediGuard AI API',
        'auth': {
            'register': f'{base_url}register/',
            'login': f'{base_url}login/',
            'token_refresh': f'{base_url}token/refresh/',
            'profile': f'{base_url}profile/',
            'logout': f'{base_url}logout/',
            'users': f'{base_url}users/',
        },
        'content': {
            'guides': f'{base_url}guides/',
            'hospitals': f'{base_url}hospitals/',
            'news': f'{base_url}news/',
        },
        'emergency': {
            'numbers': f'{base_url}emergency-numbers/',
            'sos': f'{base_url}sos-events/',
            'contacts': f'{base_url}emergency-contacts/',
        },
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/', include('users.urls')),
    path('api/', include('content.urls')),
    path('api/', include('emergency.urls')),
    path('api/', include('cursos.urls')),
]
