import useSWR from "swr";
import useFetcher from "@/hooks/use-fetcher";
import { withApiBasePath } from "@/constants/api";

interface StakeDelegatorDatum {
  date: string;
  value: number;
  epoch?: number;
}

interface StakeDelegatorData {
  tokens: StakeDelegatorDatum[];
  delegatorCount: StakeDelegatorDatum[];
  error?: string;
}

interface ValidatorStakeDelegatorsResponse {
  success: boolean;
  data: StakeDelegatorData;
  message: string;
}

const useValidatorStakeDelegatorsAPI = (nodeId: string | undefined, period: 1 | 7 | 30) => {
  /** api url */
  // If no nodeId, don't run the fetch
  const shouldFetch = Boolean(nodeId);
  const url = shouldFetch
    ? withApiBasePath(`/validator/stake-delegator-chart?nodeId=${nodeId}&period=${period}`)
    : null;

  const fetcher = useFetcher();

  /** api request */
  const request = useSWR<ValidatorStakeDelegatorsResponse>(url, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return {
    url,
    request,
  };
};

export type { ValidatorStakeDelegatorsResponse, StakeDelegatorData, StakeDelegatorDatum };
export default useValidatorStakeDelegatorsAPI;
