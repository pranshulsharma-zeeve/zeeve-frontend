import useSWRImmutable from "swr/immutable";
import { getConfig } from "@/config";
import useFetcher from "@/hooks/use-fetcher";

type ValidatorDelegationResponse = {
  success: boolean;
  data: {
    delegation_responses: {
      delegation: {
        delegator_address: string;
        validator_address: string;
        shares: string;
      };
      balance: {
        denom: string;
        amount: string;
      };
    }[];
    pagination: {
      next_key: string | null;
      total: string;
    };
  };
};

const useValidatorDelegationAPI = (nodeId: string, networkId: string, validatorAddr: string, page: string) => {
  const config = getConfig();
  /** api url */
  const url = `${config?.url?.external?.coreum?.backend}/validator/network/${networkId}/node/${nodeId}/${validatorAddr}/delegations?pageNumber=${page}`;
  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<ValidatorDelegationResponse>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { ValidatorDelegationResponse };
export default useValidatorDelegationAPI;
