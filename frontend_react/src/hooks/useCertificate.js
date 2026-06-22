import { useQuery } from '@tanstack/react-query';
import springApi from '../api/springApi';

export function useCertificate(enrollmentId) {
  const query = useQuery({
    queryKey: ['certificate', enrollmentId],
    queryFn: async () => {
      const { data } = await springApi.get(`certificates/${enrollmentId}/`);
      return data;
    },
    enabled: !!enrollmentId,
    retry: false,
  });

  return {
    ...query,
    data: query.data?.available ? query.data.certificate : null,
    isUnavailable: query.data?.available === false,
    statusMessage: query.data?.message || '',
  };
}
