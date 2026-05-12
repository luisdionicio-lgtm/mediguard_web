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
| `is_superuser`      | `BooleanField`        | `BOOLEAN NOT NULL`             | No       | `FALSE`      | *(superadmin Django)*          |
| `esta_verificado`   | `BooleanField`        | `BOOLEAN NOT NULL`             | No       | `FALSE`      | `is_verified BOOLEAN DEFAULT FALSE` |
| `date_joined`       | `DateTimeField`       | `TIMESTAMPTZ NOT NULL`         | No       | `now()`      | `created_at TIMESTAMPTZ DEFAULT NOW()` |
| `last_login`        | `DateTimeField`       | `TIMESTAMPTZ`                  | Sí       | `NULL`       | `last_login_at TIMESTAMPTZ`    |
| `actualizado_en`    | `DateTimeField`       | `TIMESTAMPTZ NOT NULL`         | No       | `now()`      | `updated_at TIMESTAMPTZ DEFAULT NOW()` |
| `fecha_nacimiento`  | `DateField`           | `DATE`                         | Sí       | `NULL`       | *(extendido por MediGuard)*    |
| `foto_perfil`       | `ImageField`          | `VARCHAR(255)` (ruta)          | Sí       | `NULL`       | *(extendido por MediGuard)*    |
| `genero`            | `CharField(1)`        | `VARCHAR(1)`                   | Sí       | `NULL`       | *(extendido por MediGuard)*    |
| `pais`              | `CharField(5)`        | `VARCHAR(5) NOT NULL`          | No       | `'PE'`       | *(extendido por MediGuard)*    |

### Choices — `genero`

| Valor DB | Etiqueta           |
|----------|--------------------|
| `M`      | Masculino          |
| `F`      | Femenino           |
| `O`      | Otro               |
| `N`      | Prefiero no decir  |

### Constraints — `users_usuario`

| Nombre                         | Tipo    | Columna(s) | Descripción                                              |
|-------------------------------|---------|------------|----------------------------------------------------------|
| `username` UNIQUE (heredado)   | UNIQUE  | `username` | Django lo hereda de AbstractUser                         |
| `email` UNIQUE                 | UNIQUE  | `email`    | Equivale a `email UNIQUE` del SQL del DBA                |
| `telefono` UNIQUE              | UNIQUE  | `telefono` | Equivale a `phone UNIQUE` del SQL del DBA                |
| `chk_email_contiene_arroba`    | CHECK   | `email`    | Validacion minima. Django aplica `EmailValidator` completo en capa Python. Equivale a `CONSTRAINT chk_email_format` del DBA |

### Indices — `users_usuario`

| Indice                          | Columna(s)        | Proposito                               |
|--------------------------------|-------------------|-----------------------------------------|
| `users_usuario_email_idx`       | `email`           | Busqueda rapida por correo              |
| `users_usuario_pais_idx`        | `pais`            | Filtrar usuarios por pais               |
| `users_usuario_verificado_idx`  | `esta_verificado` | Analitica: verificados vs pendientes    |

---

## 4. Tabla: `emergency_contactoemergencia`

> Contactos personales de emergencia. Cada usuario puede tener **múltiples** contactos (relación 1:N con `users_usuario`).

