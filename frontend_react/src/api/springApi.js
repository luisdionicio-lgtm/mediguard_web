import axios from 'axios';

const clearLocalSession = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('auth-change'));
  window.dispatchEvent(new Event('auth-unauthorized'));
};

const springApi = axios.create({
  baseURL: import.meta.env.VITE_SPRING_API_URL || 'http://127.0.0.1:8081/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

springApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

springApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearLocalSession();
      if (!['/login', '/register'].includes(window.location.pathname)) {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default springApi;
