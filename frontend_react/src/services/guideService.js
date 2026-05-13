import api from './api';

export const guideService = {
  getAll: async () => {
    const response = await api.get('guides/');
    return response.data;
  }
};
