import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import djangoApi from '../api/djangoApi';

export function useRatings(courseSlug) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['ratings', courseSlug],
    queryFn: async () => {
      const { data } = await djangoApi.get(`courses/${courseSlug}/ratings/`);
      return Array.isArray(data) ? data : data.results ?? [];
    },
    enabled: !!courseSlug,
  });

  const submitRating = useMutation({
    mutationFn: async (payload) => {
      const { data } = await djangoApi.post(`courses/${courseSlug}/ratings/`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings', courseSlug] });
      queryClient.invalidateQueries({ queryKey: ['course', courseSlug] });
    },
  });

  return { ratings: query.data ?? [], isLoading: query.isLoading, submitRating };
}
