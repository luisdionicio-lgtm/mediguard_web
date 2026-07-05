# MediGuard AI — Entorno de desarrollo local con Docker

Este documento explica cómo levantar todo el proyecto (PostgreSQL, Django,
Spring Boot y el frontend React) con Docker, sin instalar nada más que
Docker Desktop. No cambia diseño, componentes, rutas ni lógica de la app:
solo empaqueta lo que ya existe.

## 1. Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo.
- Clonar el repositorio.

## 2. Configurar variables de entorno

Copia el archivo de ejemplo y ajústalo si lo necesitas (los valores por
defecto ya sirven para desarrollo local):

```bash
cp .env.docker.example .env.docker
```

`.env.docker` está en `.gitignore` — nunca se sube al repositorio.

## 3. Levantar el entorno

Desde la raíz del repositorio:

```bash
docker compose --env-file .env.docker -f docker-compose.dev.yml up --build
```

La primera vez tarda varios minutos (descarga la imagen de Postgres, instala
dependencias de Node/Python, y compila Spring Boot con Maven). Ese primer
arranque también aplica automáticamente:

- las migraciones de Django,
- los scripts SQL de `database/migrations/` (esquema compartido con Spring Boot),
- creación de la base y usuario de PostgreSQL.

No hace falta ejecutar nada manualmente para la base de datos — el servicio
`db_init` se encarga de todo antes de que arranquen Django y Spring Boot.

Si en algún momento agregas una migración nueva de Django (como pasó con
`cursos/migrations/0003_update_course_thumbnails.py` en este proyecto), no
necesitas hacer nada especial: el servicio `db_init` la aplica automáticamente
la próxima vez que ejecutes `up`.

## 4. URLs una vez levantado

| Servicio                    | URL                              |
|------------------------------|-----------------------------------|
| Frontend (React)             | http://localhost:5173            |
| Backend Django (catálogo)    | http://localhost:8000            |
| Backend Spring Boot (usuario)| http://localhost:8081            |
| PostgreSQL                   | localhost:5432                   |

El frontend ya apunta a `http://localhost:8000` y `http://localhost:8081`
por defecto (son los mismos valores que usa fuera de Docker) — no hace
falta configurar nada en el código.

## 5. Apagar el entorno

```bash
docker compose --env-file .env.docker -f docker-compose.dev.yml down
```

Esto detiene y elimina los contenedores, pero conserva los datos de
PostgreSQL (quedan en un volumen Docker persistente).

## 6. Reiniciar la base de datos desde cero

Si quieres borrar todos los datos y volver a empezar (por ejemplo, si algo
quedó en un estado raro):

```bash
docker compose --env-file .env.docker -f docker-compose.dev.yml down -v
docker compose --env-file .env.docker -f docker-compose.dev.yml up --build
```

El flag `-v` borra el volumen de PostgreSQL. La próxima vez que hagas `up`,
todo se vuelve a crear desde cero automáticamente (migraciones + SQL).

## 7. Ver logs de un servicio específico

```bash
docker compose --env-file .env.docker -f docker-compose.dev.yml logs -f backend_django
docker compose --env-file .env.docker -f docker-compose.dev.yml logs -f usuario
docker compose --env-file .env.docker -f docker-compose.dev.yml logs -f frontend_react
```

## 8. Notas técnicas

- **Puertos**: son los mismos que ya usaba el proyecto en local (5173, 8000,
  8081, 5432) — no cambian.
- **JWT compartido**: `JWT_SECRET` en `.env.docker` se pasa igual a Django y
  a Spring Boot, para que los tokens de uno sean válidos en el otro.
- **`db_init`**: es un servicio que se ejecuta una sola vez (aplica el
  esquema y las migraciones) y luego termina; es normal verlo en estado
  "Exited (0)" con `docker ps -a` — eso significa que terminó bien, no que
  falló.
- **Compatibilidad de usuario de PostgreSQL**: `usuario/src/main/resources/application.properties`
  tiene el usuario de base de datos fijo en `postgres` (no se modificó ese
  archivo). Para que Spring Boot pueda conectarse aunque `.env.docker` use
  otro usuario (`mediguard_user`), el contenedor de PostgreSQL crea
  automáticamente, la primera vez, un rol adicional llamado `postgres` con
  la misma contraseña (ver `docker/postgres-initdb/00-create-postgres-role.sh`).
  Esto es solo dentro del contenedor Docker; no afecta tu Postgres local si
  lo usas fuera de Docker.
- Ni `application.properties` ni ningún `.env` real fueron modificados;
  las credenciales de Docker viven únicamente en `.env.docker` (que tú creas
  localmente y nunca se commitea).

## 9. Verificado en este entorno

Se probó `docker compose config` (sintaxis y variables) y un `up --build`
completo con los 4 servicios corriendo y respondiendo:

- Django: `GET /api/` → 200; `GET /api/courses/` sin token → 401 (catálogo protegido, correcto).
- Spring Boot: arrancó, conectó a PostgreSQL y respondió en `/api/login/`.
- Frontend: sirvió la app en `http://localhost:5173`.

Pendiente de que cada desarrollador lo pruebe en su propia máquina (rutas de
Docker Desktop, recursos asignados a la VM, etc. pueden variar).
