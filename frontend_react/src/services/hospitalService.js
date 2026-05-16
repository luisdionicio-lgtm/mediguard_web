import { userHospitalService } from './user/hospitalService';

export const hospitalService = {
  getAll: async () => {
    return userHospitalService.getAll();
  }
};
