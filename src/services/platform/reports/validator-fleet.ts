import useSWRImmutable from "swr/immutable";
import ROUTES from "@/routes";
import useFetcher from "@/hooks/use-fetcher";
import type { ReportRange, ReportResponse, ValidatorFleetReport } from "@/types/reporting";

const useValidatorFleetReport = (range: ReportRange) => {
  const fetcher = useFetcher();
  const normalizedRange = range ?? "weekly";
  const url = `${ROUTES.PLATFORM.API.REPORTS_VALIDATOR_FLEET}?range=${normalizedRange}`;

  const request = useSWRImmutable<ReportResponse<ValidatorFleetReport>>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return { url, request };
};

export default useValidatorFleetReport;
