# Configuracion local de MediGuard

Esta guia describe como levantar el entorno local completo con PostgreSQL,
Django, Spring Boot usuario y React.

## 1. PostgreSQL

Requisitos:

- PostgreSQL corriendo localmente.
- Puerto: `5432`.
- Usuario sugerido: `postgres`.
- Password sugerida para desarrollo local: `postgres123`.
- Base de datos: `mediguard_db`.

Crear la base de datos:

```sql
CREATE DATABASE mediguard_db;
```

## 2. Django

Ruta del proyecto:

```powershell
cd backend_django
```

Activar el entorno virtual:

```powershell
.\.venv\Scripts\Activate.ps1
```

Configurar el archivo `.env` en `backend_django/.env`:

```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=mediguard_db
DB_USER=postgres
DB_PASSWORD=postgres123
DB_HOST=localhost
DB_PORT=5432
```

Instalar dependencias:

```powershell
pip install -r requirements.txt
```

Generar migraciones:

```powershell
python manage.py makemigrations
```

Aplicar migraciones:

```powershell
python manage.py migrate
```

Levantar Django:

```powershell
python manage.py runserver
```

Django queda disponible en:

```text
http://127.0.0.1:8000/
```

## 3. Spring Boot usuario

Ruta del proyecto:

```powershell
cd usuario
```

Configuracion esperada:

- Puerto: `8081`.
- Base de datos: `mediguard_db`.
- `spring.jpa.hibernate.ddl-auto=none`.

Compilar:

```powershell
.\mvnw.cmd -DskipTests compile
```

Levantar Spring Boot:

```powershell
.\mvnw.cmd spring-boot:run
```

Spring Boot usuario queda disponible en:

```text
http://127.0.0.1:8081/
```

## 4. React

Ruta del proyecto:

```powershell
cd frontend_react
```

Copiar `.env.example` a `.env`:

```powershell
Copy-Item .env.example .env
```

Variables esperadas en `frontend_react/.env`:

```env
VITE_DJANGO_API_URL=http://127.0.0.1:8000/api/
VITE_SPRING_API_URL=http://127.0.0.1:8081/api/
```

Instalar dependencias:

```powershell
npm install
```

Levantar React:

```powershell
npm run dev
```

React queda disponible en:

```text
http://127.0.0.1:5173/
```

## 5. Rutas de prueba

Django:

```text
http://127.0.0.1:8000/api/
```

Spring Boot usuario:

```text
http://127.0.0.1:8081/api/guides/
http://127.0.0.1:8081/api/hospitals/
http://127.0.0.1:8081/api/news/
http://127.0.0.1:8081/api/emergencies/
```

React:

```text
http://127.0.0.1:5173/
```

## Notas

- No subir archivos `.env` reales al repositorio.
- Django administra el esquema de base de datos mediante migraciones.
- Spring Boot no debe usar `ddl-auto=update`, `ddl-auto=create` ni variantes que modifiquen tablas.
- Spring Boot debe mantenerse con `spring.jpa.hibernate.ddl-auto=none`.
- `login`, `register` y `profile` aun estan pendientes de contrato JWT final.
