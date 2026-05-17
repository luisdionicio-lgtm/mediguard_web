import { emergencyService as userEmergencyService } from './user/emergencyService';

export const emergencyService = {
  getAll: async () => {
    return userEmergencyService.getAll();
  }
};
