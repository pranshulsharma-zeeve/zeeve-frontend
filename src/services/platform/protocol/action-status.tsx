import useSWRImmutable from "swr/immutable";
import { PlatformServiceError } from "../types";
import useFetcher from "@/hooks/use-fetcher";
import ROUTES from "@/routes";
interface ActionStatusResponse {
  success: boolean;
  data: {
    status: boolean;
  };
}

const useActionStatus = (networkId: string | undefined, protocolId: string | undefined, shouldPoll: boolean) => {
  /** API url fetch action status */
  // If no networkId or protocolId, don't run the fetch
  const shouldFetch = Boolean(networkId && protocolId);

  const url = shouldFetch
    ? `${ROUTES.PLATFORM.API.NODE_JOURNEY_NETWORKS}/${networkId}/action-status?action=change-password&protocolId=${protocolId}`
    : null; // <-- SWR won't fetch if URL is null

  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<ActionStatusResponse, PlatformServiceError>(url, fetcher, {
    shouldRetryOnError: false,
    refreshInterval: shouldPoll ? 30_000 : 0, // poll every 30s if needed
  });

  return {
    url,
    request,
  };
};

export default useActionStatus;
