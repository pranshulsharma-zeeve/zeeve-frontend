import useSWR from "swr";
import useFetcher from "@/hooks/use-fetcher";
import ROUTES from "@/routes";

interface ValidatorNetworkInfo {
  networkId: string;
  networkType?: string | null;
  networkTypeCode?: string | null;
  subscriptionType?: string | null;
  validatorAddress?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validatorInfo?: Record<string, any>;
}

interface ValidatorNetworkInfoResponse {
  success: boolean;
  data: ValidatorNetworkInfo;
  message: string;
}

export const resolveValidatorBase = (): string => {
  return ROUTES.PLATFORM.API.VALIDATOR;
};

const useValidatorNetworkInfoAPI = (networkId?: string) => {
  const fetcher = useFetcher();
  const base = resolveValidatorBase();
  const url = networkId ? `${base}/network/${networkId}/info` : null;

  const request = useSWR<ValidatorNetworkInfoResponse>(url, (key: string) => fetcher(key), {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return {
    url,
    request,
  };
};

export type { ValidatorNetworkInfo, ValidatorNetworkInfoResponse };
export default useValidatorNetworkInfoAPI;
