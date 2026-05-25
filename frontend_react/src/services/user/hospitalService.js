import springApi from '../../api/springApi';

export const userHospitalService = {
  getAll: async () => {
    const response = await springApi.get('hospitals/');
    return response.data;
  },
};
