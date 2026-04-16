import useSWRImmutable from "swr/immutable";
import { getConfig } from "@/config";
import useFetcher from "@/hooks/use-fetcher";

type ValidatorDetailResponse = {
  success: boolean;
  data: {
    "@type": string;
    key: string;
    validatorAddress: string;
    delegationAddress: string;
  };
};

const useValidatorDetailAPI = (nodeId: string | undefined) => {
  const config = getConfig();
  /** api url */
  // If no nodeId, don't run the fetch
  const shouldFetch = Boolean(nodeId);
  const url = shouldFetch ? `${config?.url?.external?.coreum?.backend}/validator/${nodeId}` : null;
  // console.log(url, "url in validator detail api");
  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<ValidatorDetailResponse>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { ValidatorDetailResponse };
export default useValidatorDetailAPI;
