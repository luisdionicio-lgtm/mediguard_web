import { useQuery } from '@tanstack/react-query';
import djangoApi from '../api/djangoApi';

export function useLessons(courseSlug) {
  return useQuery({
    queryKey: ['lessons', courseSlug],
    queryFn: async () => {
      const { data } = await djangoApi.get(`courses/${courseSlug}/lessons/`);
      return Array.isArray(data) ? data : data.results ?? [];
    },
    enabled: !!courseSlug,
  });
}
