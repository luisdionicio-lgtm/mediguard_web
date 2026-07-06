# Imágenes de Cursos y Guías — qué hacer tras jalar la rama

> Si acabas de traer los últimos cambios y no ves las imágenes en `/courses` o
> `/guides` / `/dashboard`, es porque falta un paso manual de un solo lado
> (Spring Boot). El lado de Django se aplica solo.

---

## Por qué a ti no te aparecen pero al otro sí

El proyecto tiene **dos backends con mecanismos de datos distintos**:

| | Cursos (Django) | Guías (Spring Boot `usuario`) |
|---|---|---|
| Dueño de la tabla | Django (`cursos.Course`) | Spring Boot (`content_guide`) |
| Cómo se aplican cambios de datos | Migraciones de Django (`manage.py migrate`) | **`ddl-auto=none`, sin Flyway/Liquibase** → nada se aplica solo |
| Qué trae la rama | Migración `0004_seed_course_thumbnails.py` | Script `usuario/scripts/seed_guide_images.sql` |
| Qué tienes que hacer tú | Solo correr `manage.py migrate` (paso normal de siempre) | **Ejecutar el `.sql` a mano contra tu Postgres, una vez** |

Si la persona a la que sí le funciona ya corrió ese `.sql` en su base de datos
local (o compartís la misma BD), por eso a ella le aparece y a ti no.

---

## Paso 1 — Actualizar tu rama

```bash
git pull
```

Confirma que tienes estos archivos nuevos:
- `backend_django/cursos/migrations/0004_seed_course_thumbnails.py`
- `usuario/scripts/seed_guide_images.sql`

---

## Paso 2 — Cursos (Django): correr las migraciones normales

Nada especial aquí, es el paso de siempre:

```bash
cd backend_django
venv\Scripts\activate          # o el que uses
python manage.py migrate
```

Si ves `Applying cursos.0004_seed_course_thumbnails... OK`, ya quedó.

> Si tu base de datos no tenía los 8 cursos creados (la migración `0002` los
> crea), primero necesitas tener un superusuario. Ver el aviso que imprime esa
> migración si se salta.

---

## Paso 3 — Guías (Spring Boot): correr el script SQL a mano

Este es el paso que normalmente se salta porque **no es automático**.

```bash
psql -U postgres -d mediguard_web -f usuario/scripts/seed_guide_images.sql
```

Ajusta usuario/nombre de BD si los tuyos son distintos. El script:
1. Amplía la columna `content_guide.image` (antes `varchar(100)`, muy chica para URLs).
2. Carga la URL de imagen correspondiente para cada categoría de guía.

Verifica que funcionó:

```sql
SELECT id, title, category, image FROM content_guide ORDER BY id;
```

Todas las filas deben tener `image` con una URL, no `NULL`.

---

## Paso 4 — Reiniciar y probar

1. Reinicia el backend Spring Boot (`usuario`) si estaba corriendo — el
   cambio de columna no se recoge en caliente.
2. Recarga el frontend en `/courses`, `/dashboard` y `/guides`.

Si después de esto siguen sin aparecer, revisa la consola del navegador
(F12 → Network) buscando el request a `guides/` o `courses/` y confirma que
el campo `image` / `thumbnail_url` no viene `null` en la respuesta.

---

## Resumen rápido

| Backend | Comando |
|---|---|
| Django (cursos) | `python manage.py migrate` |
| Spring Boot (guías) | `psql -U postgres -d mediguard_web -f usuario/scripts/seed_guide_images.sql` |
