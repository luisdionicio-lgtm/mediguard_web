import { createAxiosClient } from './httpClient';

const djangoApi = createAxiosClient(
  import.meta.env.VITE_DJANGO_API_URL || 'http://127.0.0.1:8000/api/',
  {
    tokenKeys: ['access_token'],
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
