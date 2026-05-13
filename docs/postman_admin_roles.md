# Postman - Gestion de roles ADMIN

Fecha: 2026-05-12  
Base URL:

```text
http://127.0.0.1:8000
```

## 1. Que se corrigio

El superusuario `jortiz@tecsup.com` si puede ser admin, pero faltaban dos cosas:

- En Django Admin no se mostraban claramente los roles del usuario.
- En Postman no existia un endpoint protegido para consultar o asignar roles como `ADMIN`.

Ahora:

- La lista de usuarios del Admin muestra `Roles`, `is_staff` e `is_superuser`.
- La respuesta del usuario incluye `roles`, `is_staff` e `is_superuser`.
- Existe endpoint para gestionar roles:

```text
GET   /api/auth/usuarios/<id>/roles/
PUT   /api/auth/usuarios/<id>/roles/
PATCH /api/auth/usuarios/<id>/roles/
```

Solo un usuario con rol `ADMIN` puede usar ese endpoint.

## 2. Confirmar superusuario en Django Admin

Entrar a:

```text
http://127.0.0.1:8000/admin/
```

Credenciales:

```text
Email: jortiz@tecsup.com
Password: la clave que definiste al crear el superusuario
```

Luego entra a:

```text
Usuarios
```

Ahora deberias ver columnas como:

- `Roles`
- `is_staff`
- `is_superuser`
- `is_active`
- `is_verified`

Para `jortiz@tecsup.com`, lo esperado es:

```text
Roles: ADMIN, CIUDADANO
is_staff: True
is_superuser: True
```

## 3. Login admin en Postman

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
  "email": "jortiz@tecsup.com",
  "password": "TU_PASSWORD"
}
```

Respuesta esperada:

```text
200 OK
```

Script para guardar tokens:

```javascript
const json = pm.response.json();
pm.collectionVariables.set("access_token", json.access);
pm.collectionVariables.set("refresh_token", json.refresh);
```

## 4. Ver tu perfil admin

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
Bearer {{access_token}}
```

Respuesta esperada:

```json
{
  "email": "jortiz@tecsup.com",
  "roles": ["ADMIN", "CIUDADANO"],
  "is_staff": true,
  "is_superuser": true
}
```

## 5. Obtener el id del usuario objetivo

Si quieres convertir en admin a un usuario registrado, primero consulta:

```text
GET {{base_url}}/api/auth/registro/?email=usuario@example.com
```

Copia el valor:

```json
{
  "usuario": {
    "id": "UUID_DEL_USUARIO"
  }
}
```

## 6. Consultar roles de un usuario

Metodo:

```text
GET
```

URL:

```text
{{base_url}}/api/auth/usuarios/UUID_DEL_USUARIO/roles/
```

Authorization:

```text
Bearer {{access_token}}
```

Respuesta esperada:

```json
{
  "email": "usuario@example.com",
  "roles": ["CIUDADANO"],
  "is_staff": false,
  "is_superuser": false
}
```

## 7. Asignar rol ADMIN desde Postman

Metodo:

```text
PUT
```

URL:

```text
{{base_url}}/api/auth/usuarios/UUID_DEL_USUARIO/roles/
```

Authorization:

```text
Bearer {{access_token}}
```

Body:

```json
{
  "roles": ["CIUDADANO", "ADMIN"]
}
```

Respuesta esperada:

```json
{
  "email": "usuario@example.com",
  "roles": ["CIUDADANO", "ADMIN"],
  "is_staff": true,
  "is_superuser": true
}
```

## 8. Quitar rol ADMIN

Metodo:

```text
PUT
```

URL:

```text
{{base_url}}/api/auth/usuarios/UUID_DEL_USUARIO/roles/
```

Authorization:

```text
Bearer {{access_token}}
```

Body:

```json
{
  "roles": ["CIUDADANO"]
}
```

Respuesta esperada:

```json
{
  "roles": ["CIUDADANO"],
  "is_staff": false,
  "is_superuser": false
}
```

## 9. Errores comunes

| Codigo | Motivo | Solucion |
|---:|---|---|
| `401` | No enviaste token o expiro | Hacer login y enviar `Bearer {{access_token}}` |
| `403` | El usuario autenticado no es ADMIN | Iniciar sesion con `jortiz@tecsup.com` u otro admin |
| `404` | UUID incorrecto | Copiar el `id` desde `GET /api/auth/registro/?email=...` |
| `400` | Rol invalido | Usar `CIUDADANO`, `SOCORRISTA`, `COORDINADOR` o `ADMIN` |

## 10. Nota de seguridad

No se permite enviar `"roles": ["ADMIN"]` en el registro publico porque eso permitiria que cualquier persona se cree como administrador. La asignacion de roles se hace en un endpoint separado y protegido por token de un usuario ADMIN.
