import { userGuideService } from './user/guideService';

export const guideService = {
  getAll: async () => {
    return userGuideService.getAll();
  }
};
