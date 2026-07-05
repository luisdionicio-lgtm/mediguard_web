# Imagen de desarrollo local para backend_django (Django REST Framework).
# No cambia ninguna lógica de la app: solo empaqueta lo necesario para
# ejecutar manage.py dentro de un contenedor.
FROM python:3.13-slim

WORKDIR /app

# postgresql-client aporta `psql`, usado por docker-compose.dev.yml para
# aplicar los DDL de database/migrations/*.sql después de `manage.py migrate`
# (ver README_DOCKER.md para el motivo del orden).
RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# El comando real (migrate / runserver / aplicar SQL) se define por servicio
# en docker-compose.dev.yml, ya que db_init y backend_django reutilizan esta
# misma imagen con comandos distintos.
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
