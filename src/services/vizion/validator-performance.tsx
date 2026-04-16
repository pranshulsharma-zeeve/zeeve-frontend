import useSWR from "swr";
import useFetcher from "@/hooks/use-fetcher";
import { withApiBasePath } from "@/constants/api";

interface PerformanceDatum {
  height: number;
  signed: number;
  missed: number;
}

interface PerformanceData {
  series: PerformanceDatum[];
  latestHeight?: number;
  valconsAddr?: string;
  windowSize?: number;
  error?: string;
  note?: string;
}

interface ValidatorPerformanceResponse {
  success: boolean;
  data: PerformanceData;
  message: string;
}

const useValidatorPerformanceAPI = (nodeId: string | undefined, period: 1 | 7 | 30) => {
  /** api url */
  // If no nodeId, don't run the fetch
  const shouldFetch = Boolean(nodeId);
  const url = shouldFetch ? withApiBasePath(`/validator/performance?nodeId=${nodeId}&period=${period}`) : null;

  const fetcher = useFetcher();

  /** api request */
  const request = useSWR<ValidatorPerformanceResponse>(url, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return {
    url,
    request,
  };
};

export type { ValidatorPerformanceResponse, PerformanceData, PerformanceDatum };
export default useValidatorPerformanceAPI;
