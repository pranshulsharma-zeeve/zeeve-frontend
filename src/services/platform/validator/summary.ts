import useSWR from "swr";
import { resolveValidatorBase } from "./info";
import useFetcher from "@/hooks/use-fetcher";

interface ValidatorSummary {
  tokens?: string;
  votingPowerPct: number;
  commissionPct: number;
  outstandingRewards: number;
  ownedRewards?: string;
  delegationRewards?: string;
  commissionRewards?: string;
  totalRewards?: string;
  uptimePct: number;
  status: "active" | "inactive";
  statusLabel?: string;
  jailed?: boolean;
  connectionStatus?: "connected" | "disconnected" | "unknown";
  identity?: string;
  networkType?: string;
  moniker?: string;
  website?: string;
  description?: string;
  min_self_delegation?: string;
  commission?: {
    rate: string;
    max_rate: string;
    max_change_rate: string;
  };
}

interface ValidatorSummaryResponse {
  success: boolean;
  data: ValidatorSummary;
  message: string;
}

interface ValidatorSummaryOptions {
  protocolId?: string;
  protocolName?: string;
}

const buildSummaryUrl = (baseUrl: string, valoper: string, options?: ValidatorSummaryOptions): string => {
  const search = new URLSearchParams();
  if (options?.protocolId) {
    search.set("protocolId", options.protocolId);
  }
  if (options?.protocolName) {
    search.set("protocolName", options.protocolName);
  }
  const query = search.toString();
  return `${baseUrl}/${encodeURIComponent(valoper)}/summary${query ? `?${query}` : ""}`;
};

const useValidatorSummaryAPI = (valoper?: string, options?: ValidatorSummaryOptions) => {
  const fetcher = useFetcher();
  const baseUrl = resolveValidatorBase();
  const url = valoper ? buildSummaryUrl(baseUrl, valoper, options) : null;

  const request = useSWR<ValidatorSummaryResponse>(url, (key: string) => fetcher(key), {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return {
    url,
    request,
  };
};

export type { ValidatorSummary, ValidatorSummaryResponse };
export type { ValidatorSummaryOptions };
export default useValidatorSummaryAPI;
