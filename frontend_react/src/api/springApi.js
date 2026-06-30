import { createAxiosClient } from './httpClient';

const clearLocalSession = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('django_access_token');
  localStorage.removeItem('django_refresh_token');
  localStorage.removeItem('auth_provider');
  window.dispatchEvent(new Event('auth-change'));
  window.dispatchEvent(new Event('auth-unauthorized'));
};

const springApi = createAxiosClient(
  import.meta.env.VITE_SPRING_API_URL || 'http://127.0.0.1:8081/api/',
  {
    tokenKeys: ['access_token'],
    onUnauthorized: () => {
      clearLocalSession();
      if (!['/login', '/register'].includes(window.location.pathname)) {
        window.location.assign('/login');
      }
    },
  },
);

export default springApi;
