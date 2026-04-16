import useSWRImmutable from "swr/immutable";
import ROUTES from "@/routes";
import useFetcher from "@/hooks/use-fetcher";
import type { ReportRange, ReportResponse, ValidatorNodeReport } from "@/types/reporting";

const useValidatorNodeReport = (nodeId?: string, range?: ReportRange) => {
  const fetcher = useFetcher();
  const normalizedRange = range ?? "weekly";
  const url = nodeId ? `${ROUTES.PLATFORM.API.REPORTS_VALIDATOR_NODE}/${nodeId}?range=${normalizedRange}` : null;

  const request = useSWRImmutable<ReportResponse<ValidatorNodeReport>>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return { url, request };
};

export default useValidatorNodeReport;
