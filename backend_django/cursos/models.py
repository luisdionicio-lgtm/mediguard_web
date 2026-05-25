import uuid
from django.conf import settings
from django.db import models
from categorias.models import Category


class CourseLevel(models.TextChoices):
    BASICO     = 'BASICO',     'Básico'
    INTERMEDIO = 'INTERMEDIO', 'Intermedio'
    AVANZADO   = 'AVANZADO',   'Avanzado'


class MediaType(models.TextChoices):
    VIDEO   = 'VIDEO',   'Video'
    AUDIO   = 'AUDIO',   'Audio'
    PDF     = 'PDF',     'PDF'
    IMAGEN  = 'IMAGEN',  'Imagen'
    NINGUNO = 'NINGUNO', 'Ninguno'


# ── TABLAS DJANGO (managed=True) ─────────────────────────────────────────────

class Course(models.Model):
    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category      = models.ForeignKey(
        Category, null=True, blank=True,
        on_delete=models.SET_NULL, related_name='courses'
    )
    author        = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT, related_name='courses_authored'
    )
    title         = models.CharField(max_length=255)
    slug          = models.SlugField(max_length=255, unique=True)
    description   = models.TextField(blank=True, null=True)
    thumbnail_url = models.URLField(max_length=500, blank=True, null=True)
    level         = models.CharField(max_length=20, choices=CourseLevel.choices, default=CourseLevel.BASICO)
    duration_min  = models.IntegerField(default=0)
    is_published  = models.BooleanField(default=False)
    published_at  = models.DateTimeField(null=True, blank=True)
    created_at    = models.DateTimeField(auto_now_add=True)
    # auto_now_add=True: Django lo fija en INSERT y nunca lo incluye en UPDATE.
    # El trigger trg_courses_updated_at lo sobreescribe en cada UPDATE.
    updated_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table            = 'courses'
        managed             = True
        verbose_name        = 'Curso'
        verbose_name_plural = 'Cursos'

    def __str__(self):
        return self.title


class Lesson(models.Model):
    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course       = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title        = models.CharField(max_length=255)
    content      = models.TextField(blank=True, null=True)
    media_url    = models.URLField(max_length=500, blank=True, null=True)
    media_type   = models.CharField(max_length=20, choices=MediaType.choices, default=MediaType.NINGUNO)
    order_index  = models.IntegerField(default=0)
    duration_min = models.IntegerField(default=0)
    is_free      = models.BooleanField(default=False)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table        = 'lessons'
        managed         = True
        unique_together = [('course', 'order_index')]
        ordering        = ['order_index']

    def __str__(self):
        return f'{self.course.title} — {self.title}'


class Quiz(models.Model):
    id             = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lesson         = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='quizzes')
    question       = models.TextField()
    options        = models.JSONField()  # [{"key": "A", "text": "..."}, ...]
    correct_option = models.CharField(max_length=5)
    explanation    = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'quizzes'
        managed  = True

    def __str__(self):
        return f'Quiz: {self.question[:50]}'


class CourseRating(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course     = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='ratings')
    score      = models.IntegerField()  # 1-5, validado en admin/serializer
    comment    = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table        = 'course_ratings'
        managed         = True
        unique_together = [('user', 'course')]

    def __str__(self):
        return f'{self.user} → {self.course} ({self.score}★)'


# ── TABLAS SPRING BOOT (managed=False) ───────────────────────────────────────

class Enrollment(models.Model):
    """Dueño: Spring Boot — Django solo referencia para el admin."""
    id           = models.UUIDField(primary_key=True, editable=False)
    user         = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING)
    course       = models.ForeignKey(Course, on_delete=models.DO_NOTHING, related_name='enrollments')
    enrolled_at  = models.DateTimeField()
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table        = 'enrollments'
        managed         = False
        unique_together = [('user', 'course')]

    def __str__(self):
        return f'{self.user} → {self.course}'


class UserLessonProgress(models.Model):
    """Dueño: Spring Boot."""
    id           = models.UUIDField(primary_key=True, editable=False)
    enrollment   = models.ForeignKey(Enrollment, on_delete=models.DO_NOTHING)
    lesson       = models.ForeignKey(Lesson, on_delete=models.DO_NOTHING)
    completed    = models.BooleanField(default=False)
    score        = models.IntegerField(null=True, blank=True)
    attempts     = models.IntegerField(default=0)
    last_seen_at = models.DateTimeField()

    class Meta:
        db_table        = 'user_lesson_progress'
        managed         = False
        unique_together = [('enrollment', 'lesson')]

    def __str__(self):
        status = 'completada' if self.completed else 'en progreso'
        return f'{self.enrollment} — lección {self.lesson_id} ({status})'


class Certificate(models.Model):
    """Dueño: trigger PostgreSQL — emitido automáticamente al completar el curso."""
    id          = models.UUIDField(primary_key=True, editable=False)
    enrollment  = models.OneToOneField(Enrollment, on_delete=models.DO_NOTHING)
    code        = models.CharField(max_length=64, unique=True)
    issued_at   = models.DateTimeField()

    class Meta:
        db_table = 'certificates'
        managed  = False

    def __str__(self):
        return f'Certificado {self.code}'
