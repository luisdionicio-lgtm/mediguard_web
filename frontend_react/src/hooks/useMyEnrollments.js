import { useQuery } from '@tanstack/react-query';
import springApi from '../api/springApi';
import { authService } from '../services/authService';

export function useMyEnrollments() {
  const user = authService.getCurrentUser();

  return useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: async () => {
      const { data } = await springApi.get(`enrollments/${user.id}/`);
      return Array.isArray(data) ? data : data.results ?? [];
    },
    enabled: !!user?.id,
  });
}
