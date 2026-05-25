from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GuideViewSet, HospitalViewSet, NewsViewSet

router = DefaultRouter()
router.register(r'guides', GuideViewSet, basename='guide')
router.register(r'hospitals', HospitalViewSet, basename='hospital')
router.register(r'news', NewsViewSet, basename='news')

urlpatterns = [
    path('', include(router.urls)),
]
