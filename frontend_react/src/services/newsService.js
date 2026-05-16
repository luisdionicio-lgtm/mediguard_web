import { userNewsService } from './user/newsService';

export const newsService = {
  getAll: async () => {
    return userNewsService.getAll();
  }
};