| Columna          | Tipo Django          | Tipo SQL (PostgreSQL)   | Nullable | Default    | Descripción                                                  |
|------------------|----------------------|-------------------------|----------|------------|--------------------------------------------------------------|
| `id`             | `BigAutoField`       | `BIGSERIAL PRIMARY KEY` | No       | auto       | Clave primaria                                               |
| `usuario_id`     | `ForeignKey`         | `BIGINT REFERENCES ...` | No       | —          | FK → `users_usuario.id` (CASCADE DELETE)                     |
| `nombre`         | `CharField(100)`     | `VARCHAR(100)`          | No       | —          | Nombre completo del contacto                                 |
| `telefono`       | `CharField(20)`      | `VARCHAR(20)`           | No       | —          | Teléfono con validación de formato internacional             |
| `relacion`       | `CharField(20)`      | `VARCHAR(20)`           | No       | `'otro'`   | Choices: `familiar`, `amigo`, `medico`, `vecino`, `otro`     |
| `es_principal`   | `BooleanField`       | `BOOLEAN`               | No       | `FALSE`    | Contacto SOS principal del usuario                           |
| `email`          | `EmailField(254)`    | `VARCHAR(254)`          | Sí       | `NULL`     | Email del contacto (para notificaciones futuras)             |
| `notas`          | `CharField(255)`     | `VARCHAR(255)`          | No       | `''`       | Info adicional. Ej: "Solo disponible de noche"               |
| `creado_en`      | `DateTimeField`      | `TIMESTAMPTZ`           | No       | `now()`    | Timestamp de registro (inmutable)                            |
| `actualizado_en` | `DateTimeField`      | `TIMESTAMPTZ`           | No       | `now()`    | Auto-actualizado en cada `save()`                            |

### Choices — `relacion`

| Valor DB   | Etiqueta  |
|------------|-----------|
| `familiar` | Familiar  |
| `amigo`    | Amigo/a   |
| `medico`   | Médico/a  |
| `vecino`   | Vecino/a  |
| `otro`     | Otro      |

### Constraints — `emergency_contactoemergencia`

| Nombre                         | Columnas                 | Tipo    | Descripción                                       |
|-------------------------------|--------------------------|---------|---------------------------------------------------|
| `telefono_unico_por_usuario`   | `(usuario_id, telefono)` | UNIQUE  | Un usuario no puede registrar el mismo número dos veces |

### Índices — `emergency_contactoemergencia`

| Índice                                         | Columnas                    | Propósito                              |
|------------------------------------------------|-----------------------------|----------------------------------------|
| `emergency_contacto_usuario_principal_idx`     | `(usuario_id, es_principal)`| SOS localiza el contacto principal rápido |

---

## 5. Tabla: `emergency_eventosos`

> Historial de activaciones del botón SOS. Cada registro = un evento de emergencia activado por un usuario.

| Columna                 | Tipo Django                  | Tipo SQL (PostgreSQL)   | Nullable | Default      | Descripción                                                      |
|-------------------------|------------------------------|-------------------------|----------|--------------|------------------------------------------------------------------|
| `id`                    | `BigAutoField`               | `BIGSERIAL PRIMARY KEY` | No       | auto         | Clave primaria                                                   |
| `usuario_id`            | `ForeignKey`                 | `BIGINT REFERENCES ...` | No       | —            | FK → `users_usuario.id` (CASCADE DELETE)                         |
| `estado`                | `CharField(20)`              | `VARCHAR(20)`           | No       | `'activado'` | Choices: `activado`, `resuelto`, `falsa_alarma`                  |
| `ubicacion_latitud`     | `DecimalField(9,6)`          | `DECIMAL(9,6)`          | Sí       | `NULL`       | Latitud GPS. Precisión ~11 cm                                    |
| `ubicacion_longitud`    | `DecimalField(9,6)`          | `DECIMAL(9,6)`          | Sí       | `NULL`       | Longitud GPS. Precisión ~11 cm                                   |
| `notas`                 | `TextField`                  | `TEXT`                  | No       | `''`         | Observaciones al resolver o cerrar el evento                     |
| `dispositivo`           | `CharField(100)`             | `VARCHAR(100)`          | No       | `''`         | User-Agent simplificado. Ej: `"Chrome/Android"`                  |
| `direccion_aproximada`  | `CharField(255)`             | `VARCHAR(255)`          | No       | `''`         | Dirección legible por geocodificación inversa (opcional)         |
| `duracion_segundos`     | `PositiveIntegerField`       | `INTEGER`               | Sí       | `NULL`       | Tiempo transcurrido entre activación y resolución                |
| `contactos_notificados` | `PositiveSmallIntegerField`  | `SMALLINT`              | No       | `0`          | N° de contactos que el cliente notificó durante el evento        |
| `activado_en`           | `DateTimeField`              | `TIMESTAMPTZ`           | No       | `now()`      | Timestamp de activación (inmutable)                              |
| `resuelto_en`           | `DateTimeField`              | `TIMESTAMPTZ`           | Sí       | `NULL`       | Timestamp de resolución o cierre                                 |

