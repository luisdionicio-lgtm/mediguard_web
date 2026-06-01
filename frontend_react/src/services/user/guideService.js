import userApi from '../../api/userApi';

export const userGuideService = {
  getAll: async () => {
    const response = await userApi.get('guides/');
    return response.data;
  },
};
import springApi from '../../api/springApi';

export const userGuideService = {
  getAll: async () => {
    const response = await springApi.get('guides/');
    return response.data;
  },
};
