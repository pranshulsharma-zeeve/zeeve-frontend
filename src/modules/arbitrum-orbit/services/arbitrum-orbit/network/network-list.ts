"use client";
import useSWRImmutable from "swr/immutable";
import { ArbitrumOrbitServiceError } from "../types";
import { SupportedRollupType, useResolvedRollupType } from "./rollup-type";
import useFetcher from "@orbit/hooks/use-fetcher";
import ROUTES from "@orbit/routes";
import { NodeNetworkStates } from "@orbit/types/node";
import { NetworkEnvironment } from "@orbit/types/network";

type NetworkListItem = {
  networkId: string;
  networkName: string;
  networkEnvironment: NetworkEnvironment;
  networkStatus: NodeNetworkStates;
  networkCreatedAt: Date;
  isDemo: boolean;
};

type NetworkListResponseData = {
  pagination: {
    page: number;
    size: number;
    total: number;
  };
  list: NetworkListItem[];
};

type NetworkListResponse = {
  success: boolean;
  data: NetworkListResponseData;
};

const useNetworkListAPI = (params?: { page?: number; size?: number }, rollupType?: SupportedRollupType) => {
  /** api url */
  const resolvedRollupType = useResolvedRollupType(rollupType);
  const query = new URLSearchParams();

  query.set("page", `${params?.page ?? ""}`);
  query.set("size", `${params?.size ?? ""}`);
  query.set("type", resolvedRollupType);

  const url = `${ROUTES.ARBITRUM_ORBIT.API.NETWORKS}?${query.toString()}`;

  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<NetworkListResponse, ArbitrumOrbitServiceError>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    rollupType: resolvedRollupType,
    url,
    request,
  };
};

export type { NetworkListItem, NetworkListResponse, NetworkListResponseData };
export default useNetworkListAPI;
