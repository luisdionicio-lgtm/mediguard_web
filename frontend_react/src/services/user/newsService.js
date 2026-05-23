import springApi from '../../api/springApi';

export const userNewsService = {
  getAll: async () => {
    const response = await springApi.get('news/');
    return response.data;
  },
};
