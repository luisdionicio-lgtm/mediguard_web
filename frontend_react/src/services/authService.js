import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('login/', { email, password });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('register/', userData);
    if (response.data.tokens) {
      localStorage.setItem('access_token', response.data.tokens.acceso);
      localStorage.setItem('refresh_token', response.data.tokens.refresco);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  getProfile: async () => {
    const response = await api.get('profile/');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  }
};
