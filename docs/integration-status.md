# Estado de integración MediGuard 16/05/2026

## Arquitectura actual

- Django administra el esquema de PostgreSQL mediante migraciones.
- Spring Boot usuario consume la misma base de datos con `ddl-auto=none`.
- React usuario consume Spring Boot mediante `userApi`.
- React administración debe consumir Django mediante `adminApi`.

## Puertos

- Django: `http://127.0.0.1:8000/api/`
- Spring Boot usuario: `http://127.0.0.1:8081/api/`
- React: `http://127.0.0.1:5173/`
- PostgreSQL: `localhost:5432`

## Endpoints Spring funcionando

- `GET /api/guides/`
- `GET /api/hospitals/`
- `GET /api/news/`
- `GET /api/emergencies/`

## Pendientes

- Definir contrato JWT.
- Implementar login/register/logout/profile en Spring.
- Completar UI de emergencias/SOS/contactos.
- Validar que Spring no modifique el esquema.
- Mantener Django como owner del esquema y administración.