from rest_framework import serializers
from .models import Course, Lesson, Quiz, CourseRating, Enrollment, Certificate
from categorias.models import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ('id', 'name', 'slug', 'parent', 'icon_url', 'created_at')


class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Quiz
        fields = ('id', 'question', 'options', 'correct_option', 'explanation')


class LessonSerializer(serializers.ModelSerializer):
    quizzes = QuizSerializer(many=True, read_only=True)

    class Meta:
        model  = Lesson
        fields = (
            'id', 'course', 'title', 'content', 'media_url',
            'media_type', 'order_index', 'duration_min', 'is_free',
            'created_at', 'quizzes',
        )


class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model  = Course
        fields = (
            'id', 'category', 'author', 'title', 'slug', 'description',
            'thumbnail_url', 'level', 'duration_min', 'is_published',
            'published_at', 'created_at', 'updated_at', 'lessons',
        )
        read_only_fields = ('duration_min', 'updated_at')


class CourseRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CourseRating
        fields = ('id', 'user', 'course', 'score', 'comment', 'created_at')


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Enrollment
        fields = ('id', 'user', 'course', 'enrolled_at', 'completed_at')
        read_only_fields = ('enrolled_at', 'completed_at')


class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Certificate
        fields = ('id', 'enrollment', 'code', 'issued_at')
