import { createAxiosClient } from './httpClient';

const djangoApi = createAxiosClient(
  import.meta.env.VITE_DJANGO_API_URL || 'http://127.0.0.1:8000/api/',
  {
    // Prioriza el token emitido por Django ('django_access_token'): es el
    // único que Django puede validar sin depender de que JWT_SECRET esté
    // sincronizado con el proceso de Spring Boot en runtime. 'access_token'
    // (emitido por Spring) queda como fallback para no romper el flujo
    // existente (p. ej. login con Google, que aún no emite token Django).
    tokenKeys: ['django_access_token', 'access_token'],
    onUnauthorized: () => {
      window.dispatchEvent(new Event('auth-unauthorized'));
    },
  },
);

// Cliente sin cabecera Authorization para endpoints públicos de Django
// (cursos, categorías). DRF devuelve 401 si recibe un token de Spring
// aunque la vista sea AllowAny, porque la autenticación corre antes del check de permisos.
export const djangoPublicApi = createAxiosClient(
  import.meta.env.VITE_DJANGO_API_URL || 'http://127.0.0.1:8000/api/',
  {},
);

export default djangoApi;
