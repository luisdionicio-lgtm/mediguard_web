import axios from 'axios';
import springApi from '../api/springApi';
import { profileService } from './user/profileService';

const DJANGO_BASE = import.meta.env.VITE_DJANGO_API_URL || 'http://127.0.0.1:8000/api/';
const djangoPublic = axios.create({ baseURL: DJANGO_BASE });

const notifyAuthChange = () => {
  window.dispatchEvent(new Event('auth-change'));
};

const clearAuthData = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('django_access_token');
  notifyAuthChange();
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
    // 1. Login en Spring Boot
    const response = await springApi.post('login/', { email, password });
    persistAuthData(response.data);

    // 2. Obtener perfil (incluye roles)
    const profileResponse = await springApi.get('profile/');
    const user = profileResponse.data;
    localStorage.setItem('user', JSON.stringify(user));

    // 3. Si es ADMIN, también autenticar en Django para el panel admin
    if (Array.isArray(user.roles) && user.roles.includes('ADMIN')) {
      try {
        const djangoRes = await axios.post(`${DJANGO_BASE}login/`, { email, password });
        const djangoToken = djangoRes.data?.access || djangoRes.data?.tokens?.access;
        if (djangoToken) {
          localStorage.setItem('django_access_token', djangoToken);
        }
      } catch {
        // No bloquea el login si Django falla
      }
    }

    return response.data;
  },

  register: async (userData) => {
    const payload = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      user_type: userData.user_type
    };
    const response = await springApi.post('register/', payload);
    // Note: Do not auto-persist token/user on registration as requested
    return response.data;
  },

  logout: async () => {
    try {
      if (localStorage.getItem('access_token')) {
        await springApi.post('logout/');
      }
    } finally {
      clearAuthData();
    }
  },

  getProfile: async () => {
    return profileService.getProfile();
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  getCurrentUser: () => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  },

  getUserRoles: () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.roles || [];
    } catch {
      return [];
    }
  },

  googleLogin: async (accessToken) => {
    const response = await djangoPublic.post('auth/google/', { access_token: accessToken });
    const data = response.data;
    // Normaliza al mismo formato que login() usa en persistAuthData
    persistAuthData({
      access: data.access_token,
      refresh: data.refresh_token,
      user: data.user,
    });
    return data;
  },

  refresh: async (refreshToken) => {
    const response = await djangoPublic.post('auth/refresh/', { refresh: refreshToken });
    const newAccess = response.data.access;
    if (newAccess) {
      localStorage.setItem('access_token', newAccess);
      notifyAuthChange();
    }
    return response.data;
  },

  isAdmin: () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return Array.isArray(user.roles) && user.roles.includes('ADMIN');
    } catch {
      return false;
    }
  },
};
