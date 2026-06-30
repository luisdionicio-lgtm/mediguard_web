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

export default djangoApi;
