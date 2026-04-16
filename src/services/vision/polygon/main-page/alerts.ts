import { AxiosResponse } from "axios";
import { getConfig } from "@/config";
import ROUTES from "@/routes";
import useAxios from "@/hooks/use-axios";

interface AlertsResponse {
  success: boolean;
  data: {
    data: Alert[];
  };
}

interface Alert {
  eventid: string;
  name: string;
  severity: string;
  acknowledged: string;
  clock: string;
  opdata?: string;
  status: string;
}

type AlertsRequestPayload = {
  hostIds: string[];
  primaryHost: string;
};

const useAlertsAPI = () => {
  const config = getConfig();
  const url = `${config?.url?.external?.vizion?.backend}${ROUTES.VISION.API.ALERTS}`;

  const { backendAxiosInstance } = useAxios();

  /** api request */
  const request = backendAxiosInstance.post<AlertsResponse, AxiosResponse<AlertsResponse>, AlertsRequestPayload>;

  return {
    url,
    request,
  };
};

export type { AlertsResponse };
export default useAlertsAPI;
