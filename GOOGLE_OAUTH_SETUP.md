# Configurar Login con Google — Guía paso a paso

> Esta guía es para configurar el botón **"Continuar con Google"** en MediGuard.
> Tiempo estimado: 15–20 minutos.

---

## Antes de empezar: dos cosas de Google que NO son lo mismo

El proyecto usa dos servicios de Google distintos. Es importante no confundirlos:

| | Gmail SMTP (App Password) | Google OAuth 2.0 |
|---|---|---|
| **Para qué sirve** | Enviar correos de verificación de email | Botón "Continuar con Google" en el login |
| **Dónde se configura** | `usuario/src/main/resources/application.properties` | Google Cloud Console + `.env` del frontend |
| **Esta guía cubre** | No | **Sí** |

Si ya configuraste el `MAIL_APP_PASSWORD` para los correos, eso está bien pero es una cosa diferente. Para el botón de Google necesitas seguir esta guía.

---

## Paso 1 — Crear el proyecto en Google Cloud Console

> Si el proyecto ya existe (alguien del equipo lo creó), salta al **Paso 2**.

1. Entra a [https://console.cloud.google.com](https://console.cloud.google.com) con tu cuenta Google del equipo.
2. Haz clic en el selector de proyectos (arriba a la izquierda) → **"Nuevo proyecto"**.
3. Nómbralo `mediguard-dev` (o similar) → **Crear**.
4. Asegúrate de tener el proyecto seleccionado en el selector.

---

## Paso 2 — Habilitar la API de Google Identity

1. En el menú lateral ve a **"APIs y servicios"** → **"Biblioteca"**.
2. Busca **"Google Identity"** o **"OAuth2"**.
3. Selecciona **"Google Identity Services"** → clic en **"Habilitar"**.

---

## Paso 3 — Crear el OAuth 2.0 Client ID

1. Ve a **"APIs y servicios"** → **"Credenciales"**.
2. Clic en **"+ Crear credenciales"** → **"ID de cliente de OAuth"**.
3. Si te pide configurar la "pantalla de consentimiento", hazlo primero:
   - Tipo de usuario: **Externo**
   - Nombre de la aplicación: `MediGuard`
   - Correo de soporte: el tuyo
   - Guarda y continúa (el resto de los pasos puedes dejarlos vacíos por ahora).
4. De vuelta en "Crear ID de cliente de OAuth":
   - **Tipo de aplicación**: Aplicación web
   - **Nombre**: `MediGuard Local Dev`
   - En **"Orígenes de JavaScript autorizados"** agrega exactamente:
     ```
     http://localhost:5173
     http://localhost
     ```
   - En **"URIs de redireccionamiento autorizados"**: déjalo vacío (usamos flujo implícito, no redirect).
5. Clic en **"Crear"**.
6. Se abre un popup con:
   - **ID de cliente**: algo como `354065066419-xxxx.apps.googleusercontent.com`
   - **Secreto de cliente**: `GOCSPX-xxxx...`
   - Copia ambos valores y guárdalos en un lugar seguro.

---

## Paso 4 — Configurar el frontend (React)

El frontend necesita el **ID de cliente** (no el secreto).

1. Abre el archivo `frontend_react/.env`.
   - Si no existe, copia `frontend_react/.env.example` y renómbralo a `.env`.
2. Reemplaza la línea de `VITE_GOOGLE_CLIENT_ID`:

```env
VITE_GOOGLE_CLIENT_ID=TU_CLIENT_ID_AQUI.apps.googleusercontent.com
VITE_DJANGO_API_URL=http://127.0.0.1:8000/api/
VITE_SPRING_API_URL=http://127.0.0.1:8081/api/
```

> **Importante:** El archivo `.env` está en `.gitignore`. No lo commitees al repositorio.

3. Guarda el archivo.

---

## Paso 5 — Configurar el backend Django

Django necesita el **Client ID** para verificar los tokens de Google en el servidor.

1. Abre `backend_django/config/settings.py` y busca:
```python
GOOGLE_CLIENT_ID = config('GOOGLE_CLIENT_ID', default='')
```
Si no existe esa línea, busca dónde está configurado el OAuth de Google.

2. Abre (o crea) el archivo `backend_django/.env` y agrega:
```env
GOOGLE_CLIENT_ID=TU_CLIENT_ID_AQUI.apps.googleusercontent.com
```

> El backend Django no necesita el `GOOGLE_CLIENT_SECRET` porque usa el flujo implícito
> (verifica el token llamando directamente a la API de Google UserInfo, no con el secreto).

---

## Paso 6 — Reiniciar los servidores

Los cambios en `.env` solo se aplican cuando el servidor se reinicia.

**Frontend:**
```bash
# Detén el servidor (Ctrl+C) y vuelve a ejecutar:
cd frontend_react
npm run dev
```

**Django:**
```bash
# Detén el servidor (Ctrl+C) y vuelve a ejecutar:
cd backend_django
.\venv\Scripts\activate      # Windows
source venv/bin/activate     # Mac/Linux
python manage.py runserver
```

---

## Paso 7 — Verificar que funciona

1. Abre [http://localhost:5173/login](http://localhost:5173/login).
2. Debe aparecer el botón **"Continuar con Google"** debajo del formulario.
3. Haz clic en el botón → debe abrirse el popup de selección de cuenta de Google.
4. Selecciona tu cuenta → debes redirigir al Dashboard.

---

## Errores comunes y soluciones

### El botón no aparece en el login

**Causa:** Vite no leyó el `.env` porque el servidor ya estaba corriendo cuando lo modificaste.

**Solución:** Detén `npm run dev` con `Ctrl+C` y vuelve a ejecutar `npm run dev`.

---

### Error 400: `origin_mismatch`

```
No puedes acceder a esta app porque no cumple la política OAuth 2.0 de Google.
Error 400: origin_mismatch
```

**Causa:** El origen `http://localhost:5173` no está en la lista de orígenes autorizados del Client ID.

**Solución:**
1. Ve a [Google Cloud Console → Credenciales](https://console.cloud.google.com/apis/credentials).
2. Abre tu OAuth 2.0 Client ID.
3. En **"Orígenes de JavaScript autorizados"** agrega `http://localhost:5173`.
4. Guarda. Los cambios pueden tardar hasta 5 minutos en propagarse.

---

### Error 400: `redirect_uri_mismatch`

**Causa:** Hay un "URI de redireccionamiento" configurado que no coincide.

**Solución:** En Google Cloud Console, en tu Client ID, deja **vacío** el campo "URIs de redireccionamiento autorizados". El proyecto usa flujo implícito, no necesita redirect URI.

---

### "Error al autenticar con Google" en el frontend

**Causa:** Django (puerto 8000) no está corriendo, o el `GOOGLE_CLIENT_ID` en Django no está configurado.

**Solución:**
1. Verifica que Django está activo: abre [http://localhost:8000/api/auth/google/](http://localhost:8000/api/auth/google/) en el navegador — debe responder (aunque sea con error 405, eso confirma que está vivo).
2. Verifica que `GOOGLE_CLIENT_ID` está en `backend_django/.env`.
3. Reinicia Django.

---

## Flujo completo (para entender qué hace cada parte)

```
Usuario hace clic en "Continuar con Google"
        ↓
React abre popup de Google (usando VITE_GOOGLE_CLIENT_ID)
        ↓
Usuario selecciona su cuenta en Google
        ↓
Google devuelve un access_token al frontend
        ↓
Frontend envía ese token a Django:
  POST http://localhost:8000/api/auth/google/
  { "access_token": "ya29.xxx..." }
        ↓
Django llama a la API de Google para verificar el token
  GET https://www.googleapis.com/oauth2/v3/userinfo
        ↓
Django crea o actualiza el usuario en la BD
y devuelve un JWT propio de MediGuard
        ↓
Frontend guarda el JWT y redirige al Dashboard
```

---

## Checklist final

- [ ] Proyecto creado en Google Cloud Console
- [ ] OAuth 2.0 Client ID creado (tipo: Aplicación web)
- [ ] `http://localhost:5173` en Orígenes de JavaScript autorizados
- [ ] `VITE_GOOGLE_CLIENT_ID` agregado a `frontend_react/.env`
- [ ] `GOOGLE_CLIENT_ID` agregado a `backend_django/.env`
- [ ] Frontend reiniciado (`npm run dev`)
- [ ] Django corriendo en puerto 8000
- [ ] Botón "Continuar con Google" visible en `/login`

---

*Ante cualquier duda, revisa el error exacto en la consola del navegador (F12 → Console) y en la terminal donde corre Django.*
