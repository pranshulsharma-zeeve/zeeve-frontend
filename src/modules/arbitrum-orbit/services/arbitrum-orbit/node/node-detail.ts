"use client";
import useSWRImmutable from "swr/immutable";
import { ArbitrumOrbitServiceError } from "../types";
import useFetcher from "@orbit/hooks/use-fetcher";
import ROUTES from "@orbit/routes";
import { NodeDetail } from "@orbit/types/node";

type NodeDetailResponse = {
  success: boolean;
  data: NodeDetail;
};

const useNodeDetailAPI = (networkId: string, nodeId: string) => {
  /** api url */
  const url = `${ROUTES.ARBITRUM_ORBIT.API.NETWORKS}/${networkId}/nodes/${nodeId}`;

  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<NodeDetailResponse, ArbitrumOrbitServiceError>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { NodeDetailResponse };
export default useNodeDetailAPI;
