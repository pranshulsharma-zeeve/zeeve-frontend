import useSWR from "swr";
import useFetcher from "@/hooks/use-fetcher";
import { withApiBasePath } from "@/constants/api";

interface ValidatorDashboardDelegator {
  delegatorAddress: string;
  amount: string;
  denom: string;
  pctOfValidator?: number;
  activationEpoch?: string | number | null;
}

interface ValidatorDashboardDelegationsData {
  delegators: ValidatorDashboardDelegator[];
  totalDelegators: number;
  page: number;
  limit: number;
}

interface ValidatorDashboardDelegationsResponse {
  success: boolean;
  data: ValidatorDashboardDelegationsData;
  message?: string;
}

const useValidatorDashboardDelegationsAPI = (nodeId: string | undefined, page: number, limit: number) => {
  const shouldFetch = Boolean(nodeId);
  const url = shouldFetch
    ? withApiBasePath(`/validator/delegation?nodeId=${nodeId}&page=${page}&limit=${limit}`)
    : null;

  const fetcher = useFetcher();

  const request = useSWR<ValidatorDashboardDelegationsResponse>(url, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return {
    url,
    request,
  };
};

export type {
  ValidatorDashboardDelegationsResponse,
  ValidatorDashboardDelegationsData,
  ValidatorDashboardDelegator,
};
export default useValidatorDashboardDelegationsAPI;