import { useQuery } from '@tanstack/react-query';
import springApi from '../api/springApi';

export function useCertificate(enrollmentId) {
  return useQuery({
    queryKey: ['certificate', enrollmentId],
    queryFn: async () => {
      const { data } = await springApi.get(`certificates/${enrollmentId}/`);
      return data;
    },
    enabled: !!enrollmentId,
    retry: false,
  });
}
