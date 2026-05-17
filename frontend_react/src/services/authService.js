import userApi from '../api/userApi';
import { profileService } from './user/profileService';

const notifyAuthChange = () => {
  window.dispatchEvent(new Event('auth-change'));
};

const persistAuthData = (data) => {
  const accessToken = data.access || data.accessToken || data.tokens?.access;
  const refreshToken = data.refresh || data.refreshToken || data.tokens?.refresh;

  if (accessToken) {
    localStorage.setItem('access_token', accessToken);
  }
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  if (accessToken) {
    notifyAuthChange();
  }
};

export const authService = {
  login: async (email, password) => {
    // We map password to contrasena for the new backend
    const response = await userApi.post('usuarios/login', { email, contrasena: password });
    persistAuthData(response.data);
    return response.data;
  },

  register: async (userData) => {
    // Map first_name to nombre, and password to contrasena
    const payload = {
      nombre: userData.first_name + (userData.last_name ? ' ' + userData.last_name : ''),
      email: userData.email,
      contrasena: userData.password
    };
    const response = await userApi.post('usuarios/registro', payload);
    persistAuthData(response.data);
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    try {
      if (refreshToken) {
        // TODO: ajustar payload si Spring Boot define otro contrato para invalidar refresh tokens.
        await userApi.post('logout/', { refresh: refreshToken });
      }
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      notifyAuthChange();
    }
  },

  getProfile: async () => {
    return profileService.getProfile();
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  }
};
