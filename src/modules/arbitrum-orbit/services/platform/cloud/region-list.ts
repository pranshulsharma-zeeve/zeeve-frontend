"use client";
import useSWRImmutable from "swr/immutable";
import useFetcher from "@orbit/hooks/use-fetcher";
import ROUTES from "@orbit/routes";
import { getConfig } from "@/config";
import { ArbitrumOrbitServiceError } from "@orbit/services/arbitrum-orbit/types";

type RegionListResponseData = {
  region: string;
  region_name: string;
  id: string;
}[];

type RegionListResponse = {
  success: boolean;
  data: RegionListResponseData;
};

const useRegionListAPI = (cloudId: string | number) => {
  const config = getConfig();

  /** api url */
  const url = `${config?.url?.external?.platformOld?.backend}${ROUTES.PLATFORM.API.CLOUD}/regions/${cloudId}`;

  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<RegionListResponse, ArbitrumOrbitServiceError>(cloudId ? url : null, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { RegionListResponseData };
export default useRegionListAPI;