### Choices — `estado`

| Valor DB       | Etiqueta      | Descripción                         |
|----------------|---------------|-------------------------------------|
| `activado`     | Activado      | SOS activo, esperando respuesta     |
| `resuelto`     | Resuelto      | Emergencia atendida                 |
| `falsa_alarma` | Falsa Alarma  | El usuario canceló o fue accidental |

### Índices — `emergency_eventosos`

| Índice                                      | Columnas                       | Propósito                             |
|---------------------------------------------|--------------------------------|---------------------------------------|
| `emergency_eventosos_estado_idx`            | `estado`                       | Filtro rápido por estado              |
| `emergency_eventosos_usuario_estado_idx`    | `(usuario_id, estado)`         | Historial por usuario y estado        |
| `emergency_eventosos_usuario_activado_idx`  | `(usuario_id, activado_en)`    | Historial cronológico del usuario     |

> **Nota:** `ubicacion_latitud` y `ubicacion_longitud` son opcionales porque en navegadores web el usuario puede denegar el permiso de GPS. El frontend envía `null` en ese caso.

---

## 6. Tabla: `emergency_numeroservicioemergencia`

> Números institucionales de emergencia (112, 105, 106, etc.). **No tiene FK a usuarios** — es data global administrada desde el panel de admin Django.

| Columna           | Tipo Django                  | Tipo SQL (PostgreSQL)   | Nullable | Default     | Descripción                                                     |
|-------------------|------------------------------|-------------------------|----------|-------------|-----------------------------------------------------------------|
| `id`              | `BigAutoField`               | `BIGSERIAL PRIMARY KEY` | No       | auto        | Clave primaria                                                  |
| `nombre`          | `CharField(100)`             | `VARCHAR(100)`          | No       | —           | Nombre del servicio. Ej: `"PNP - Policía Nacional del Perú"`    |
| `telefono`        | `CharField(20)`              | `VARCHAR(20)`           | No       | —           | Número de emergencia. Ej: `"105"`, `"112"`                      |
| `tipo_servicio`   | `CharField(20)`              | `VARCHAR(20)`           | No       | `'general'` | Choices: `policia`, `ambulancia`, `bomberos`, `general`, `otro` |
| `codigo_pais`     | `CharField(5)`               | `VARCHAR(5)`            | No       | `'PE'`      | ISO 3166-1. Permite multi-país en futuras versiones             |
| `descripcion`     | `CharField(255)`             | `VARCHAR(255)`          | No       | `''`        | Descripción breve del servicio                                  |
| `activo`          | `BooleanField`               | `BOOLEAN`               | No       | `TRUE`      | Permite desactivar sin borrar el registro                       |
| `prioridad`       | `PositiveSmallIntegerField`  | `SMALLINT`              | No       | `100`       | Orden de aparición. Menor = primero. El `112` debe tener `1`   |
| `icono`           | `CharField(50)`              | `VARCHAR(50)`           | No       | `''`        | Nombre de ícono para el frontend. Ej: `"ambulance"`, `"fire"`   |
| `url_sitio_web`   | `URLField(200)`              | `VARCHAR(200)`          | Sí       | `NULL`      | URL del sitio oficial del servicio                              |
| `horario_atencion`| `CharField(100)`             | `VARCHAR(100)`          | No       | `'24/7'`    | Descripción del horario. Ej: `"Lun-Vie 08:00-18:00"`           |
| `creado_en`       | `DateTimeField`              | `TIMESTAMPTZ`           | No       | `now()`     | Timestamp de creación (inmutable)                               |
| `actualizado_en`  | `DateTimeField`              | `TIMESTAMPTZ`           | No       | `now()`     | Auto-actualizado en cada `save()`                               |

### Choices — `tipo_servicio`

| Valor DB     | Etiqueta             |
|--------------|----------------------|
| `policia`    | Policía              |
| `ambulancia` | Ambulancia           |
| `bomberos`   | Bomberos             |
| `general`    | Emergencias General  |
| `otro`       | Otro                 |

