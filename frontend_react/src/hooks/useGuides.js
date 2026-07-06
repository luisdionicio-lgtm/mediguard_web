import { useQuery } from '@tanstack/react-query';
import { guideService } from '../services/guideService';

export function useGuides() {
  return useQuery({
    queryKey: ['guides'],
    queryFn: () => guideService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}
