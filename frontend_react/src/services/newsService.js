import api from './api';

export const newsService = {
  getAll: async () => {
    const response = await api.get('news/');
    return response.data;
  }
};
