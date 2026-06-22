import springApi from '../../api/springApi';

export const profileService = {
  getProfile: async () => {
    const response = await springApi.get('profile/');
    return response.data;
  },
  updateProfile: async (profile) => {
    const response = await springApi.patch('profile/', profile);
    return response.data;
  },
};
