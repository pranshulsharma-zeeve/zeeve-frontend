import useSWRImmutable from "swr/immutable";
import { getConfig } from "@/config";
import useFetcher from "@/hooks/use-fetcher";

type RestakeInfoResponse = {
  success: boolean;
  data: {
    id: string;
    nodeId: string;
    serviceCloneTaskId: string;
    mnemonic?: string | undefined;
    minimumReward: number;
    interval: number;
    botAddress: string;
    githubPrNumber: number;
    isPrMerged: boolean;
    createdBy: string;
    NextRunTime: Date;
    createdAt?: Date | undefined;
    status?: number | undefined;
    networkId?: string | undefined;
    prHtml?: string | undefined;
    isActive?: boolean | undefined;
    balances: { denom: string; amount: string }[];
  };
};

const useRestakeInfoAPI = (nodeId: string | undefined, networkId: string) => {
  const config = getConfig();
  /** api url */
  const shouldFetch = Boolean(nodeId);
  const url = shouldFetch ? `${config?.url?.external?.coreum?.backend}/restake/${networkId}/nodes/${nodeId}` : null;
  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<RestakeInfoResponse>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { RestakeInfoResponse };
export default useRestakeInfoAPI;
