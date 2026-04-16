import { AxiosResponse } from "axios";
import { getConfig } from "@/config";
import ROUTES from "@/routes";
import useAxios from "@/hooks/use-axios";
import { Monitor } from "@/store/vizion/monitorRpc";

type SecurityMonitorStatusResponse = Monitor;
type SecurityMonitorRequestPayload = {
  hostIds: string[];
  primaryHost: string;
};

const useSecurityMonitorRpcAPI = () => {
  const config = getConfig();
  const url = `${config?.url?.external?.vizion?.backend}${ROUTES.VISION.API.SECURITY_MONITOR_RPC}`;

  const { backendAxiosInstance } = useAxios();

  /** api request */
  const request = backendAxiosInstance.post<
    SecurityMonitorStatusResponse,
    AxiosResponse<SecurityMonitorStatusResponse>,
    SecurityMonitorRequestPayload
  >;

  return {
    url,
    request,
  };
};

export type { SecurityMonitorStatusResponse };
export default useSecurityMonitorRpcAPI;
