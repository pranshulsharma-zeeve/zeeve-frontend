import useSWRImmutable from "swr/immutable";
import ROUTES from "@/routes";
import useFetcher from "@/hooks/use-fetcher";
import type { ReportRange, ReportResponse, RpcFleetReport } from "@/types/reporting";

const useRpcFleetReport = (range: ReportRange) => {
  const fetcher = useFetcher();
  const normalizedRange = range ?? "weekly";
  const url = `${ROUTES.PLATFORM.API.REPORTS_RPC_FLEET}?range=${normalizedRange}`;

  const request = useSWRImmutable<ReportResponse<RpcFleetReport>>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return { url, request };
};

export default useRpcFleetReport;
