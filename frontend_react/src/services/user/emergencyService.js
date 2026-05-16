import userApi from '../../api/userApi';

export const emergencyService = {
  getAll: async () => {
    const response = await userApi.get('emergencies/');
    return response.data;
  },
};
