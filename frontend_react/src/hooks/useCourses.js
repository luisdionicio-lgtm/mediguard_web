import { useInfiniteQuery } from '@tanstack/react-query';
import djangoApi from '../api/djangoApi';

export function useCourses(filters = {}) {
  return useInfiniteQuery({
    queryKey: ['courses', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params = { page: pageParam, limit: 12 };
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await djangoApi.get('courses/', { params });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => lastPage.next ? pages.length + 1 : undefined,
  });
}
