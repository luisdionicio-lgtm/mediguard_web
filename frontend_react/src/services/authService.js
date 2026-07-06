import axios from 'axios';
import springApi from '../api/springApi';
import { createAxiosClient } from '../api/httpClient';
import { profileService } from './user/profileService';

const DJANGO_BASE = import.meta.env.VITE_DJANGO_API_URL || 'http://127.0.0.1:8000/api/';
// Sin tokenKeys ni onUnauthorized: mismo comportamiento que axios.create({ baseURL }) anterior,
// usado solo para llamadas explícitamente públicas/manuales (Google login, refresh y logout Django).
const djangoPublic = createAxiosClient(DJANGO_BASE);
const AUTH_PROVIDER_KEY = 'auth_provider';

const notifyAuthChange = () => {
  window.dispatchEvent(new Event('auth-change'));
};

const clearAuthData = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('django_access_token');
  localStorage.removeItem('django_refresh_token');
  localStorage.removeItem(AUTH_PROVIDER_KEY);
  notifyAuthChange();
};

const persistAuthData = (data, provider) => {
  const accessToken = data.access || data.accessToken || data.access_token || data.tokens?.access;
  const refreshToken = data.refresh || data.refreshToken || data.refresh_token || data.tokens?.refresh;

  if (accessToken) {
    localStorage.setItem('access_token', accessToken);
  }
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  if (provider) {
    localStorage.setItem(AUTH_PROVIDER_KEY, provider);
  }

  if (accessToken) {
    notifyAuthChange();
  }
};

export const authService = {
  login: async (email, password) => {
    // 1. Login en Spring Boot
    const response = await springApi.post('login/', { email, password });
    persistAuthData(response.data, 'spring');

    // 2. Obtener perfil (incluye roles)
    const profileResponse = await springApi.get('profile/');
    const user = profileResponse.data;
    localStorage.setItem('user', JSON.stringify(user));

    // 3. Autenticar también en Django (emite su propio JWT, validable sin
    //    depender de que JWT_SECRET esté sincronizado con Spring Boot en
    //    runtime). Antes esto solo corría para ADMIN (panel admin); ahora
    //    corre para cualquier usuario porque el catálogo de cursos/categorías
    //    en Django también requiere sesión. Si falla, no bloquea el login:
    //    djangoApi.js cae de vuelta al token de Spring como antes.
    try {
      const djangoRes = await axios.post(`${DJANGO_BASE}login/`, { email, password });
      const djangoToken = djangoRes.data?.access || djangoRes.data?.tokens?.access;
      const djangoRefresh = djangoRes.data?.refresh || djangoRes.data?.tokens?.refresh;
      if (djangoToken) {
        localStorage.setItem('django_access_token', djangoToken);
      }
      if (djangoRefresh) {
        localStorage.setItem('django_refresh_token', djangoRefresh);
      }
    } catch {
      // No bloquea el login si Django falla
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
    // Spring ya devuelve accessToken/refreshToken/user válidos: se persisten
    // para loguear automáticamente al usuario recién registrado.
    persistAuthData(response.data);
    return response.data;
  },

  logout: async () => {
    try {
      const provider = localStorage.getItem(AUTH_PROVIDER_KEY) || 'spring';
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      if (provider === 'django' && accessToken && refreshToken) {
        await djangoPublic.post('logout/', { refresh: refreshToken }, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } else if (accessToken) {
        await springApi.post('logout/');
      }
    } finally {
      clearAuthData();
    }
  },

  getProfile: async () => {
    return profileService.getProfile();
  },

  updateProfile: async (profile) => {
    const updatedProfile = await profileService.updateProfile(profile);
    localStorage.setItem('user', JSON.stringify(updatedProfile));
    notifyAuthChange();
    return updatedProfile;
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

  verifyEmail: async (token) => {
    const response = await springApi.get('verify-email/', { params: { token } });
    return response.data;
  },

  googleLogin: async (accessToken) => {
    const response = await springApi.post('auth/google/', { access_token: accessToken });
    const data = response.data;
    // Normaliza al mismo formato que login() usa en persistAuthData
    persistAuthData({
      access: data.access_token,
      refresh: data.refresh_token,
      user: data.user,
    }, 'spring');
    return data;
  },

  refresh: async (refreshToken) => {
    const provider = localStorage.getItem(AUTH_PROVIDER_KEY) || 'spring';
    const response = provider === 'django'
      ? await djangoPublic.post('auth/refresh/', { refresh: refreshToken })
      : await springApi.post('token/refresh/', { refresh: refreshToken });
    const newAccess = response.data.access || response.data.accessToken;
    const newRefresh = response.data.refresh || response.data.refreshToken;
    if (newAccess) {
      localStorage.setItem('access_token', newAccess);
    }
    if (newRefresh) localStorage.setItem('refresh_token', newRefresh);
    if (response.data.user) localStorage.setItem('user', JSON.stringify(response.data.user));
    if (newAccess) notifyAuthChange();
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await springApi.post('forgot-password/', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await springApi.post('reset-password/', { token, new_password: newPassword });
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
