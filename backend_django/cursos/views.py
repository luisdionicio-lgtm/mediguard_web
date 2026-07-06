# -*- coding: utf-8 -*-
from django.db.models import Avg, Count, Q
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from categorias.models import Category
from .models import Course, CourseRating
from .serializers import (
    CategorySerializer,
    CourseListSerializer,
    CourseDetailSerializer,
    LessonSerializer,
    CourseRatingSerializer,
)


class CoursePagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'limit'
    max_page_size = 50


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    # Catálogo requiere sesión: cambio de criterio de producto — el listado y
    # detalle de cursos solo se muestran a usuarios autenticados.
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CoursePagination
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseListSerializer

    def get_queryset(self):
        qs = (
            Course.objects.filter(is_published=True)
            .select_related('category', 'author')
            .annotate(
                rating_avg=Avg('ratings__score'),
                lesson_count=Count('lessons', distinct=True),
            )
        )

        params = self.request.query_params

        category = params.get('category')
        if category:
            qs = qs.filter(category__slug=category)

        level = params.get('level')
        if level:
            qs = qs.filter(level=level)

        search = params.get('search', '').strip()
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(description__icontains=search))

        duration = params.get('duration')
        if duration == '<1h':
            qs = qs.filter(duration_min__lt=60)
        elif duration == '1-3h':
            qs = qs.filter(duration_min__gte=60, duration_min__lt=180)
        elif duration == '+3h':
            qs = qs.filter(duration_min__gte=180)

        ordering = params.get('ordering', '-published_at')
        if ordering == '-rating':
            qs = qs.order_by('-rating_avg', '-published_at')
        else:
            qs = qs.order_by('-published_at')

        return qs

    @action(detail=True, methods=['get'])
    def lessons(self, request, slug=None):
        course = self.get_object()
        lessons = course.lessons.prefetch_related('quizzes').order_by('order_index')
        return Response(LessonSerializer(lessons, many=True).data)

    @action(detail=True, methods=['get', 'post'])
    def ratings(self, request, slug=None):
        course = self.get_object()
        if request.method == 'GET':
            ratings = CourseRating.objects.filter(course=course).select_related('user').order_by('-created_at')
            return Response(CourseRatingSerializer(ratings, many=True).data)

        data = {**request.data, 'course': str(course.id), 'user': str(request.user.id)}
        existing = CourseRating.objects.filter(course=course, user=request.user).first()
        serializer = CourseRatingSerializer(existing, data=data) if existing else CourseRatingSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    # Catálogo requiere sesión: mismo criterio que CourseViewSet.
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
