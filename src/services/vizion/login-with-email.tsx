/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { getConfig } from "@/config";
import useAxios from "@/hooks/use-axios";

interface HostData {
  protocolName?: string;
  nodeName: string;
  hostIds: string[];
  indentifierType?: string;
  protocolType?: string;
  networkId?: string;
  primaryHost: string;
  hasLB?: string;
  proxyType?: string;
  "host-name"?: string;
  NodeIdentifier?: string;
  "protocol-type"?: string;
  singleMachine?: boolean;
  RPC?: string[];
  Bridge?: string[];
  Explorer?: string[];
  Prover?: string[];
  Backup?: string[];
  Core?: string[];
}

interface VizionUserDetails {
  success: boolean;
  token: string;
  hostData: HostData[];
  username: string;
}

interface VizionUserResponse {
  success: boolean;
  data: {
    success: boolean;
    token: string;
    hostData: HostData[];
    username: string;
  };
}

interface LoginRequestPayload {
  username: string;
}

/** hook to use vision login API (POST) */
const useVisionUserLoginAPI = () => {
  const config = getConfig();
  const url = `${config?.url?.external?.platformOld?.backend}/api/auth/login-with-email`;

  const { backendAxiosInstance } = useAxios();

  const request = backendAxiosInstance.post<VizionUserResponse, AxiosResponse<VizionUserResponse>, LoginRequestPayload>;

  return {
    url,
    request,
  };
};

export type { VizionUserDetails, HostData, VizionUserResponse, LoginRequestPayload };
export default useVisionUserLoginAPI;
