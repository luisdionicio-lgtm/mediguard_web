from rest_framework import viewsets, permissions
from .models import Guide, Hospital, News
from .serializers import GuideSerializer, HospitalSerializer, NewsSerializer

class GuideViewSet(viewsets.ModelViewSet):
    queryset = Guide.objects.all().order_by('-created_at')
    serializer_class = GuideSerializer
    permission_classes = [permissions.IsAuthenticated]

class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.filter(is_active=True).order_by('name')
    serializer_class = HospitalSerializer
    permission_classes = [permissions.IsAuthenticated]

class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.filter(is_active=True).order_by('-published_date')
    serializer_class = NewsSerializer
    permission_classes = [permissions.IsAuthenticated]
