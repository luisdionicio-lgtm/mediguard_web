"""
Django settings for MediGuard AI — backend_django.
"""

from pathlib import Path
from datetime import timedelta
from decouple import config

# ─── Rutas base ─────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent


# ─── Seguridad ───────────────────────────────────────────────────────────────
# SECRET_KEY se lee desde .env — nunca hardcodeada en código fuente.
SECRET_KEY = config('SECRET_KEY')

# DEBUG se lee desde .env — False por defecto en producción.
DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = ['localhost', '127.0.0.1']


# ─── Aplicaciones instaladas ─────────────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',  # habilita logout real con blacklist
    'corsheaders',

    # Aplicaciones del proyecto
    'users',
    'emergency',
]

MIDDLEWARE = [
    # CorsMiddleware debe ir PRIMERO para interceptar headers antes que Django
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# ─── Base de datos ───────────────────────────────────────────────────────────
# SQLite para desarrollo — el integrante de BD puede cambiar esto a PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# ─── Modelo de usuario personalizado ─────────────────────────────────────────
# Apunta a users.Usuario (AbstractUser + telefono). NO cambiar después de la primera migración.
AUTH_USER_MODEL = 'users.Usuario'


# ─── Validación de contraseñas ───────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# ─── Internacionalización ────────────────────────────────────────────────────
LANGUAGE_CODE = 'es-pe'
TIME_ZONE = 'America/Lima'
USE_I18N = True
USE_TZ = True


# ─── Archivos estáticos ──────────────────────────────────────────────────────
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ─── CORS ────────────────────────────────────────────────────────────────────
# Lista explícita de orígenes permitidos — más seguro que CORS_ALLOW_ALL_ORIGINS.
# En producción: agregar la URL del hosting real al .env (separadas por coma).
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:5173'
).split(',')


# ─── Django REST Framework ───────────────────────────────────────────────────
# Autenticación JWT por defecto en toda la API.
# Las views públicas sobrescriben esto con permission_classes = [AllowAny].
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}


# ─── Simple JWT ──────────────────────────────────────────────────────────────
# Configuración conservadora y mantenible.
# ROTATE_REFRESH_TOKENS: cada uso del refresh genera un nuevo refresh token.
# BLACKLIST_AFTER_ROTATION: el refresh anterior queda inválido (requiere token_blacklist).
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}
