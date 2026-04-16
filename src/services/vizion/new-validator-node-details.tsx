import useSWRImmutable from "swr/immutable";
import useFetcher from "@/hooks/use-fetcher";
import { withApiBasePath } from "@/constants/api";

type UpdatedValidatorNodeResponse = {
  success: boolean;
  data: {
    validator_address: string | null;
    delegation_address: string;
    protocol: string;
    network_type: string;
    bot_addresses: string;
    bot_wallet_balances: {
      denom: string;
      amount: string;
    };
    restake_status: boolean;
    key: string;
    type: string;
    email: string;
  };
};
const useNewValidatorNodeDetailAPI = (nodeId: string | undefined) => {
  /** api url */
  // If no nodeId  don't run the fetch
  const shouldFetch = Boolean(nodeId);
  const url = shouldFetch ? withApiBasePath(`/node-validator-details?node_id=${nodeId}`) : null;
  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<UpdatedValidatorNodeResponse>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { UpdatedValidatorNodeResponse };
export default useNewValidatorNodeDetailAPI;
