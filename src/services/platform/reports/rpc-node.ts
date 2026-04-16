import useSWRImmutable from "swr/immutable";
import ROUTES from "@/routes";
import useFetcher from "@/hooks/use-fetcher";
import type { ReportRange, ReportResponse, RpcNodeReport } from "@/types/reporting";

const useRpcNodeReport = (nodeId?: string, range?: ReportRange) => {
  const fetcher = useFetcher();
  const normalizedRange = range ?? "weekly";
  const url = nodeId ? `${ROUTES.PLATFORM.API.REPORTS_RPC_NODE}/${nodeId}?range=${normalizedRange}` : null;

  const request = useSWRImmutable<ReportResponse<RpcNodeReport>>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return { url, request };
};

export default useRpcNodeReport;
