import { AxiosResponse } from "axios";
import useAxios from "@/hooks/use-axios";
import { withApiBasePath } from "@/constants/api";

interface StakeValidatorRequestPayload {
  nodeId: string;
  validatorInfo: {
    validatorName: string;
    description?: string;
    delegationAmount: number;
    minDelegationAmount: number;
    commissionRate: number;
    maxCommissionRate: number;
    maxCommissionChangeRate: number;
    website?: string;
    enableStateSync: boolean;
    validatorAddress: string;
    delegationAddress: string;
  };
}

interface ResponsePayload {
  success: boolean;
}

/** hook to use stake validator api */
const useStakeValidatorAPI = () => {
  const { backendAxiosInstance } = useAxios();
  /** api url */
  const url = withApiBasePath("/update/validator-info");
  /** api request */
  const request = backendAxiosInstance.post<
    ResponsePayload,
    AxiosResponse<ResponsePayload>,
    StakeValidatorRequestPayload
  >;

  return {
    url,
    request,
  };
};

export default useStakeValidatorAPI;
export type { StakeValidatorRequestPayload };
