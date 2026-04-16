"use client";
import useSWRImmutable from "swr/immutable";
import { ArbitrumOrbitServiceError } from "../types";
import { SupportedRollupType, useResolvedRollupType } from "./rollup-type";
import useFetcher from "@orbit/hooks/use-fetcher";
import { withApiBasePath } from "@/constants/api";
import { OVERVIEW_INFO } from "@orbit/types/overview";

type NetworkOverviewResponsePayload = {
  success: boolean;
  data: OVERVIEW_INFO;
};

const useNetworkOverview = (id: string | number | undefined, rollupType?: SupportedRollupType) => {
  /** api url */
  const resolvedRollupType = useResolvedRollupType(rollupType);
  const params = new URLSearchParams();
  params.set("type", resolvedRollupType);
  if (id !== undefined && id !== null && `${id}`.length > 0) {
    params.set("service_id", `${id}`);
  }

  const url = id ? withApiBasePath(`/rollup_node/overview?${params.toString()}`) : null;

  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<NetworkOverviewResponsePayload, ArbitrumOrbitServiceError>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    rollupType: resolvedRollupType,
    url,
    request,
  };
};

export type { NetworkOverviewResponsePayload };
export default useNetworkOverview;
