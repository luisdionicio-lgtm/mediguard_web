# 🗄️ MediGuard AI — Documentación del Esquema de Base de Datos

> **Dirigido a:** Administrador de Base de Datos  
> **Preparado por:** Equipo Backend  
> **Fecha:** 2026-05-11  
> **Motor de BD:** SQLite (desarrollo) → PostgreSQL (producción)  
> **ORM:** Django ORM — las migraciones se generan automáticamente desde los modelos Python.

---

## Tabla de Contenidos

1. [Visión General](#1-visión-general)
2. [Diagrama ER](#2-diagrama-er)
3. [Tabla: `users_usuario`](#3-tabla-users_usuario)
4. [Tabla: `emergency_contactoemergencia`](#4-tabla-emergency_contactoemergencia)
5. [Tabla: `emergency_eventoSOS`](#5-tabla-emergency_eventosos)
6. [Tabla: `emergency_numeroservicioemergencia`](#6-tabla-emergency_numeroservicioemergencia)
7. [Constraints e Índices](#7-constraints-e-índices)
8. [Notas para Migración a PostgreSQL](#8-notas-para-migración-a-postgresql)

---

## 1. Visión General

MediGuard AI es una aplicación de salud y emergencias médicas. La base de datos está dividida en dos aplicaciones Django:

| App Django   | Responsabilidad                                              |
|--------------|--------------------------------------------------------------|
| `users`      | Autenticación, perfil de usuario, roles                      |
| `emergency`  | Contactos de emergencia, historial SOS, servicios nacionales |

### Convención de nombres de tablas

Django genera el nombre de tabla como `{app}_{modelo_en_minúsculas}`. Ejemplo:
- App `users`, modelo `Usuario` → tabla **`users_usuario`**
- App `emergency`, modelo `ContactoEmergencia` → tabla **`emergency_contactoemergencia`**

---

## 2. Diagrama ER

```
┌──────────────────────────────────┐
│          users_usuario           │
│  PK  id (UUID)                   │  ← gen_random_uuid()
│      username (UNIQUE)           │
│      first_name  VARCHAR(100)    │  ← override 150→100
│      last_name   VARCHAR(100)    │  ← override 150→100
│      email       VARCHAR(255)    │  ← UNIQUE + CHECK formato
│      password    VARCHAR(128)    │  ← hash PBKDF2
│      telefono    VARCHAR(20)     │  ← UNIQUE nullable
│      fecha_nacimiento            │
│      foto_perfil                 │
│      genero                      │
│      pais        DEFAULT 'PE'    │
│      esta_verificado DEFAULT FALSE│
│      is_active   DEFAULT TRUE    │
│      is_staff    DEFAULT FALSE   │
│      date_joined = created_at    │
│      last_login  = last_login_at │
│      actualizado_en = updated_at │
└─────────────┬────────────────────┘
             │ 1
             │
     ┌───────┴──────────────────────────────────────┐
     │                                              │
     │ N                                            │ N
┌────▼──────────────────────────┐    ┌─────────────▼──────────────────┐
│  emergency_contactoemergencia │    │     emergency_eventosos        │
│  PK  id                       │    │  PK  id                        │
│  FK  usuario_id               │    │  FK  usuario_id                │
│      nombre                   │    │      estado                    │
│      telefono                 │    │      ubicacion_latitud         │
│      relacion                 │    │      ubicacion_longitud        │
│      es_principal             │    │      notas                     │
│      email                    │    │      dispositivo               │
│      notas                    │    │      direccion_aproximada      │
│      creado_en                │    │      duracion_segundos         │
│      actualizado_en           │    │      contactos_notificados     │
└───────────────────────────────┘    │      activado_en               │
                                     │      resuelto_en               │
                                     └────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│       emergency_numeroservicioemergencia          │
│  PK  id                                          │
│      nombre                                      │
│      telefono                                    │
│      tipo_servicio                               │
│      codigo_pais                                 │
│      descripcion                                 │
│      activo                                      │
│      prioridad                                   │
│      icono                                       │
│      url_sitio_web                               │
│      horario_atencion                            │
│      creado_en                                   │
│      actualizado_en                              │
└──────────────────────────────────────────────────┘
  ⚠ Sin FK a usuarios — es data global administrativa
```

---

## 3. Tabla: `users_usuario`

> Hereda los campos base de `AbstractUser` de Django. **Alineada con el esquema SQL del DBA.**  
> Equivalencia directa: `id=UUID`, `email=UNIQUE`, `phone=telefono UNIQUE`, `is_verified=esta_verificado`, `created_at=date_joined`, `last_login_at=last_login`, `updated_at=actualizado_en`.

| Columna             | Tipo Django           | Tipo SQL (PostgreSQL)          | Nullable | Default      | Equivale al SQL del DBA        |
|---------------------|-----------------------|--------------------------------|----------|--------------|--------------------------------|
| `id`                | `UUIDField`           | `UUID PRIMARY KEY`             | No       | `uuid4()`    | `id UUID DEFAULT gen_random_uuid()` |
| `username`          | `CharField(150)`      | `VARCHAR(150) UNIQUE`          | No       | —            | *(campo propio de Django)*     |
| `first_name`        | `CharField(100)`      | `VARCHAR(100) NOT NULL`        | No       | `''`         | `first_name VARCHAR(100)`      |
| `last_name`         | `CharField(100)`      | `VARCHAR(100) NOT NULL`        | No       | `''`         | `last_name  VARCHAR(100)`      |
| `email`             | `EmailField(255)`     | `VARCHAR(255) NOT NULL UNIQUE` | No       | —            | `email VARCHAR(255) NOT NULL UNIQUE` |
| `password`          | `CharField(128)`      | `VARCHAR(128) NOT NULL`        | No       | —            | `password_hash VARCHAR(255)`   |
| `telefono`          | `CharField(20)`       | `VARCHAR(20) UNIQUE`           | Sí       | `NULL`       | `phone VARCHAR(20) UNIQUE`     |
| `is_active`         | `BooleanField`        | `BOOLEAN NOT NULL`             | No       | `TRUE`       | `is_active BOOLEAN DEFAULT TRUE` |
| `is_staff`          | `BooleanField`        | `BOOLEAN NOT NULL`             | No       | `FALSE`      | *(rol de admin Django)*        |
# 🗄️ MediGuard AI — Documentación del Esquema de Base de Datos

> **Dirigido a:** Administrador de Base de Datos  
> **Preparado por:** Equipo Backend  
> **Fecha:** 2026-05-12  
> **Motor de BD:** PostgreSQL  
> **Fuente de verdad:** DDL definitivo del sprint 1

---

## Tabla de Contenidos

1. [Visión General](#1-visión-general)
2. [Diagrama ER](#2-diagrama-er)
3. [Tabla: `roles`](#3-tabla-roles)
4. [Tabla: `users`](#4-tabla-users)
5. [Tabla pivote: `user_roles`](#5-tabla-pivote-user_roles)
6. [Tabla: `verification_tokens`](#6-tabla-verification_tokens)
7. [Tabla: `audit_log`](#7-tabla-audit_log)
8. [Constraints e Índices](#8-constraints-e-índices)
9. [Notas para PostgreSQL](#9-notas-para-postgresql)

---

## 1. Visión General

El esquema definitivo del sistema de primeros auxilios se centra en autenticación, autorización por roles, trazabilidad de acciones y tokens de verificación.

| Tabla | Responsabilidad |
|------|------------------|
| `roles` | Catálogo de roles del sistema |
| `users` | Usuarios autenticables del sistema |
| `user_roles` | Relación N:M entre usuarios y roles |
| `verification_tokens` | Tokens para verificación de correo, contraseña o teléfono |
| `audit_log` | Registro de auditoría de acciones relevantes |

### Convención de nombres de tablas

Se usa el nombre explícito definido en el DDL. No depende de la convención automática de Django para este documento.

---

## 2. Diagrama ER

```
┌──────────────────────────────┐
│           roles              │
│  PK  id UUID                 │
│      name UNIQUE             │
│      description             │
│      created_at              │
└─────────────┬────────────────┘
              │ 1
              │
              │ N
┌─────────────▼────────────────┐
│         user_roles           │
│  PK/FK user_id               │
│  PK/FK role_id               │
│      assigned_at             │
│      assigned_by FK → users  │
└─────────────┬────────────────┘
              │ N
              │
              │ 1
┌─────────────▼────────────────┐        ┌──────────────────────────────┐
│            users             │◄───────┤   verification_tokens        │
│  PK  id UUID                 │ 1   N  │  PK  id UUID                 │
│      first_name              │        │  FK  user_id                 │
│      last_name               │        │      token UNIQUE            │
│      email UNIQUE            │        │      token_type              │
│      phone UNIQUE            │        │      expires_at              │
│      password_hash           │        │      used                    │
│      is_active               │        │      created_at              │
│      is_verified             │        └──────────────────────────────┘
│      last_login_at           │
│      created_at              │        ┌──────────────────────────────┐
│      updated_at              │        │          audit_log           │
└─────────────┬────────────────┘        │  PK  id UUID                 │
              │                         │  FK  user_id                 │
              │ 1                       │      action                  │
              │                         │      entity_type             │
              │ N                       │      entity_id               │
┌─────────────▼────────────────┐        │      metadata JSONB          │
│          audit_log           │        │      created_at              │
└──────────────────────────────┘        └──────────────────────────────┘
```

---

## 3. Tabla: `roles`

> Catálogo de roles del sistema. Se carga con datos semilla al crear la base de datos.

| Columna | Tipo SQL | Nullable | Default | Descripción |
|--------|----------|----------|---------|-------------|
| `id` | `UUID` | No | `gen_random_uuid()` | Clave primaria |
| `name` | `VARCHAR(50)` | No | — | Nombre único del rol |
| `description` | `TEXT` | Sí | `NULL` | Descripción funcional del rol |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Fecha de creación |

### Datos semilla — `roles`

| name | description |
|------|-------------|
| `CIUDADANO` | Usuario estándar del sistema |
| `SOCORRISTA` | Voluntario certificado en primeros auxilios |
| `COORDINADOR` | Coordina equipos de respuesta |
| `ADMIN` | Administrador del sistema |

### Constraints — `roles`

| Nombre | Tipo | Columna(s) | Descripción |
|--------|------|------------|-------------|
| `roles_name_key` | UNIQUE | `name` | No permite duplicar nombres de rol |

### Índices — `roles`

No se definen índices adicionales aparte del unique sobre `name`.

---

## 4. Tabla: `users`

> Tabla principal de usuarios autenticables.

| Columna | Tipo SQL | Nullable | Default | Descripción |
|--------|----------|----------|---------|-------------|
| `id` | `UUID` | No | `gen_random_uuid()` | Clave primaria |
| `first_name` | `VARCHAR(100)` | No | — | Nombres del usuario |
| `last_name` | `VARCHAR(100)` | No | — | Apellidos del usuario |
| `email` | `VARCHAR(255)` | No | — | Correo único del usuario |
| `phone` | `VARCHAR(20)` | Sí | `NULL` | Teléfono opcional y único |
| `password_hash` | `VARCHAR(255)` | No | — | Hash de contraseña |
| `is_active` | `BOOLEAN` | No | `TRUE` | Estado de activación |
| `is_verified` | `BOOLEAN` | No | `FALSE` | Estado de verificación |
| `last_login_at` | `TIMESTAMPTZ` | Sí | `NULL` | Último acceso |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Fecha de creación |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | Fecha de última actualización |

### Constraints — `users`

| Nombre | Tipo | Columna(s) | Descripción |
|--------|------|------------|-------------|
| `users_pkey` | PRIMARY KEY | `id` | Clave primaria UUID |
| `users_email_key` | UNIQUE | `email` | Correo único |
| `users_phone_key` | UNIQUE | `phone` | Teléfono único, permitiendo `NULL` |
| `chk_email_format` | CHECK | `email` | Valida formato básico de correo con expresión regular |

### Índices — `users`

| Índice | Columnas | Propósito |
|--------|----------|-----------|
| `idx_users_email` | `email` | Búsqueda rápida por correo |
| `idx_users_is_active` | `is_active` | Optimiza consultas de usuarios activos |

---

## 5. Tabla pivote: `user_roles`

> Relación N:M entre usuarios y roles. Permite múltiples roles por usuario y múltiples usuarios por rol.

| Columna | Tipo SQL | Nullable | Default | Descripción |
|--------|----------|----------|---------|-------------|
| `user_id` | `UUID` | No | — | FK hacia `users(id)` |
| `role_id` | `UUID` | No | — | FK hacia `roles(id)` |
| `assigned_at` | `TIMESTAMPTZ` | No | `NOW()` | Fecha de asignación |
| `assigned_by` | `UUID` | Sí | `NULL` | FK opcional hacia `users(id)` |

### Constraints — `user_roles`

| Nombre | Tipo | Columna(s) | Descripción |
|--------|------|------------|-------------|
| `user_roles_pkey` | PRIMARY KEY | `(user_id, role_id)` | Evita duplicar el mismo rol para un usuario |
| `user_roles_user_id_fkey` | FK | `user_id` | Elimina asignaciones al borrar el usuario |
| `user_roles_role_id_fkey` | FK | `role_id` | Restringe borrado de roles en uso |
| `user_roles_assigned_by_fkey` | FK | `assigned_by` | Si se borra el asignador, queda `NULL` |

### Índices — `user_roles`

No se definen índices adicionales fuera de la clave primaria compuesta.

---

## 6. Tabla: `verification_tokens`

> Tokens para verificación de correo, recuperación de contraseña o verificación telefónica.

| Columna | Tipo SQL | Nullable | Default | Descripción |
|--------|----------|----------|---------|-------------|
| `id` | `UUID` | No | `gen_random_uuid()` | Clave primaria |
| `user_id` | `UUID` | No | — | FK hacia `users(id)` |
| `token` | `VARCHAR(255)` | No | `encode(gen_random_bytes(32), 'hex')` | Token único |
| `token_type` | `token_type_enum` | No | — | Tipo de token |
| `expires_at` | `TIMESTAMPTZ` | No | `NOW() + INTERVAL '24 hours'` | Fecha de expiración |
| `used` | `BOOLEAN` | No | `FALSE` | Indica si el token ya fue consumido |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Fecha de creación |

### ENUM — `token_type_enum`

| Valor | Significado |
|------|-------------|
| `EMAIL_VERIFICATION` | Verificación de correo |
| `PASSWORD_RESET` | Restablecimiento de contraseña |
| `PHONE_VERIFICATION` | Verificación de teléfono |

### Constraints — `verification_tokens`

| Nombre | Tipo | Columna(s) | Descripción |
|--------|------|------------|-------------|
| `verification_tokens_pkey` | PRIMARY KEY | `id` | Clave primaria |
| `verification_tokens_token_key` | UNIQUE | `token` | Un token no puede repetirse |
| `verification_tokens_user_id_fkey` | FK | `user_id` | Borra tokens cuando se elimina el usuario |
| `chk_token_not_expired_when_used` | CHECK | `used`, `expires_at`, `created_at` | Evita un token marcado como usado con expiración anterior a su creación |

### Índices — `verification_tokens`

| Índice | Columnas | Propósito |
|--------|----------|-----------|
| `idx_tokens_user_id` | `user_id` | Buscar tokens por usuario |
| `idx_tokens_token` | `token` | Buscar tokens vigentes con filtro parcial `used = FALSE` |

---

## 7. Tabla: `audit_log`

> Registro de auditoría para acciones relevantes del sistema.

| Columna | Tipo SQL | Nullable | Default | Descripción |
|--------|----------|----------|---------|-------------|
| `id` | `UUID` | No | `gen_random_uuid()` | Clave primaria |
| `user_id` | `UUID` | Sí | `NULL` | FK opcional hacia `users(id)` |
| `action` | `VARCHAR(100)` | No | — | Acción realizada, por ejemplo `USER_REGISTERED` |
| `entity_type` | `VARCHAR(50)` | Sí | `NULL` | Tipo de entidad afectada |
| `entity_id` | `UUID` | Sí | `NULL` | Identificador de la entidad afectada |
| `metadata` | `JSONB` | Sí | `NULL` | Información adicional estructurada |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Fecha del evento |

### Constraints — `audit_log`

| Nombre | Tipo | Columna(s) | Descripción |
|--------|------|------------|-------------|
| `audit_log_pkey` | PRIMARY KEY | `id` | Clave primaria |
| `audit_log_user_id_fkey` | FK | `user_id` | Si el usuario se elimina, el campo queda en `NULL` |

### Índices — `audit_log`

| Índice | Columnas | Propósito |
|--------|----------|-----------|
| `idx_audit_user_id` | `user_id` | Auditoría por usuario |
| `idx_audit_action` | `action` | Filtrar por tipo de acción |
| `idx_audit_created` | `created_at DESC` | Consultas cronológicas de auditoría |

---

## 8. Constraints e Índices

| Tabla | Constraint / Índice | Tipo | Columnas |
|------|----------------------|------|----------|
| `roles` | `roles_name_key` | UNIQUE | `name` |
| `users` | `users_email_key` | UNIQUE | `email` |
| `users` | `users_phone_key` | UNIQUE | `phone` |
| `users` | `chk_email_format` | CHECK | `email` |
| `users` | `idx_users_email` | INDEX | `email` |
| `users` | `idx_users_is_active` | INDEX | `is_active` |
| `user_roles` | `user_roles_pkey` | PRIMARY KEY | `(user_id, role_id)` |
| `verification_tokens` | `verification_tokens_token_key` | UNIQUE | `token` |
| `verification_tokens` | `chk_token_not_expired_when_used` | CHECK | `used, expires_at, created_at` |
| `verification_tokens` | `idx_tokens_user_id` | INDEX | `user_id` |
| `verification_tokens` | `idx_tokens_token` | INDEX | `token` |
| `audit_log` | `idx_audit_user_id` | INDEX | `user_id` |
| `audit_log` | `idx_audit_action` | INDEX | `action` |
| `audit_log` | `idx_audit_created` | INDEX | `created_at DESC` |

---

## 9. Notas para PostgreSQL

### Pasos clave

1. **Asegurar extensión UUID y generación de hashes.**
   ```sql
   CREATE EXTENSION IF NOT EXISTS "pgcrypto";
   ```
2. **Crear tipos y tablas en el orden correcto.** Primero `roles` y `users`, luego `user_roles`, `verification_tokens` y `audit_log`.
3. **Cargar datos semilla de roles.** Los roles base deben insertarse antes de asignar permisos a usuarios.
4. **Mantener `updated_at` sincronizado.** Si se requiere actualización automática, usar trigger o lógica de aplicación.
5. **Usar `JSONB` para auditoría.** Permite consultas flexibles sobre metadatos.

### Consideraciones de PostgreSQL

| Aspecto | Recomendación |
|--------|---------------|
| UUIDs | Usar `pgcrypto` y `gen_random_uuid()` |
| Tokens | Mantener el token como texto hexadecimal de longitud fija |
| Fechas | Usar `TIMESTAMPTZ` con `timezone=True` en la aplicación |
| JSON | `JSONB` es preferible para índices y consultas sobre `metadata` |
| Índices parciales | Útiles para consultas frecuentes sobre datos activos o no usados |

### Conexión rápida

Para conectar la aplicación a PostgreSQL, define estos valores de entorno y usa una URL estándar:

`postgresql://mediguard_user:<password>@localhost:5432/mediguard_db`

En Django, la configuración mínima queda así:

```python
DATABASES = {
  "default": {
    "ENGINE": "django.db.backends.postgresql",
    "NAME": "mediguard_db",
    "USER": "mediguard_user",
    "PASSWORD": "<password>",
    "HOST": "localhost",
    "PORT": "5432",
  }
}
```

Prueba la conexión con:

```bash
python manage.py migrate
```

---

