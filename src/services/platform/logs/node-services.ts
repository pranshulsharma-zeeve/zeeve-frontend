import useSWRImmutable from "swr/immutable";
import useFetcher from "@/hooks/use-fetcher";
import { withApiBasePath } from "@/constants/api";

type NodeServicesResponse = {
  success: boolean;
  data: {
    services: string[];
  };
};

const useNodeServicesAPI = (params: { networkId: string; agentId: string }) => {
  /** api url */
  const url = withApiBasePath(`/${params.networkId}/services?agentId=${params.agentId}`);
  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<NodeServicesResponse>(url, fetcher, {
    shouldRetryOnError: false,
    revalidateOnReconnect: true,
  });

  return {
    url,
    request,
  };
};

export type { NodeServicesResponse };
export default useNodeServicesAPI;
