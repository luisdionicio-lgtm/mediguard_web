# Guia de testeo - Sprint 1: Registro de usuarios

Fecha: 2026-05-12  
Backend: Django + Django REST Framework  
Base local: SQLite en desarrollo, estructura alineada al DDL PostgreSQL del Sprint 1.

## 1. Objetivo

Validar que el backend cumple la estructura de Sprint 1:

- Tabla logica `users` con login por `email`.
- Tabla `roles` con datos semilla.
- Tabla pivote `user_roles` con rol `CIUDADANO` asignado automaticamente.
- Tabla `verification_tokens` con invalidacion de tokens anteriores del mismo tipo.
- Tabla `audit_log` con registro `USER_REGISTERED`.
- Endpoints de autenticacion funcionando con JWT.

## 2. Preparacion

Desde la raiz del backend:

```powershell
cd C:\FINALPROJECT\cyps\mediguard_web\backend_django
```

Verificar que exista `.env` con al menos:

```env
SECRET_KEY=tu_clave_local
DEBUG=True
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Instalar dependencias si el entorno no esta listo:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## 3. Aplicar migraciones

```powershell
.\.venv\Scripts\python.exe manage.py migrate
```

Resultado esperado:

```text
Applying users.0004_... OK
Applying users.0005_seed_roles_and_existing_users... OK
```

Si ya fueron aplicadas:

```text
No migrations to apply.
```

## 4. Verificaciones tecnicas

Ejecutar:

```powershell
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe manage.py makemigrations --check --dry-run
.\.venv\Scripts\python.exe manage.py test
```

Resultado esperado:

```text
System check identified no issues
No changes detected
Ran 4 tests
OK
```

## 5. Levantar servidor local

```powershell
.\.venv\Scripts\python.exe manage.py runserver
```

Base URL:

```text
http://127.0.0.1:8000
```

## 6. Probar registro de usuario

Endpoint:

```http
POST http://127.0.0.1:8000/api/auth/registro/
Content-Type: application/json
```

Body:

```json
{
  "first_name": "Ana",
  "last_name": "Torres",
  "email": "ana.torres@example.com",
  "phone": "+51999888777",
  "contrasena": "ClaveSegura123!"
}
```

Resultado esperado:

```json
{
  "usuario": {
    "id": "...",
    "first_name": "Ana",
    "last_name": "Torres",
    "email": "ana.torres@example.com",
    "phone": "+51999888777",
    "is_active": true,
    "is_verified": false,
    "roles": ["CIUDADANO"]
  },
  "tokens": {
    "acceso": "...",
    "refresco": "..."
  }
}
```

Codigo esperado:

```text
201 Created
```

## 7. Probar login por email

Endpoint:

```http
POST http://127.0.0.1:8000/api/auth/login/
Content-Type: application/json
```

Body:

```json
{
  "email": "ana.torres@example.com",
  "password": "ClaveSegura123!"
}
```

Resultado esperado:

```json
{
  "refresh": "...",
  "access": "..."
}
```

Codigo esperado:

```text
200 OK
```

## 8. Probar perfil autenticado

Endpoint:

```http
GET http://127.0.0.1:8000/api/auth/perfil/
Authorization: Bearer <access>
```

Resultado esperado:

```json
{
  "id": "...",
  "first_name": "Ana",
  "last_name": "Torres",
  "email": "ana.torres@example.com",
  "phone": "+51999888777",
  "is_active": true,
  "is_verified": false,
  "roles": ["CIUDADANO"]
}
```

## 9. Probar actualizacion de perfil

Endpoint:

```http
PATCH http://127.0.0.1:8000/api/auth/perfil/
Authorization: Bearer <access>
Content-Type: application/json
```

Body:

```json
{
  "first_name": "Ana Maria",
  "last_name": "Torres",
  "phone": "+51999777666"
}
```

Resultado esperado:

```text
200 OK
```

Validar que `updated_at` cambia automaticamente.

## 10. Probar rechazo de email duplicado

Repetir el registro con el mismo email:

```json
{
  "first_name": "Ana",
  "last_name": "Duplicada",
  "email": "ana.torres@example.com",
  "phone": "+51999111222",
  "contrasena": "ClaveSegura123!"
}
```

Resultado esperado:

```text
400 Bad Request
```

Debe aparecer error en `email`.

## 11. Probar refresh token

Endpoint:

```http
POST http://127.0.0.1:8000/api/auth/token/refresco/
Content-Type: application/json
```

Body:

```json
{
  "refresh": "<refresh>"
}
```

Resultado esperado:

```json
{
  "access": "...",
  "refresh": "..."
}
```

Nota: la configuracion actual rota refresh tokens y manda el anterior a blacklist.

## 12. Probar logout

Endpoint:

```http
POST http://127.0.0.1:8000/api/auth/cerrar-sesion/
Authorization: Bearer <access>
Content-Type: application/json
```

Body:

```json
{
  "refresco": "<refresh>"
}
```

Resultado esperado:

```json
{
  "mensaje": "Sesion cerrada correctamente."
}
```

Codigo esperado:

```text
200 OK
```

## 13. Verificar datos desde Django shell

```powershell
.\.venv\Scripts\python.exe manage.py shell
```

Dentro del shell:

```python
from users.models import Usuario, Rol, UserRole, AuditLog

Usuario.objects.values('email', 'first_name', 'last_name', 'phone', 'is_active', 'is_verified')
Rol.objects.values('name', 'description')
UserRole.objects.select_related('user', 'role').values('user__email', 'role__name')
AuditLog.objects.values('user__email', 'action', 'entity_type', 'metadata')
```

Resultado esperado:

- Deben existir los roles `CIUDADANO`, `SOCORRISTA`, `COORDINADOR`, `ADMIN`.
- El usuario registrado debe tener rol `CIUDADANO`.
- Debe existir un registro `USER_REGISTERED` en `audit_log`.

## 14. Verificar tokens de verificacion

Desde Django shell:

```python
from users.models import Usuario, VerificationToken

u = Usuario.objects.get(email='ana.torres@example.com')
t1 = VerificationToken.objects.create(user=u, token_type='EMAIL_VERIFICATION')
t2 = VerificationToken.objects.create(user=u, token_type='EMAIL_VERIFICATION')
t1.refresh_from_db()
t2.refresh_from_db()

t1.used, t2.used
```

Resultado esperado:

```python
(True, False)
```

Esto valida la regla: al emitir un nuevo token del mismo tipo, los anteriores quedan usados.

## 15. Checklist de cierre

- `manage.py check` pasa.
- `makemigrations --check --dry-run` no detecta cambios.
- `manage.py test` pasa con 4 tests.
- Registro devuelve usuario y tokens.
- Login funciona con `email` y `password`.
- Perfil autenticado responde con rol `CIUDADANO`.
- Email duplicado se rechaza.
- `audit_log` registra `USER_REGISTERED`.
- `verification_tokens` invalida tokens anteriores del mismo tipo.

## 16. Notas de implementacion

- El DDL usa `token_type_enum`; en Django se implemento como `CharField` con `TextChoices` para mantener compatibilidad local con SQLite. En PostgreSQL se puede migrar a enum nativo si el DBA lo exige.
- Los triggers del DDL se implementaron como signals de Django:
  - asignar rol `CIUDADANO`;
  - crear registro de auditoria;
  - invalidar tokens previos.
- La tabla pivote `user_roles` usa `CompositePrimaryKey` para respetar la PK compuesta `(user_id, role_id)`.

# Test workflow