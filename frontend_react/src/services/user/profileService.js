import springApi from '../../api/springApi';

export const profileService = {
  getProfile: async () => {
    const response = await springApi.get('profile/');
    return response.data;
  },
};
