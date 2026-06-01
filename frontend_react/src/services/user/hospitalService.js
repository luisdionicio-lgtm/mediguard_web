import userApi from '../../api/userApi';

export const userHospitalService = {
  getAll: async () => {
    const response = await userApi.get('hospitals/');
    return response.data;
  },
};
import springApi from '../../api/springApi';

export const userHospitalService = {
  getAll: async () => {
    const response = await springApi.get('hospitals/');
    return response.data;
  },
};
