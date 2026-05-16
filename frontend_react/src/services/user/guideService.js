import userApi from '../../api/userApi';

export const userGuideService = {
  getAll: async () => {
    const response = await userApi.get('guides/');
    return response.data;
  },
};
