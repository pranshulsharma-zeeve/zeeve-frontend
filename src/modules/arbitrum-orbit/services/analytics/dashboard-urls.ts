"use client";
import useSWRImmutable from "swr/immutable";
import { ArbitrumOrbitServiceError } from "../arbitrum-orbit/types";
import ROUTES from "@orbit/routes";
import useFetcher from "@orbit/hooks/use-fetcher";
import { getConfig } from "@/config";

type DashboardUrlsResponse = {
  dashboardName: string;
  dashboardURL: string;
}[];

const useDashboardUrlsAPI = (nodeId?: string) => {
  const config = getConfig();
  /** api url */
  // '/analytics/api/dashboard-urls?nodeID=${node}'
  const url = `${config?.url?.external?.analytics?.backend}${ROUTES.ANALYTICS.API.DASHBOARD_URLS}?nodeID=${nodeId}`;

  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<DashboardUrlsResponse, ArbitrumOrbitServiceError>(nodeId ? url : undefined, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export default useDashboardUrlsAPI;
