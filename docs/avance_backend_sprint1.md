# Avance del backend y recomendaciones para Sprint 1

Fecha de revision: 2026-05-12  
Proyecto: MediGuard AI  
Alcance revisado: `backend_django`, documentacion existente y puntos de integracion con `frontend_react`.

> Nota: interpreto "spring 1" como "Sprint 1". Si el equipo se referia a Spring Framework, este proyecto no usa Spring; el backend esta construido con Django + Django REST Framework.

## Resumen ejecutivo

El backend tiene una base solida para un primer sprint: modelo de usuario personalizado, autenticacion JWT, configuracion de Django REST Framework, modelos de emergencia, administracion en Django Admin, migraciones y documentacion de esquema de base de datos.

El avance actual parece estar en una etapa de "base tecnica y autenticacion", no todavia en una etapa de API funcional completa para emergencias. La principal brecha no esta en los modelos, sino en que parte de la logica ya modelada no esta expuesta por endpoints REST ni conectada al frontend.

## Estado actual

### Ya implementado

- Proyecto Django configurado en `backend_django`.
- Apps principales:
  - `users`: usuario personalizado, autenticacion y perfil.
  - `emergency`: contactos de emergencia, eventos SOS y numeros institucionales.
- Autenticacion con JWT mediante `djangorestframework_simplejwt`.
- Endpoints activos bajo `/api/auth/`:
  - `POST /api/auth/registro/`
  - `POST /api/auth/login/`
  - `POST /api/auth/token/refresco/`
  - `GET /api/auth/perfil/`
  - `PATCH /api/auth/perfil/`
  - `POST /api/auth/cerrar-sesion/`
- Modelos de emergencia registrados en Django Admin.
- Seed manual para numeros de emergencia en `seed_emergency.py`.
- Documentacion de esquema de base de datos en `docs/esquema_base_de_datos.md`.
- Verificacion tecnica:
  - `python manage.py check`: sin errores.
  - `python manage.py makemigrations --check --dry-run`: sin migraciones pendientes.
  - `npm run build`: el frontend compila.

### Pendiente o incompleto

- La app `emergency` no tiene serializers, URLs ni views REST reales.
- `config/urls.py` mantiene comentada la ruta `api/emergencia/`.
- Los modelos comentan endpoints esperados, por ejemplo historial SOS, pero esos endpoints aun no existen.
- El frontend de login y registro no consume el backend; solo valida campos y muestra `alert`.
- No hay tests automatizados en backend: Django reporta 0 tests.
- El lint del frontend falla por una variable no usada en `frontend_react/src/components/Navbar.jsx`.
- No hay archivo README del backend con pasos de instalacion, variables `.env`, migraciones, seed y endpoints.
- No hay contrato formal de API para que frontend/backend trabajen coordinados.

## Brechas relevantes para Sprint 1

Para un Sprint 1 razonable, el backend deberia cerrar al menos estas capacidades:

1. Autenticacion funcional y verificable
   - Registro, login, refresh, logout y perfil ya existen.
   - Falta cubrirlos con tests.
   - Falta alinear el contrato con el frontend: el backend usa `username` para login por defecto, mientras el formulario del frontend pide correo.

2. Integracion minima frontend-backend
   - El frontend tiene rutas `/login` y `/registro`, pero no llama a `/api/auth/`.
   - Si Sprint 1 incluye una demo funcional, esta es una brecha critica.

3. Emergencias expuestas como API
   - Los modelos existen, pero no hay endpoints para:
     - listar/crear/editar/eliminar contactos de emergencia;
     - listar numeros de emergencia activos por pais;
     - crear evento SOS;
     - resolver o marcar falsa alarma;
     - consultar historial SOS.
   - Esto impide que las historias asociadas a SOS y contacto de emergencia esten completas desde backend.

4. Pruebas y validacion
   - Sin tests, el avance depende de pruebas manuales.
   - Para Sprint 1 conviene cubrir al menos flujos principales de auth y reglas basicas de emergencia.

