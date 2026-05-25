import springApi from '../../api/springApi';

export const userGuideService = {
  getAll: async () => {
    const response = await springApi.get('guides/');
    return response.data;
  },
};
