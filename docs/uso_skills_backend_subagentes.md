# Uso de skills backend con subagentes

Fecha: 2026-05-13  
Objetivo: avanzar MediGuard sin duplicar contexto ni gastar tokens revisando siempre todo el proyecto.

## Skills creadas

| Skill | Uso principal | Ruta |
|---|---|---|
| `mediguard-backend-contract` | Mantener contratos API estables para React/Axios | `skills/mediguard-backend-contract` |
| `mediguard-backend-review` | Revisar cambios backend antes de aprobar o continuar | `skills/mediguard-backend-review` |
| `mediguard-backend-tests` | Crear o ajustar pruebas backend focalizadas | `skills/mediguard-backend-tests` |

## Recomendacion profesional de trabajo

Usar subagentes con tareas separadas, concretas y de bajo alcance:

- Un subagente revisa contrato API.
- Otro subagente revisa seguridad/permisos/migraciones.
- Otro subagente crea o ajusta tests.

No pedir a un subagente "revisar todo el proyecto" salvo que sea auditoria final. Eso consume demasiados tokens y produce respuestas vagas.

## Prompt para subagente: contrato API

```text
Usa la skill `mediguard-backend-contract` ubicada en:
C:\FINALPROJECT\cyps\mediguard_web\skills\mediguard-backend-contract

Tarea:
Revisa los endpoints backend actuales de MediGuard para confirmar que el contrato API usado por React/Axios sea estable y esté en inglés.

Alcance:
- backend_django/config/urls.py
- backend_django/users/urls.py
- backend_django/users/views.py
- backend_django/users/serializers.py
- frontend_react/src/services/api.js
- frontend_react/src/services/authService.js

No modifiques archivos. Devuelve:
1. rutas canónicas recomendadas;
2. rutas legacy que conviene mantener temporalmente;
3. inconsistencias de payload;
4. cambios mínimos recomendados.
```

## Prompt para subagente: revisión backend

```text
Usa la skill `mediguard-backend-review` ubicada en:
C:\FINALPROJECT\cyps\mediguard_web\skills\mediguard-backend-review

Tarea:
Haz una revisión de riesgos del backend Django/DRF de MediGuard antes de continuar integrando frontend.

Alcance:
- users
- emergency
- content
- config/urls.py
- config/settings.py

No modifiques archivos. Prioriza:
- duplicidad de rutas o modelos;
- riesgos de migraciones;
- permisos inseguros;
- endpoints que puedan romper Axios;
- errores que afecten Postman.

Devuelve hallazgos ordenados por severidad con archivo y línea.
```

## Prompt para subagente: pruebas backend

```text
Usa la skill `mediguard-backend-tests` ubicada en:
C:\FINALPROJECT\cyps\mediguard_web\skills\mediguard-backend-tests

Tarea:
Propón pruebas mínimas para proteger el backend actual de MediGuard sin ampliar alcance.

Alcance:
- auth/register/login/profile
- roles/admin
- emergency API si ya está activa
- content API si ya está activa

Puedes editar solo archivos `tests.py` si encuentras una brecha clara.
No cambies modelos, serializers ni vistas.

Al terminar, indica:
- pruebas agregadas;
- comando ejecutado;
- resultado.
```

## Prompt combinado para una tarea concreta

Usar cuando haya que implementar algo pequeño:

```text
Usa `mediguard-backend-contract` y `mediguard-backend-tests`.

Tarea:
Estandariza la respuesta de registro para que sea compatible con Axios, sin romper compatibilidad actual.

Restricciones:
- No cambiar tablas de base de datos.
- No renombrar AUTH_USER_MODEL.
- Mantener rutas legacy funcionando.
- Agregar o ajustar tests mínimos.

Verifica con:
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe manage.py makemigrations --check --dry-run
.\.venv\Scripts\python.exe manage.py test
```

## Criterios para no generar spaghetti code

- Un endpoint debe tener un propósito claro.
- Si existe una ruta legacy, documentarla como legacy; no mezclarla con la ruta recomendada.
- No crear una segunda entidad si ya existe una equivalente.
- No agregar más servicios frontend si `authService.js` ya cubre el caso.
- No tocar modelos para resolver problemas de presentación.
- Todo cambio backend que afecte Axios debe tener al menos una prueba de contrato.

## Orden recomendado para avanzar

1. Congelar contrato de auth/users.
2. Confirmar que React usa rutas canónicas.
3. Recién después revisar emergency/content.
4. Agregar tests mínimos antes de nuevas pantallas.
5. Documentar lo legacy para retirarlo después, no duplicarlo más.
