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
    'users.apps.UsersConfig',
    'emergency',
    'content',
    'categorias',
    'cursos.apps.CursosConfig',
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
# PostgreSQL real configurado por variables de entorno, o SQLite para desarrollo local
DB_ENGINE = config('DB_ENGINE', default='django.db.backends.sqlite3')

if DB_ENGINE == 'django.db.backends.sqlite3':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': DB_ENGINE,
            'NAME': config('DB_NAME', default='mediguard'),
            'USER': config('DB_USER', default='postgres'),
            'PASSWORD': config('DB_PASSWORD'),
            'HOST': config('DB_HOST', default='localhost'),
            'PORT': config('DB_PORT', default='5432'),
        }
    }


# ─── Modelo de usuario personalizado ─────────────────────────────────────────
# Apunta a users.Usuario, modelo personalizado alineado al DDL de Sprint 1.
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
        'users.authentication.SpringCompatibleJWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}


# ─── Simple JWT ──────────────────────────────────────────────────────────────
# SIGNING_KEY usa JWT_SECRET para que Spring Boot pueda validar los mismos tokens.
# Si JWT_SECRET no está definido, cae al SECRET_KEY de Django (solo dev local).
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'SIGNING_KEY': config('JWT_SECRET', default=None) or SECRET_KEY,
    'TOKEN_OBTAIN_SERIALIZER': 'users.tokens.CustomTokenObtainPairSerializer',
}
