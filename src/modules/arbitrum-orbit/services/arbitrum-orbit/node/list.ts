"use client";
import useSWRImmutable from "swr/immutable";
import { ArbitrumOrbitServiceError } from "../types";
import useFetcher from "@orbit/hooks/use-fetcher";
import ROUTES from "@orbit/routes";
import { NodeNetworkStates, NodeType } from "@orbit/types/node";

type NodeListResponseData = {
  pagination: { page: number; size: number; total: number };
  list: {
    nodeId: string;
    nodeName: string;
    nodeType: NodeType;
    nodeRegion: string;
    nodeStatus: NodeNetworkStates | undefined;
    nodeCreatedAt: Date;
  }[];
};

type NodeListResponse = {
  success: boolean;
  data: NodeListResponseData;
};

const buildURL = (networkId: string, params?: { page?: number; size?: number }) => {
  /** api url */
  let url = `${ROUTES.ARBITRUM_ORBIT.API.NETWORKS}/${networkId}/nodes`;

  /** Collect query parameters only if they have values */
  const queryParams: string[] = [];
  if (params?.page) queryParams.push(`page=${params.page}`);
  if (params?.size) queryParams.push(`size=${params.size}`);

  /** Append query parameters if any exist */
  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`;
  }

  return url;
};

const useNodeListAPI = (networkId: string, params?: { page?: number; size?: number }) => {
  /** api url */
  const url = buildURL(networkId, { page: params?.page, size: params?.size });

  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<NodeListResponse, ArbitrumOrbitServiceError>(url.toString(), fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { NodeListResponseData, NodeListResponse };
export default useNodeListAPI;
