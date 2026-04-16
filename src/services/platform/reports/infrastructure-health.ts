import useSWRImmutable from "swr/immutable";
import ROUTES from "@/routes";
import useFetcher from "@/hooks/use-fetcher";
import type { InfrastructureHealthReport, ReportRange, ReportResponse } from "@/types/reporting";

const useInfrastructureHealthReport = (range: ReportRange) => {
  const fetcher = useFetcher();
  const normalizedRange = range ?? "weekly";
  const url = `${ROUTES.PLATFORM.API.REPORTS_INFRA_HEALTH}?range=${normalizedRange}`;

  const request = useSWRImmutable<ReportResponse<InfrastructureHealthReport>>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return { url, request };
};

export default useInfrastructureHealthReport;
