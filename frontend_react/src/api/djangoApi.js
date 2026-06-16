import axios from 'axios';

const djangoApi = axios.create({
  baseURL: import.meta.env.VITE_DJANGO_API_URL || 'http://127.0.0.1:8000/api/',
  headers: { 'Content-Type': 'application/json' },
});

djangoApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

djangoApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    return Promise.reject(error);
  },
);

export default djangoApi;
