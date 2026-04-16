import { AxiosResponse } from "axios";
import { getConfig } from "@/config";
import ROUTES from "@/routes";
import useAxios from "@/hooks/use-axios";

interface Item {
  itemid: string;
  name: string;
  flags: string;
  description: string;
  lifetime: string;
  status_codes: string;
  name_resolved: string;
  lastclock: string;
  lastvalue: string;
  fieldName: string;
  fieldType: string;
  url?: string;
}

interface ServiceRpcSslStatusResponse {
  success: boolean;
  data: Record<string, Item[]>;
}

type ServiceRpcSslRequestPayload = {
  hostIds: string[];
  primaryHost: string;
};

const useServiceRpcSslAPI = () => {
  const config = getConfig();
  const url = `${config?.url?.external?.vizion?.backend}${ROUTES.VISION.API.SERVICE_RPC_SSL}`;

  const { backendAxiosInstance } = useAxios();

  /** api request */
  const request = backendAxiosInstance.post<
    ServiceRpcSslStatusResponse,
    AxiosResponse<ServiceRpcSslStatusResponse>,
    ServiceRpcSslRequestPayload
  >;

  return {
    url,
    request,
  };
};

export type { ServiceRpcSslStatusResponse };
export default useServiceRpcSslAPI;
