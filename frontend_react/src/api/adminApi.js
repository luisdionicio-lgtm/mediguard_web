import { createAxiosClient } from './httpClient';

// Usa el token de Django (no el de Spring Boot) para el panel admin,
// con el mismo fallback que tenía antes de consolidar el cliente.
const adminApi = createAxiosClient(
  import.meta.env.VITE_DJANGO_API_URL || 'http://127.0.0.1:8000/api/',
  {
    tokenKeys: ['django_access_token', 'access_token'],
  },
);

export default adminApi;
