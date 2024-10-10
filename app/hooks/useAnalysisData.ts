import { useQuery } from '@tanstack/react-query';
import { fetchAnalysisData } from '@/lib/api';
import { AnalysisData } from '@/types';

// Custom hook to fetch analysis data
export const useAnalysisData = (analysisType: string) => {
  return useQuery<AnalysisData[], Error>({
    queryKey: [analysisType],
    queryFn: () => fetchAnalysisData(analysisType),
  });
};