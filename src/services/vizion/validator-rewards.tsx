import useSWR from "swr";
import useFetcher from "@/hooks/use-fetcher";
import { withApiBasePath } from "@/constants/api";

interface RewardsDatum {
  date: string;
  value: number;
  epoch?: number;
}

interface RewardsData {
  series: RewardsDatum[];
  tokens: RewardsDatum[];
  delegatorCount: RewardsDatum[];
  error?: string;
  note?: string;
}

interface ValidatorRewardsResponse {
  success: boolean;
  data: RewardsData;
  message: string;
}

const useValidatorRewardsAPI = (nodeId: string | undefined, period: 1 | 7 | 30) => {
  /** api url */
  // If no nodeId, don't run the fetch
  const shouldFetch = Boolean(nodeId);
  const url = shouldFetch ? withApiBasePath(`/validator/rewards?nodeId=${nodeId}&period=${period}`) : null;

  const fetcher = useFetcher();

  /** api request */
  const request = useSWR<ValidatorRewardsResponse>(url, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return {
    url,
    request,
  };
};

export type { ValidatorRewardsResponse, RewardsData, RewardsDatum };
export default useValidatorRewardsAPI;
