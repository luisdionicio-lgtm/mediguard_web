import userApi from '../../api/userApi';

export const profileService = {
  getProfile: async () => {
    try {
      const response = await userApi.get('profile/');
      return response.data;
    } catch (error) {
      // Fallback to local storage user data
      const localUser = localStorage.getItem('user');
      if (localUser) {
        return JSON.parse(localUser);
      }
      throw error;
    }
  },
};
