import useSWRImmutable from "swr/immutable";
import { getConfig } from "@/config";
import useFetcher from "@/hooks/use-fetcher";

type ValidatorTransactionResponse = {
  success: boolean;
  data: {
    id: string;
    task_id: string | null;
    node_id: string;
    action: string;
    details: {
      txhash: string;
    };
    created_at: string;
  }[];
};

const useValidatorTransactionAPI = (nodeId: string | undefined) => {
  const config = getConfig();
  /** api url */
  // If no nodeId  don't run the fetch
  const shouldFetch = Boolean(nodeId);
  const url = shouldFetch ? `${config?.url?.external?.coreum?.backend}/validator/transaction/${nodeId}` : null;
  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<ValidatorTransactionResponse>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { ValidatorTransactionResponse };
export default useValidatorTransactionAPI;
