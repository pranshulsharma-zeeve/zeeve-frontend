"use client";
import { AxiosResponse } from "axios";
import { SupportedRollupType, useResolvedRollupType } from "./rollup-type";
import ROUTES from "@orbit/routes";
import { backendAxiosInstance } from "@orbit/utils/axios";

interface ResponsePayload {
  success: boolean;
  data: {
    message: string;
    redirectionUrl: string;
  };
}

const useDeleteNetwork = (id: string | number, rollupType?: SupportedRollupType) => {
  // const config = getConfig();
  const resolvedRollupType = useResolvedRollupType(rollupType);

  const url = `${ROUTES.ARBITRUM_ORBIT.API.NETWORKS}/${id}/delete`;

  // const { backendAxiosInstance } = useAxios();

  const request = backendAxiosInstance.get<ResponsePayload, AxiosResponse<ResponsePayload>>;

  return {
    rollupType: resolvedRollupType,
    url,
    request,
  };
};

export default useDeleteNetwork;
