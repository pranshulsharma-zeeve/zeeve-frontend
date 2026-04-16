import useSWR from "swr";
import useFetcher from "@/hooks/use-fetcher";
import ROUTES from "@/routes";

interface ValidatorSummary {
  validator_rank?: number;
  owner_address?: string;
  staking_smart_contract_address?: string;
  tokens?: string;
  ownedStake?: string;
  votingPowerPct: number;
  commissionPct: number;
  outstandingRewards: number;
  ownedRewards?: string;
  delegationRewards?: string;
  commissionRewards?: string;
  delegatorCount?: number;
  totalRewards?: string;
  balance?: string;
  uptimePct: number;
  uptime24Hours: number;
  uptime90Days: number;
  delegationCapacity?: number;
  workerAPR?: number;
  delegatorAPR?: number;
  peerId?: string;
  email?: string;
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
  startDate?: string;
  endDate?: string;
  sequence?: string;
  thetaBalance?: string;
  tfuelBalance?: string;
  // Solana-specific fields
  name?: string;
  iconUrl?: string;
  votePubkey?: string;
  nodePubkey?: string;
  rewardEpoch?: number;
  Epoch?: number;
  commission?: {
    rate: string;
    max_rate: string;
    max_change_rate: string;
  };
}

interface DelegatorItem {
  delegatorAddress?: string;
  amount: string;
  denom: string;
  pctOfValidator: number;
}

interface ValidatorDelegationsData {
  items: DelegatorItem[];
  nextCursor: string | null;
}

interface ValidatorOverviewData {
  summary: ValidatorSummary;
  delegations: ValidatorDelegationsData;
}

interface ValidatorOverviewResponse {
  success: boolean;
  data: ValidatorOverviewData;
  message: string;
}

interface ValidatorOverviewOptions {
  cursor?: string | null;
}

const buildOverviewUrl = (nodeId: string, options?: ValidatorOverviewOptions): string => {
  const baseUrl = ROUTES.PLATFORM.API.SUMMARY;
  const search = new URLSearchParams();
  search.set("nodeId", nodeId);
  if (options?.cursor) {
    search.set("cursor", options.cursor);
  }
  const query = search.toString();
  return query ? `${baseUrl}?${query}` : baseUrl;
};

const useValidatorOverviewAPI = (nodeId?: string, options?: ValidatorOverviewOptions) => {
  const fetcher = useFetcher();
  const url = nodeId ? buildOverviewUrl(nodeId, options) : null;

  const request = useSWR<ValidatorOverviewResponse>(url, (key: string) => fetcher(key), {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return {
    url,
    request,
  };
};

export type {
  DelegatorItem,
  ValidatorDelegationsData,
  ValidatorOverviewData,
  ValidatorOverviewResponse,
  ValidatorOverviewOptions,
  ValidatorSummary,
};
export default useValidatorOverviewAPI;
