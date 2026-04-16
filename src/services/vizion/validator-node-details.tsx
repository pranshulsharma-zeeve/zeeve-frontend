import useSWRImmutable from "swr/immutable";
import { getConfig } from "@/config";
import useFetcher from "@/hooks/use-fetcher";
import { ValidatorNodeType } from "@/types/network";

type ValidatorNodeResponse = {
  success: boolean;
  data: ValidatorNodeType[];
};
const useValidatorNodeDetailAPI = (networkId: string | undefined) => {
  const config = getConfig();
  /** api url */
  // If no networkId  don't run the fetch
  const shouldFetch = Boolean(networkId);
  const url = shouldFetch ? `${config?.url?.external?.coreum?.backend}/networks/${networkId}/nodes` : null;
  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<ValidatorNodeResponse>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { ValidatorNodeResponse };
export default useValidatorNodeDetailAPI;