### Constraints — `emergency_numeroservicioemergencia`

| Nombre                   | Columnas                  | Tipo   | Descripción                                          |
|--------------------------|---------------------------|--------|------------------------------------------------------|
| `telefono_unico_por_pais` | `(telefono, codigo_pais)` | UNIQUE | El mismo número no se duplica dentro del mismo país  |

### Índices — `emergency_numeroservicioemergencia`

| Índice                                         | Columnas       | Propósito                                    |
|------------------------------------------------|----------------|----------------------------------------------|
| `emergency_numero_codigo_pais_idx`             | `codigo_pais`  | Filtrar servicios por país en la API         |
| `emergency_numero_activo_idx`                  | `activo`       | Excluir servicios inactivos en consultas     |

---

## 7. Constraints e Índices — Resumen Global

| Tabla                                  | Constraint / Índice                      | Tipo   | Columnas                      |
|----------------------------------------|------------------------------------------|--------|-------------------------------|
| `users_usuario`                        | `username` UNIQUE (heredado)             | UNIQUE | `username`                    |
| `users_usuario`                        | `pais` index                             | INDEX  | `pais`                        |
| `users_usuario`                        | `esta_verificado` index                  | INDEX  | `esta_verificado`             |
| `emergency_contactoemergencia`         | `telefono_unico_por_usuario`             | UNIQUE | `(usuario_id, telefono)`      |
| `emergency_contactoemergencia`         | `usuario + es_principal` index           | INDEX  | `(usuario_id, es_principal)`  |
| `emergency_eventosos`                  | `estado` index                           | INDEX  | `estado`                      |
| `emergency_eventosos`                  | `usuario + estado` index                 | INDEX  | `(usuario_id, estado)`        |
| `emergency_eventosos`                  | `usuario + activado_en` index            | INDEX  | `(usuario_id, activado_en)`   |
| `emergency_numeroservicioemergencia`   | `telefono_unico_por_pais`                | UNIQUE | `(telefono, codigo_pais)`     |
| `emergency_numeroservicioemergencia`   | `codigo_pais` index                      | INDEX  | `codigo_pais`                 |
| `emergency_numeroservicioemergencia`   | `activo` index                           | INDEX  | `activo`                      |

---

## 8. Notas para Migración a PostgreSQL

> Actualmente en SQLite para desarrollo. La migración a PostgreSQL se realizará en sprint de producción.

### Pasos clave

1. **Instalar driver:** `pip install psycopg2-binary`
2. **Actualizar `settings.py`:**
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'mediguard_db',
           'USER': 'mediguard_user',
           'PASSWORD': '<contraseña>',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```
3. **Crear la BD en PostgreSQL:**
   ```sql
   CREATE DATABASE mediguard_db;
   CREATE USER mediguard_user WITH PASSWORD '<contraseña>';
   GRANT ALL PRIVILEGES ON DATABASE mediguard_db TO mediguard_user;
   ```
4. **Aplicar migraciones:**
   ```bash
   python manage.py migrate
   ```
5. **Cargar datos iniciales** (números de emergencia):
   ```bash
   python manage.py loaddata numeros_emergencia_pe.json
   ```

### Consideraciones de PostgreSQL

| Aspecto              | Recomendación                                                                 |
|----------------------|-------------------------------------------------------------------------------|
| `foto_perfil`        | En producción usar **S3 / Cloudinary** en lugar de almacenamiento local       |
| `DecimalField(9,6)`  | PostgreSQL usa `NUMERIC(9,6)` — compatible directamente                       |
| Timestamps           | Django usa `TIMESTAMPTZ` (con timezone) — asegurar `USE_TZ = True` en settings|
| Collation            | Usar `en_US.UTF-8` o `es_PE.UTF-8` para búsquedas con acentos correctas      |
| Full-text search     | `notas` en `EventoSOS` puede beneficiarse de índice `GIN` para búsquedas     |

---

*Documento generado automáticamente desde los modelos Django. Ante cualquier discrepancia, el modelo Python es la fuente de verdad.*
