import { useMemo } from 'react';
import axios from 'axios';

const DJANGO_BASE = import.meta.env.VITE_DJANGO_API_URL || 'http://127.0.0.1:8000/api/';
const SPRING_BASE = import.meta.env.VITE_SPRING_API_URL || 'http://127.0.0.1:8081/api/';

function createInstance(baseURL) {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response?.status === 401) {
        window.dispatchEvent(new Event('auth-unauthorized'));
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

/**
 * Hook que expone dos instancias axios preconfiguradas con JWT.
 *
 * djangoApi → Django :8000 (cursos, usuarios, guías)
 * springApi → Spring Boot :8081 (enrollments, progreso, certificados)
 */
export function useApi() {
  const djangoApi = useMemo(() => createInstance(DJANGO_BASE), []);
  const springApi = useMemo(() => createInstance(SPRING_BASE), []);
  return { djangoApi, springApi };
}
