// /staking-validator-trend primaryHost: hostId, token, numOfDays, currentTime
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { getConfig } from "@/config";
import useAxios from "@/hooks/use-axios";

type StackedGraphResponse = {
  success: boolean;
  data: {
    "Coreum Validator Signing Info (Missed Blocks)": GraphItem[];
  };
};

type GraphItem = {
  itemid: string;
  clock: string;
  value_avg: string;
  timestamp: string;
};

type StackedGraphRequestPayload = {
  primaryHost: string;
  token: string;
  numOfDays: string;
  currentTime: string;
};

const useStakingValidatorTrends = () => {
  const config = getConfig();
  const url = `${config?.url?.external?.vizion?.backend}/api/history/staking-validator-trend`;

  const { backendAxiosInstance } = useAxios();

  /** api request */
  const request = backendAxiosInstance.post<
    StackedGraphResponse,
    AxiosResponse<StackedGraphResponse>,
    StackedGraphRequestPayload
  >;

  return {
    url,
    request,
  };
};

export type { StackedGraphResponse };
export default useStakingValidatorTrends;
