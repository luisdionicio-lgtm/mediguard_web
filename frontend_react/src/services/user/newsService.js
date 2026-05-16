import userApi from '../../api/userApi';

export const userNewsService = {
  getAll: async () => {
    const response = await userApi.get('news/');
    return response.data;
  },
};
