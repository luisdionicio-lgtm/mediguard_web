# Guía de contribución — MediGuard AI
> Para el equipo de desarrollo. Léelo completo antes de tocar cualquier archivo.

---

## 1. Cómo correr el proyecto

```bash
cd frontend_react
npm install
npm run dev       # http://localhost:5173
npm run build     # build de producción
```

---

## 2. Rama de trabajo

| Regla | Detalle |
|---|---|
| **Rama activa** | `test/cambio` |
| **Nunca tocar** | `main` directamente |
| **Commits** | Los hace **Rony** manualmente — tú solo editas archivos |
| **Worktrees** | No crear nuevos. Solo existe `festive-wilson-c3cdcc` |

---

## 3. Estructura de carpetas relevante

```
mediguard_web/
└── frontend_react/
    └── src/
        ├── pages/          ← Vistas principales
        ├── components/     ← Componentes reutilizables
        ├── styles/         ← CSS global y por sección
        ├── services/       ← Lógica de API y auth
        └── hooks/          ← Hooks personalizados
```

---

## 4. Archivos YA TERMINADOS — no modificar sin coordinación

### Pages
| Archivo | Estado | Qué tiene |
|---|---|---|
| `pages/Login.jsx` | ✅ Terminado | Layout 2 columnas, ilustración SVG animada, lógica JWT + Google OAuth intacta |
| `pages/Register.jsx` | ✅ Terminado | Escena animada emergencias/defensa civil, flujo 2 pasos, validación |
| `pages/Home.jsx` | ✅ Terminado | Hero MediAlert, secciones Nosotros / Recursos / Features / Misión |

### Components
| Archivo | Estado | Qué tiene |
|---|---|---|
| `components/Navbar.jsx` | ✅ Terminado | Links, botones auth estilizados, mobile menu, scroll activo |
| `components/AuthBackground.jsx` | ✅ Terminado | Fondo animado SVG compartido para Login y Register |
| `components/GoogleLoginButton.jsx` | ✅ No tocar | OAuth Google — lógica sensible |

### Styles
| Archivo | Estado | Qué tiene |
|---|---|---|
| `styles/global.css` | ✅ Terminado | Sistema completo `.auth-*`, `.reg-mini-stats`, animaciones, dark mode variables |
| `styles/Home.css` | ✅ Terminado | Hero, stats, cards, secciones |

### Services — **NO MODIFICAR**
| Archivo | Descripción |
|---|---|
| `services/authService.js` | Login, register, logout, Google OAuth, roles |
| `services/errorService.js` | Mapeo de errores del backend |

---

## 5. Paleta de colores — respetar siempre

| Uso | Color | Hex |
|---|---|---|
| Fondo oscuro marca | Verde muy oscuro | `#0D2B1A` |
| Color marca principal | Verde esmeralda | `#059669` |
| Acento / hover | Verde claro | `#34D399` |
| Fondo suave | Verde muy claro | `#F0F7F3` |
| Emergencia / crítico | Rojo | `#DC2626` |
| Defensa civil | Azul | `#1D4ED8` |
| Alerta | Ámbar | `#F59E0B` |

---

## 6. Stack técnico

| Tecnología | Versión | Nota |
|---|---|---|
| React | 19 | — |
| Vite | Latest | `npm run dev` |
| Tailwind CSS | v4 | Sin `tailwind.config.js`, usa `@import` en CSS |
| Tabler Icons | CDN | Clase `ti ti-nombre` |
| React Router | v6 | `<Link>`, `useNavigate` |

---

## 7. Variables de entorno

Crear archivo `.env` en `frontend_react/`:

```env
VITE_GOOGLE_CLIENT_ID=tu_client_id_aqui   # opcional, activa OAuth Google
VITE_API_URL=http://localhost:8000         # URL del backend Django
```

---

## 8. Reglas de estilo y código

- **CSS custom** va en `styles/global.css` usando clases `.nombre-descriptivo`
- **No mezclar** Tailwind y CSS custom en el mismo componente sin necesidad
- **No usar** `!important` ni estilos inline masivos
- **Lógica de auth** (JWT, tokens, roles) — solo tocar si Rony lo aprueba
- **SVG animados** en Login/Register usan `<animate>` nativo — no reemplazar con librerías externas

---

## 9. Secciones disponibles en Home (`/`)

| ID | Sección | Color fondo |
|---|---|---|
| `#inicio` | Hero MediAlert | `#1B4332` (verde oscuro) |
| `#about` | Quiénes somos | `#ffffff` |
| `#recursos` | Aprende / Guías | `#F0FDFA` |
| `#features` | ¿Cuándo actuar? | blanco/cards |
| `#mision` | Misión | blanco |

---

## 10. Rutas de la app

| Ruta | Componente | Acceso |
|---|---|---|
| `/` | `Home.jsx` | Público |
| `/login` | `Login.jsx` | Público |
| `/register` | `Register.jsx` | Público |
| `/dashboard` | `Dashboard.jsx` | Autenticado |
| `/profile` | `Profile.jsx` | Autenticado |
| `/admin/dashboard` | Admin | Rol ADMIN |

---

> Dudas → coordinarse con **Rony** antes de modificar cualquier archivo marcado como ✅ Terminado.
