# 🩺 MediGuard AI - Sistema Inteligente de Primeros Auxilios

MediGuard AI es una plataforma de primeros auxilios desarrollada para brindar asistencia rápida en situaciones de emergencia mediante una aplicación móvil, plataforma web administrativa y servicios backend.

El sistema permite:
- Activación rápida mediante botón SOS.
- Consulta de guías de primeros auxilios.
- Ubicación de centros médicos cercanos.
- Gestión de contactos de emergencia.
- Asistente inteligente Auxilios-AI.
- Entrenamiento mediante quiz y generación de certificados.

---

# 🚀 Tecnologías utilizadas

## 📱 Aplicación móvil Android

- Kotlin
- Jetpack Compose
- Material 3
- MVVM
- Retrofit
- Room Database
- Google Maps API

---

## 🌐 Plataforma Web

- React
- Vite
- Tailwind CSS
- TanStack Query
- Axios

Funciones:

- Landing informativa
- Login y registro
- Dashboard
- Cursos de primeros auxilios
- Quiz
- Certificados PDF

---

## ⚙️ Backend

### Spring Boot API Principal

- Java 21
- Spring Boot
- Spring Security JWT
- Spring Data JPA
- PostgreSQL

Servicios:

- Usuarios
- Autenticación
- Perfil
- Contactos
- Eventos SOS
- Guías de primeros auxilios


### Django REST API Administrativa

- Django
- Django REST Framework
- JWT
- Panel administrativo

Servicios:

- Gestión de usuarios
- Cursos
- Noticias
- Certificados


---

# 🗄 Base de datos

Producción:

PostgreSQL Railway


Desarrollo local:

PostgreSQL local


---

# 📂 Estructura del proyecto


MediGuard-AI/

│

├── backend-spring/

│ ├── src/main/java

│ ├── application.properties

│ └── pom.xml

│

├── backend-django/

│ ├── manage.py

│ ├── requirements.txt

│ └── api/

│

├── web/

│ ├── src/

│ ├── package.json

│ └── vite.config.js

│

└── android/

├── app/

├── data/

├── ui/

└── viewmodel/


---

# ⚙️ Configuración de variables de entorno

Crear las variables necesarias:

## Spring Boot


DATABASE_URL=
DATABASE_USERNAME=
DATABASE_PASSWORD=

JWT_SECRET=

SERVER_PORT=8080


## Django


SECRET_KEY=

DATABASE_URL=

DEBUG=False


## React


VITE_API_URL=https://backend-production.up.railway.app


---

# 🚄 Despliegue en Railway

## 1. Crear proyecto

Ingresar a:

https://railway.app

Seleccionar:

New Project

Import from GitHub Repository


---

## 2. Conectar repositorio

Seleccionar el repositorio:


MediGuard-AI


Railway detectará automáticamente los servicios.


---

# 🟢 Desplegar Spring Boot

Entrar al servicio:

backend-spring

Configurar variables:


DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD
JWT_SECRET


Railway ejecutará:


./mvnw clean package


Iniciar:


java -jar target/*.jar


Verificar:


https://backend.up.railway.app/api/


---

# 🟣 Desplegar Django

Agregar variables:


SECRET_KEY
DATABASE_URL


Instalar:


pip install -r requirements.txt


Migraciones:


python manage.py migrate


Ejecutar:


gunicorn config.wsgi


---

# 🔵 Desplegar React

Configurar:


VITE_API_URL=https://backend.up.railway.app


Instalar dependencias:


npm install


Generar producción:


npm run build


Ejecutar:


npm run preview


---

# 📱 Configuración Android 
--- repositorio: https://github.com/luisdionicio-lgtm/Movil_PrimerosAuxilios_medicguard

Cambiar URL de Retrofit:

Archivo:


RetrofitClient.kt


Producción:

```kotlin
private const val BASE_URL =
"https://backend.up.railway.app/api/"

Compilar APK:

Android Studio:


Build > Generate APK


Instalar:


MediGuard.apk

🧪 Pruebas realizadas

✔ Registro de usuarios

✔ Login JWT

✔ Consumo API móvil

✔ Botón SOS

✔ Google Maps

✔ Chatbot Auxilios-AI

✔ Guías offline con Room

✔ Quiz web

✔ Certificado PDF

👥 Equipo Scrum
Product Owner

Doc. Jaime Gómez Marin

Scrum Master

Jeronimo Rodrigo Ortiz Ortiz

Development Team
Luis Angel Dionicio Bartolo
Desarrollo Android
Jetpack Compose
MVVM
Integración API móvil
Diseño UI
Rony Quintana Llanque
Backend
Base de datos
Servicios API
Jeronimo Ortiz Ortiz
Plataforma Web
Administración
Pruebas
📌 Estado del proyecto

Proyecto desarrollado durante 4 Sprints aplicando metodología Scrum.

Periodo:

Abril 2026 - Junio 2026

Versión final:

MediGuard AI 1.0