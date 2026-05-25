from django.contrib import admin
from .models import Course, Lesson, Quiz, CourseRating, Enrollment, Certificate


class LessonInline(admin.TabularInline):
    model    = Lesson
    extra    = 0
    fields   = ('title', 'order_index', 'duration_min', 'media_type', 'is_free')
    ordering = ('order_index',)


class QuizInline(admin.TabularInline):
    model  = Quiz
    extra  = 0
    fields = ('question', 'correct_option')


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display        = ('title', 'category', 'level', 'duration_min', 'is_published', 'published_at')
    list_filter         = ('level', 'is_published', 'category')
    search_fields       = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    inlines             = [LessonInline]
    readonly_fields     = ('id', 'duration_min', 'created_at', 'updated_at')


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display  = ('title', 'course', 'order_index', 'duration_min', 'is_free')
    list_filter   = ('media_type', 'is_free')
    search_fields = ('title',)
    readonly_fields = ('id', 'created_at')
    inlines       = [QuizInline]


@admin.register(CourseRating)
class CourseRatingAdmin(admin.ModelAdmin):
    list_display  = ('user', 'course', 'score', 'created_at')
    list_filter   = ('score',)
    readonly_fields = ('id', 'created_at')


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display    = ('user', 'course', 'enrolled_at', 'completed_at')
    list_filter     = ('completed_at',)
    readonly_fields = ('id', 'user', 'course', 'enrolled_at', 'completed_at')


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display    = ('code', 'enrollment', 'issued_at')
    readonly_fields = ('id', 'code', 'enrollment', 'issued_at')
