import { AxiosResponse } from "axios";
import { getConfig } from "@/config";
import useAxios from "@/hooks/use-axios";

type SecurityMonitorStatusResponse = {
  data: {
    loadBalancer: {
      sslExpiryDate: string;
      status: string;
    };
    wssEndpoint: string;
    httpEndpoint: string;
    nodes: [
      {
        name: string;
        sslExpiryDate: string;
      },
    ];
    secureAccess: true;
    malwareProtection: true;
    ddosProtection: true;
    intrusionDetection: true;
    firewall: string;
    ddosLogsAnalysed: string;
    softwareUpdates: string;
    unauthorisedAccessAnalysed: string;
    securityPackageUpdate: string;
    malwareScan: string;
    backup: string;
    endpointPenTest: string;
  };
};
type SecurityMonitorRequestPayload = {
  hostIds: string[];
  primaryHost: string;
};

const useSecurityMonitorValidatorAPI = () => {
  const config = getConfig();
  const url = `${config?.url?.external?.vizion?.backend}/api/item/get-security-monitor-data`;

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
export default useSecurityMonitorValidatorAPI;
