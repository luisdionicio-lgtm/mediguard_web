# Guia Postman - Sprint 1: Registro de usuarios

Fecha: 2026-05-12  
Backend local: `http://127.0.0.1:8000`

## 1. Error de la captura

En la captura se esta enviando:

```http
GET http://127.0.0.1:8000/api/auth/registro/
```

Ese endpoint es para crear usuarios, por eso debe usarse con:

```http
POST http://127.0.0.1:8000/api/auth/registro/
```

El codigo `405 Method Not Allowed` significa que la URL existe, pero el metodo HTTP usado no esta permitido para ese endpoint.

## 2. Preparar Postman

Crear una variable de coleccion o environment:

| Variable | Valor |
|---|---|
| `base_url` | `http://127.0.0.1:8000` |
| `access_token` | vacio al inicio |
| `refresh_token` | vacio al inicio |

En las URLs usa:

```text
{{base_url}}/api/auth/registro/
```

Antes de probar, levantar el backend:

```powershell
cd C:\FINALPROJECT\cyps\mediguard_web\backend_django
.\.venv\Scripts\python.exe manage.py runserver
```

## 3. Registro de usuario

Metodo:

```http
POST
```

URL:

```text
{{base_url}}/api/auth/registro/
```

Headers:

| Key | Value |
|---|---|
| `Content-Type` | `application/json` |

Body:

Seleccionar:

```text
Body -> raw -> JSON
```

JSON:

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

Ejemplo de respuesta:

```json
{
  "usuario": {
    "id": "uuid",
    "first_name": "Ana",
    "last_name": "Seledonio",
    "email": "seledonio.torres@example.com",
    "phone": "+51999888777",
    "is_active": true,
    "is_verified": false,
    "roles": ["CIUDADANO"]
  },
  "tokens": {
    "acceso": "access_token",
    "refresco": "refresh_token"
  }
}
```

Script opcional en la pestana `Scripts > Post-response`:

```javascript
pm.test("Registro creado", function () {
  pm.expect(pm.response.code).to.be.oneOf([201]);
});

const json = pm.response.json();
pm.collectionVariables.set("access_token", json.tokens.acceso);
pm.collectionVariables.set("refresh_token", json.tokens.refresco);
```

## 4. Login por email

Metodo:

```http
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

Ejemplo:

```json
{
  "refresh": "refresh_token",
  "access": "access_token"
}
```

Script opcional:

```javascript
pm.test("Login correcto", function () {
  pm.expect(pm.response.code).to.eql(200);
});

const json = pm.response.json();
pm.collectionVariables.set("access_token", json.access);
pm.collectionVariables.set("refresh_token", json.refresh);
```

## 5. Consultar perfil

Metodo:

```http
GET
```

URL:

```text
{{base_url}}/api/auth/perfil/
```

Authorization:

Seleccionar:

```text
Authorization -> Type: Bearer Token
```

Token:

```text
{{access_token}}
```

Respuesta esperada:

```text
200 OK
```

Si responde `401 Unauthorized`, el token no fue enviado, expiro o esta mal guardado.

## 6. Actualizar perfil

Metodo:

```http
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
  "first_name": "Ana Maria",
  "last_name": "Seledonio",
  "phone": "+51999777666"
}
```

Respuesta esperada:

```text
200 OK
```

## 7. Refrescar token

Metodo:

```http
POST
```

URL:

```text
{{base_url}}/api/auth/token/refresco/
```

Body:

```json
{
  "refresh": "{{refresh_token}}"
}
```

Respuesta esperada:

```text
200 OK
```

Como el backend rota refresh tokens, guarda el nuevo refresh:

```javascript
const json = pm.response.json();
pm.collectionVariables.set("access_token", json.access);

if (json.refresh) {
  pm.collectionVariables.set("refresh_token", json.refresh);
}
```

## 8. Cerrar sesion

Metodo:

```http
POST
```

URL:

```text
{{base_url}}/api/auth/cerrar-sesion/
```

Authorization:

```text
Bearer {{access_token}}
```

Body:

```json
{
  "refresco": "{{refresh_token}}"
}
```

Respuesta esperada:

```text
200 OK
```

Ejemplo:

```json
{
  "mensaje": "Sesión cerrada correctamente."
}
```

## 9. Errores comunes

| Codigo | Causa probable | Solucion |
|---|---|---|
| `405 Method Not Allowed` | Metodo incorrecto | Usar `POST` para registro/login/logout, `GET` para perfil, `PATCH` para actualizar perfil |
| `400 Bad Request` | Body invalido, email repetido o password debil | Revisar nombres de campos, formato JSON y reglas de password |
| `401 Unauthorized` | Falta token o token invalido | Enviar `Authorization: Bearer {{access_token}}` |
| `404 Not Found` | URL incorrecta | Revisar slash final `/` y prefijo `/api/auth/` |
| `500 Internal Server Error` | Error interno o migraciones pendientes | Ejecutar `manage.py migrate` y revisar consola del servidor |

## 10. Orden recomendado de pruebas

1. `POST /api/auth/registro/`
2. Guardar `access_token` y `refresh_token`.
3. `GET /api/auth/perfil/`
4. `PATCH /api/auth/perfil/`
5. `POST /api/auth/login/`
6. `POST /api/auth/token/refresco/`
7. `POST /api/auth/cerrar-sesion/`

## 11. Campos correctos

Registro usa estos campos:

```json
{
  "first_name": "Ana",
  "last_name": "Seledonio",
  "email": "seledonio.torres@example.com",
  "phone": "+51999888777",
  "contrasena": "ClaveSegura123!"
}
```

Login usa estos campos:

```json
{
  "email": "seledonio.torres@example.com",
  "password": "ClaveSegura123!"
}
```

No usar `username`; el backend actual fue ajustado para autenticacion por `email`.
