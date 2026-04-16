import { AxiosResponse } from "axios";
import ROUTES from "@/routes";
import useAxios from "@/hooks/use-axios";
import { getConfig } from "@/config";

type LoginRequestPayload = {
  username: string;
  password: string;
};

type LoginResponsePayload = {
  success: boolean;
  username: string;
  token: string;
  hostData: [
    {
      protocolName: string;
      nodeName: string;
      hostIds: string[];
      networkId?: string;
      primaryHost: string;
      hasLB: string;
      proxyType: string;
      "protocol-type": string;
      "protocol-id": string;
    },
  ];
  message?: string;
};

const useLoginAPI = () => {
  const config = getConfig();

  const url = `${config?.url?.external?.vizion?.backend}${ROUTES.VISION.API.LOGIN}`;

  const { backendAxiosInstance } = useAxios();

  const request = backendAxiosInstance.post<
    LoginResponsePayload,
    AxiosResponse<LoginResponsePayload>,
    LoginRequestPayload
  >;

  return {
    url,
    request,
  };
};

export type { LoginRequestPayload, LoginResponsePayload };
export default useLoginAPI;
