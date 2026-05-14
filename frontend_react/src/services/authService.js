import api from './api';

const notifyAuthChange = () => {
  window.dispatchEvent(new Event('auth-change'));
};

export const authService = {
  login: async (email, password) => {
    const response = await api.post('login/', { email, password });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      notifyAuthChange();
    }
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('register/', userData);
    if (response.data.tokens) {
      const accessToken = response.data.tokens.access;
      const refreshToken = response.data.tokens.refresh;
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      notifyAuthChange();
    }
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    try {
      if (refreshToken) {
        await api.post('logout/', { refresh: refreshToken });
      }
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      notifyAuthChange();
    }
  },

  getProfile: async () => {
    const response = await api.get('profile/');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  }
};
