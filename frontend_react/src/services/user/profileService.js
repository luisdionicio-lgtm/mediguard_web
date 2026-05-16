import userApi from '../../api/userApi';

export const profileService = {
  getProfile: async () => {
    const response = await userApi.get('profile/');
    return response.data;
  },

  // TODO: agregar updateProfile(data) cuando exista contrato Spring Boot y uso real en UI.
};
