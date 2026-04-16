import { AxiosResponse } from "axios";
import ROUTES from "@/routes";
import useAxios from "@/hooks/use-axios";
import { AuthenticationType } from "@/types/credentials";
import { NodeType } from "@/types/node";

type NodeGeneralDetails = {
  name: string;
  description?: string;
  workspaceId?: string;
  networkType: string;
  nodeType: NodeType;
};

type NodeRPCDetails = {
  authType: AuthenticationType;
  username: string;
  password: string;
  enable: {
    http?: boolean;
    ws?: boolean;
  };
};

type NodeCloudDetails = {
  cloudId: string;
  regionId: string;
  regionName: string;
  credId: string;
  continentName: string;
};

type NodeRequestAddOns = {
  infraType: string;
  nodeType: string;
  networkType: string;
  continentType: string;
};

interface NodeDeploymentRequestPayload {
  general: NodeGeneralDetails;
  rpc: NodeRPCDetails;
  cloud: NodeCloudDetails;
  requestAddOns: NodeRequestAddOns;
}
interface ResponsePayload {
  success: boolean;
  message: string;
}

/** hook to use create payment url api */
const useNodeDeploymentAPI = (protocolId: string) => {
  const { backendAxiosInstance } = useAxios();
  /** api url */
  const url = `${ROUTES.PLATFORM.API.PROTOCOLS}/${protocolId}/deploy`;
  /** api request */
  const request = backendAxiosInstance.post<
    ResponsePayload,
    AxiosResponse<ResponsePayload>,
    NodeDeploymentRequestPayload
  >;

  return {
    url,
    request,
  };
};

export default useNodeDeploymentAPI;
export type { NodeDeploymentRequestPayload };
