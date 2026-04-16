import { AxiosResponse } from "axios";
import { getConfig } from "@/config";
import useAxios from "@/hooks/use-axios";

type StringNumber = string | number;
type StakingValidatorRequestResponse = {
  data: {
    systemResource: {
      cpuUsage: StringNumber;
      memoryUtlisation: StringNumber;
      diskUsage: StringNumber;
      networkBandwidth: {
        in: StringNumber;
        out: StringNumber;
      };
    };
    nodeInfo: {
      name: StringNumber;
      votingPower: StringNumber;
      votingPowerPercentage: StringNumber;
      rank: StringNumber;
      commissionRate: StringNumber;
      bondStatus: StringNumber;
      jailedStatus: StringNumber;
    };
    stakingDetails: {
      balance: StringNumber;
      totalStaked: StringNumber;
      commission: StringNumber;
      selfDelegation: StringNumber;
      totalDelegators: StringNumber;
      rewards: StringNumber;
      stakingReward: StringNumber;
      votingPower: StringNumber;
    };
  };
};
type StakingValidatorrRequestPayload = {
  primaryHost: string;
};

const useValidatorStakingDetails = () => {
  const config = getConfig();
  const url = `${config?.url?.external?.vizion?.backend}/api/item/get-validator-staking-details`;

  const { backendAxiosInstance } = useAxios();

  /** api request */
  const request = backendAxiosInstance.post<
    StakingValidatorRequestResponse,
    AxiosResponse<StakingValidatorRequestResponse>,
    StakingValidatorrRequestPayload
  >;

  return {
    url,
    request,
  };
};

export type { StakingValidatorRequestResponse };
export default useValidatorStakingDetails;
