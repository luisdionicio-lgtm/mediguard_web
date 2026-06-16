import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import springApi from '../api/springApi';

export function useProgress(enrollmentId) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['progress', enrollmentId],
    queryFn: async () => {
      const { data } = await springApi.get(`progress/${enrollmentId}/`);
      return Array.isArray(data) ? data : data.results ?? [];
    },
    enabled: !!enrollmentId,
  });

  const complete = useMutation({
    mutationFn: async ({ lessonId, score = 100 }) => {
      const { data } = await springApi.put(`progress/${lessonId}/complete`, {
        score,
        enrollment_id: enrollmentId,
      });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['progress', enrollmentId] }),
  });

  const progressList = query.data ?? [];
  const completedIds = new Set(progressList.filter((p) => p.completed).map((p) => p.lesson_id));

  return { progressList, completedIds, isLoading: query.isLoading, complete };
}
