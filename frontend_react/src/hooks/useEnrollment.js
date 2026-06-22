import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import springApi from '../api/springApi';
import { authService } from '../services/authService';

export function useEnrollment(courseId) {
  const user = authService.getCurrentUser();
  const queryClient = useQueryClient();

  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: async () => {
      const { data } = await springApi.get(`enrollments/${user.id}/`);
      return Array.isArray(data) ? data : data.results ?? [];
    },
    enabled: !!user?.id,
  });

  const enrollment = enrollments.find((e) => e.course === courseId || e.course_id === courseId);

  const enroll = useMutation({
    mutationFn: async () => {
      const { data } = await springApi.post('enrollments/', { course_id: courseId });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['enrollments', user?.id] }),
  });

  return { enrollment, enroll, isLoading };
}
