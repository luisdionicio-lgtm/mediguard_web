# Postman - CRUD funcional de usuarios

Fecha: 2026-05-12  
Base URL local:

```text
http://127.0.0.1:8000
```

## 1. Mapa correcto de metodos

No todos los metodos van en la misma URL. En esta API quedan asi:

| Accion | Metodo | Endpoint | Requiere token |
|---|---:|---|---|
| Crear usuario | `POST` | `/api/auth/registro/` | No |
| Verificar registro por email | `GET` | `/api/auth/registro/?email=correo@dominio.com` | No |
| Login | `POST` | `/api/auth/login/` | No |
| Ver perfil | `GET` | `/api/auth/perfil/` | Si |
| Reemplazar perfil | `PUT` | `/api/auth/perfil/` | Si |
| Actualizar parte del perfil | `PATCH` | `/api/auth/perfil/` | Si |
| Eliminar cuenta | `DELETE` | `/api/auth/perfil/` | Si |
| Consultar roles | `GET` | `/api/auth/usuarios/<id>/roles/` | Si, usuario ADMIN |
| Asignar roles | `PUT/PATCH` | `/api/auth/usuarios/<id>/roles/` | Si, usuario ADMIN |
| Refrescar token | `POST` | `/api/auth/token/refresco/` | No |
| Cerrar sesion | `POST` | `/api/auth/cerrar-sesion/` | Si |

`GET /api/auth/registro/` requiere el parametro `email`; sin ese parametro responde `400 Bad Request`.

## 2. Variables recomendadas en Postman

Crea estas variables en la coleccion:

| Variable | Valor inicial |
|---|---|
| `base_url` | `http://127.0.0.1:8000` |
| `access_token` | vacio |
| `refresh_token` | vacio |

Usa las URLs con:

```text
{{base_url}}/api/auth/registro/
```

## 3. POST - Crear usuario

Metodo:

```text
POST
```

URL:

```text
{{base_url}}/api/auth/registro/
```

Body:

```json
{
  "first_name": "Ana",
  "last_name": "Seledonio",
  "email": "seledonio.torres@example.com",
  "phone": "+51999888777",
  "contrasena": "ClaveSegura123!"
}
```

Respuesta esperada:

```text
201 Created
```

Script en `Scripts > Post-response` para guardar tokens:

```javascript
pm.test("Usuario creado", function () {
  pm.expect(pm.response.code).to.eql(201);
});

const json = pm.response.json();
pm.collectionVariables.set("access_token", json.tokens.acceso);
pm.collectionVariables.set("refresh_token", json.tokens.refresco);
```

## 4. POST - Login

## 4. GET - Verificar registro por email

Metodo:

```text
GET
```

URL:

```text
{{base_url}}/api/auth/registro/?email=seledonio.torres@example.com
```

Body:

```text
none
```

Respuesta esperada cuando el usuario existe:

```text
200 OK
```

```json
{
  "registrado": true,
  "usuario": {
    "id": "uuid",
    "first_name": "Ana",
    "last_name": "Seledonio",
    "email": "seledonio.torres@example.com",
    "phone": "+51999888777",
    "is_active": true,
    "is_verified": false,
    "roles": ["CIUDADANO"]
  }
}
```

Respuesta esperada cuando el usuario no existe:

```json
{
  "registrado": false,
  "email": "noexiste@example.com",
  "mensaje": "No existe un usuario registrado con ese correo."
}
```

## 5. POST - Login

Metodo:

```text
POST
```

URL:

```text
{{base_url}}/api/auth/login/
```

Body:

```json
{
  "email": "seledonio.torres@example.com",
  "password": "ClaveSegura123!"
}
```

Respuesta esperada:

```text
200 OK
```

Script para guardar tokens:

```javascript
pm.test("Login correcto", function () {
  pm.expect(pm.response.code).to.eql(200);
});

const json = pm.response.json();
pm.collectionVariables.set("access_token", json.access);
pm.collectionVariables.set("refresh_token", json.refresh);
```

## 6. GET - Ver perfil

Metodo:

```text
GET
```

URL:

```text
{{base_url}}/api/auth/perfil/
```

Authorization:

```text
Type: Bearer Token
Token: {{access_token}}
```

Respuesta esperada:

```text
200 OK
```

## 7. PUT - Reemplazar perfil

`PUT` se usa para enviar una actualizacion completa de los campos editables del perfil.

Metodo:

```text
PUT
```

URL:

```text
{{base_url}}/api/auth/perfil/
```

Authorization:

```text
Bearer {{access_token}}
```

Body:

```json
{
  "first_name": "Ana Maria",
  "last_name": "Seledonio Torres",
  "phone": "+51999777666"
}
```

Respuesta esperada:

```text
200 OK
```

## 8. PATCH - Actualizar parcialmente

`PATCH` se usa cuando solo quieres cambiar uno o algunos campos.

Metodo:

```text
PATCH
```

URL:

```text
{{base_url}}/api/auth/perfil/
```

Authorization:

```text
Bearer {{access_token}}
```

Body:

```json
{
  "phone": "+51999111222"
}
```

Respuesta esperada:

```text
200 OK
```

## 9. DELETE - Eliminar cuenta

Metodo:

```text
DELETE
```

URL:

```text
{{base_url}}/api/auth/perfil/
```

Authorization:

```text
Bearer {{access_token}}
```

Body:

```text
none
```

Respuesta esperada:

```text
204 No Content
```

Despues de eliminar la cuenta, ese usuario ya no podra consultar `/api/auth/perfil/` con el mismo token.

## 10. Orden recomendado en Postman

1. `POST /api/auth/registro/`
2. `GET /api/auth/registro/?email=seledonio.torres@example.com`
3. `GET /api/auth/perfil/`
4. `PUT /api/auth/perfil/`
5. `PATCH /api/auth/perfil/`
6. `POST /api/auth/login/`
7. `DELETE /api/auth/perfil/`

Para repetir el flujo, usa otro email porque `email` es unico.

## 11. Codigos esperados

| Codigo | Significado |
|---:|---|
| `200` | Consulta o actualizacion correcta |
| `201` | Usuario creado |
| `204` | Usuario eliminado |
| `400` | JSON invalido, email duplicado o password debil |
| `401` | Falta Bearer Token o token invalido |
| `405` | Metodo incorrecto para ese endpoint |

## 12. Validacion automatica en el backend

Tambien puedes validar desde terminal:

```powershell
cd C:\FINALPROJECT\cyps\mediguard_web\backend_django
.\.venv\Scripts\python.exe manage.py test users
```

Resultado esperado:

```text
Ran 9 tests
OK
```

Para asignar o verificar rol `ADMIN` desde Postman, usar la guia:

```text
docs/postman_admin_roles.md
```
