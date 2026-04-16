/* eslint-disable react-hooks/rules-of-hooks */
import useSWRImmutable from "swr/immutable";
import useFetcher from "@/hooks/use-fetcher";
import ROUTES from "@/routes";

type RpcNearMetricsDetailsResponse = {
  uptime: string;
  validatingStatus: string;
  blockHeight: number;
  peer: number;
};

const useRpcNearMetricsAPI = (agentId: string, protocolId: string) => {
  /** API URL */
  const url = agentId && protocolId ? `${ROUTES.PLATFORM.API.NETWORKS}${agentId}/${protocolId}` : null;

  const fetcher = useFetcher();

  /** API Request */
  const request = useSWRImmutable<RpcNearMetricsDetailsResponse>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { RpcNearMetricsDetailsResponse };
export default useRpcNearMetricsAPI;