5. Configuracion operativa
   - `SECRET_KEY`, `DEBUG` y `CORS_ALLOWED_ORIGINS` ya se leen desde `.env`.
   - Falta documentar `.env.example` o una seccion equivalente para que otro integrante levante el backend sin preguntar.

## Riesgos tecnicos observados

- Login por correo vs username: el frontend solicita correo, pero `TokenObtainPairView` autentica con `username` por defecto. Esto puede romper la demo aunque el endpoint exista.
- `last_name` es requerido en el modelo, pero el serializer de registro solo recibe `first_name`. Dependiendo de las validaciones y expectativas del equipo, puede quedar como cadena vacia y generar perfiles incompletos.
- `telefono` permite `null=True`, `blank=True`, `unique=True`; en SQLite funciona, pero conviene validar comportamiento esperado al migrar a PostgreSQL.
- Hay documentacion de endpoints de emergencia en comentarios, pero no implementacion. Esto puede dar una percepcion falsa de avance si solo se revisan modelos.
- `seed_emergency.py` funciona como script manual, pero para datos iniciales repetibles convendria usar fixture, management command o migracion de datos.
- No hay control de permisos por objeto documentado para contactos/eventos. Los endpoints futuros deben asegurar que un usuario solo vea y modifique sus propios registros.

## Recomendacion de ruta de desarrollo

### Prioridad 1: cerrar autenticacion usable

- Decidir si el login sera por `username` o por `email`.
- Si el producto pide correo, implementar autenticacion por email o adaptar registro para generar/usar username de forma transparente.
- Conectar `Login.jsx` y `Register.jsx` a la API.
- Persistir tokens en el frontend con una estrategia clara.
- Agregar manejo de errores de API en formularios.

### Prioridad 2: exponer emergencia como API

Crear en `emergency`:

- `serializers.py`
- `urls.py`
- views o viewsets para:
  - contactos de emergencia;
  - numeros de servicio de emergencia;
  - eventos SOS.

Endpoints sugeridos:

```text
GET    /api/emergencia/contactos/
POST   /api/emergencia/contactos/
PATCH  /api/emergencia/contactos/{id}/
DELETE /api/emergencia/contactos/{id}/

GET    /api/emergencia/servicios/?pais=PE

POST   /api/emergencia/sos/
GET    /api/emergencia/sos/historial/
PATCH  /api/emergencia/sos/{id}/resolver/
PATCH  /api/emergencia/sos/{id}/falsa-alarma/
```

### Prioridad 3: pruebas minimas

Agregar tests de:

- registro exitoso;
- registro con email duplicado;
- login/refresh/logout;
- perfil autenticado;
- usuario no autenticado rechazado;
- CRUD de contactos limitado al usuario autenticado;
- creacion de evento SOS;
- listado de servicios activos por pais.

### Prioridad 4: documentacion de uso

Agregar un README de backend o seccion en `docs` con:

- instalacion del entorno;
- variables `.env`;
- migraciones;
- seed de datos;
- comandos de verificacion;
- tabla de endpoints;
- ejemplos JSON de request/response.

## Criterio de cierre recomendado para Sprint 1

Sprint 1 deberia considerarse cerrado cuando:

- El backend levanta localmente con pasos documentados.
- Registro y login funcionan desde frontend real, no solo desde API.
- El usuario autenticado puede consultar y actualizar su perfil.
- Existen endpoints REST para contactos de emergencia y numeros institucionales.
- El evento SOS puede registrarse desde la API.
- Hay tests automatizados para los flujos principales.
- `python manage.py check`, `python manage.py test`, `npm run build` y `npm run lint` pasan sin errores.

## Propuesta de siguiente paso inmediato

El siguiente trabajo backend deberia ser pequeño y verificable:

1. Definir contrato de autenticacion con frontend: email o username.
2. Implementar serializers, URLs y endpoints REST de `emergency`.
3. Activar `path('api/emergencia/', include('emergency.urls'))`.
4. Agregar tests de auth y emergency.
5. Documentar comandos y ejemplos de API.

Con eso el backend pasa de "modelado y auth base" a "API consumible para Sprint 1".
