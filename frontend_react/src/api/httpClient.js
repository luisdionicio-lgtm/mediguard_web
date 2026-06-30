import axios from 'axios';

/**
 * Fábrica compartida de clientes Axios. No cambia ningún contrato HTTP:
 * cada cliente sigue leyendo exactamente las mismas claves de localStorage
 * y reacciona a 401 exactamente igual que antes de la consolidación.
 */
export function createAxiosClient(baseURL, { tokenKeys, onUnauthorized } = {}) {
  const instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

  if (tokenKeys?.length) {
    instance.interceptors.request.use((config) => {
      const token = tokenKeys.map((key) => localStorage.getItem(key)).find(Boolean);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  if (onUnauthorized) {
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          onUnauthorized();
        }
        return Promise.reject(error);
      },
    );
  }

  return instance;
}
