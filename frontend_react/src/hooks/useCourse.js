import { useQuery } from '@tanstack/react-query';
import djangoApi from '../api/djangoApi';

export function useCourse(slug) {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: async () => {
      const { data } = await djangoApi.get(`courses/${slug}/`);
      return data;
    },
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await djangoApi.get('categories/');
      return data?.results ?? data;
    },
    staleTime: 1000 * 60 * 30,
  });
}
