import useSWRImmutable from "swr/immutable";
import { AnalyticsServiceError } from "./types";
import ROUTES from "@/routes";
import useFetcher from "@/hooks/use-fetcher";
import { getConfig } from "@/config";

interface ResponsePayload {
  dashboardName: string;
  dashboardRoute: string;
  description?: string;
  dashboardURL: string;
  dashboardRouteWithID: string;
}

const useDashboardUrlsAPI = (nodeId?: string) => {
  const config = getConfig();
  const fetcher = useFetcher();

  // '/analytics/api/dashboard-urls?nodeID=${node}'
  const url = `${config.url?.external?.analytics?.backend}${ROUTES.ANALYTICS.API.DASHBOARD_URLS}?nodeID=${nodeId}`;
  const request = useSWRImmutable<ResponsePayload[], AnalyticsServiceError>(nodeId ? url : null, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export default useDashboardUrlsAPI;
