"use client";
import useSWRImmutable from "swr/immutable";
import { ArbitrumOrbitServiceError } from "../types";
import { SupportedRollupType, useResolvedRollupType } from "./rollup-type";
import useFetcher from "@orbit/hooks/use-fetcher";
import ROUTES from "@orbit/routes";

type BlockNumberResponsePayload = {
  success: boolean;
  data: {
    blockHeight?: string;
  };
};

const useBlockNumber = (id?: string, rollupType?: SupportedRollupType) => {
  /** api url */
  const url = `${ROUTES.ARBITRUM_ORBIT.API.NETWORKS}/${id}/block-height`;
  const resolvedRollupType = useResolvedRollupType(rollupType);

  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<BlockNumberResponsePayload, ArbitrumOrbitServiceError>(id ? url : null, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    rollupType: resolvedRollupType,
    url,
    request,
  };
};

export default useBlockNumber;
