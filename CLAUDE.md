# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MediGuard AI is a health/emergency management web app with a monorepo structure:
- `backend_django/` — Django REST Framework API (port 8000)
- `frontend_react/` — React 19 + Vite frontend (port 5173)

## Commands

### Backend (run from `backend_django/`)

```powershell
# Activate virtual environment (Windows)
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Run development server
python manage.py runserver

# Create superuser (ADMIN role auto-assigned)
python manage.py createsuperuser

# Seed emergency numbers (112, 105, 106, 116)
python manage.py shell < seed_emergency.py

# Run tests
python manage.py test

# Run tests for a single app
python manage.py test emergency
python manage.py test users
python manage.py test content
```

### Frontend (run from `frontend_react/`)

```powershell
npm install
npm run dev       # dev server on port 5173
npm run build     # production build
npm run lint      # ESLint
npm run preview   # preview production build
```

## Architecture

### Backend Django apps

- **`users`** — Custom `Usuario` model (UUID PK, email-based auth, no `username`). Roles: `CIUDADANO`, `SOCORRISTA`, `COORDINADOR`, `ADMIN` stored in `UserRole` pivot table. Includes `AuditLog` and `VerificationToken` models. `is_staff`/`is_superuser` are derived from the ADMIN role.
- **`content`** — `Guide`, `Hospital`, `News` models. Managed via Django admin and exposed as read/write viewsets.
- **`emergency`** — `NumeroServicioEmergencia` (global emergency numbers like 112/105, seeded), `EventoSOS` (SOS button activations with optional GPS), `ContactoEmergencia` (user's personal emergency contacts).

All apps use DRF `DefaultRouter` ViewSets. JWT auth (SimpleJWT) is the default for all endpoints; public views override with `permission_classes = [AllowAny]`. Token rotation and blacklisting are enabled — logout invalidates the refresh token.

### API URL structure (`/api/`)

| Group | Endpoints |
|---|---|
| Auth | `register/`, `login/`, `token/refresh/`, `logout/`, `profile/`, `users/` |
| Content | `guides/`, `hospitals/`, `news/` |
| Emergency | `emergency-numbers/`, `sos-events/`, `emergency-contacts/` |

### Frontend API clients

The frontend has **two separate Axios instances** targeting different backends:

- `src/api/adminApi.js` → Django at `VITE_DJANGO_API_URL` (default: `http://127.0.0.1:8000/api/`)
- `src/api/userApi.js` → Spring Boot at `VITE_SPRING_API_URL` (default: `http://127.0.0.1:8081/api/`)
- `src/services/api.js` → Django at `VITE_API_URL` (default: `http://127.0.0.1:8000/api/`)

Services under `src/services/user/` use `userApi` (Spring Boot). Top-level services in `src/services/` delegate to their `user/` counterparts or use `adminApi` directly.

Auth state is persisted in `localStorage` (`access_token`, `refresh_token`, `user`). The `auth-change` custom event is dispatched on login/logout so the Navbar updates reactively.

### Routing

`AppRoutes.jsx` wraps private pages in `<PrivateRoute>`, which checks `authService.isAuthenticated()` (presence of `access_token` in localStorage) and redirects to `/login` if absent. The `/logout` route is a component that calls `authService.logout()` then redirects.

## Environment

Backend config is loaded via `python-decouple` from `backend_django/.env`. Required variables:

```
SECRET_KEY=
DEBUG=True
DB_ENGINE=django.db.backends.postgresql  # or sqlite3 for local dev
DB_NAME=mediguard_web
DB_USER=postgres
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

For SQLite (no `.env` override needed): omit `DB_ENGINE` or set it to `django.db.backends.sqlite3`.

Frontend env vars go in `frontend_react/.env.local`:
```
VITE_API_URL=http://127.0.0.1:8000/api/
VITE_DJANGO_API_URL=http://127.0.0.1:8000/api/
VITE_SPRING_API_URL=http://127.0.0.1:8081/api/
```
