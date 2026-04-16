import { AxiosResponse } from "axios";
import ROUTES from "@/routes";
import { NetworkType, NodeType } from "@/types/protocol";
import useAxios from "@/hooks/use-axios";

interface ProtocolSubscriptionRequestPayload {
  cloud: string;
  nodeType: NodeType;
  networkType: NetworkType;
  regionId: string;
  regionName: string;
  count: number;
  continent: string;
}

interface ResponsePayload {
  message: string;
  redirectionUrl: string;
}

/** hook to use create payment url api */
const useSubscribeProtocolAPI = (protocolId: string) => {
  const { backendAxiosInstance } = useAxios();
  /** api url */
  const url = `${ROUTES.PLATFORM.API.PROTOCOLS}/${protocolId}/subscribe`;
  /** api request */
  const request = backendAxiosInstance.post<
    ResponsePayload,
    AxiosResponse<ResponsePayload>,
    ProtocolSubscriptionRequestPayload
  >;

  return {
    url,
    request,
  };
};

export default useSubscribeProtocolAPI;
export type { ProtocolSubscriptionRequestPayload };
