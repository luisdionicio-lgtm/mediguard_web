#!/bin/bash
# Compatibilidad: usuario/src/main/resources/application.properties define
# `spring.datasource.username=postgres` como valor literal (no lee ninguna
# variable de entorno para el username, solo para password/URL). Como este
# proyecto pide no modificar application.properties, si POSTGRES_USER en
# .env.docker es distinto de "postgres" (p. ej. mediguard_user), Spring Boot
# no podría autenticarse. Este script crea, solo si no existe, un rol
# adicional "postgres" superusuario con la misma contraseña que
# POSTGRES_PASSWORD, únicamente dentro del contenedor de Postgres.
#
# Se ejecuta una sola vez, cuando el volumen de datos está vacío (mismo
# mecanismo que usa POSTGRES_USER/POSTGRES_DB la primera vez).
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    DO
    \$do\$
    BEGIN
       IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'postgres') THEN
          CREATE ROLE postgres LOGIN SUPERUSER PASSWORD '$POSTGRES_PASSWORD';
       END IF;
    END
    \$do\$;
EOSQL
