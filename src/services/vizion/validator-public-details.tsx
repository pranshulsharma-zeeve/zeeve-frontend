import useSWRImmutable from "swr/immutable";
import useFetcher from "@/hooks/use-fetcher";
import { withApiBasePath } from "@/constants/api";
import type { ValidatorOverviewResponse } from "@/services/platform/validator/overview";

type ValidatorPublicDetailsResponse = ValidatorOverviewResponse;
const useValidatorPublicDetailsAPI = (nodeId: string | undefined) => {
  /** api url */
  // If no nodeId  don't run the fetch
  const shouldFetch = Boolean(nodeId);
  const url = shouldFetch ? withApiBasePath(`/subscriptions/summary?nodeId=${nodeId}`) : null;
  // const url = shouldFetch ? `http://localhost:8069/api/v1/subscriptions/summary?nodeId=${nodeId}` : null;
  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<ValidatorPublicDetailsResponse>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { ValidatorPublicDetailsResponse };
export default useValidatorPublicDetailsAPI;
