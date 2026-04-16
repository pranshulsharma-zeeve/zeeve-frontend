/* eslint-disable prettier/prettier */
import useSWRImmutable from "swr/immutable";
import { ArbitrumOrbitServiceError } from "../types";
import { SupportedRollupType, useResolvedRollupType } from "./rollup-type";
import useFetcher from "@orbit/hooks/use-fetcher";
import ROUTES from "@orbit/routes";

type BridgeResponseData = {
  endpoint: string;
};

type BridgeListResponse = {
  success: boolean;
  data: BridgeResponseData;
};

const useBridgeAPI = (networkId: string, type: string, rollupType?: SupportedRollupType) => {
  /** api url */
  // /v1/:networkId/endpoints?type=bridge
  const url = `${ROUTES.ARBITRUM_ORBIT.API.NETWORKS}/${networkId}/endpoints?type=${type}`;
  const resolvedRollupType = useResolvedRollupType(rollupType);

  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<BridgeListResponse, ArbitrumOrbitServiceError>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    rollupType: resolvedRollupType,
    url,
    request,
  };
};

export type { BridgeResponseData };
export default useBridgeAPI;
