import { AxiosResponse } from "axios";
import { getConfig } from "@/config";
import useAxios from "@/hooks/use-axios";

type EventData = {
  eventid: string;
  name: string;
  severity: string;
  acknowledged: string;
  clock: string;
  status: string;
  opdata: string;
};

type AlertsResponse = {
  success: boolean;
  data: EventData[];
};

type AlertsRequestPayload = {
  hostIds: string[];
  primaryHost: string;
};

const useAlertsAPI = () => {
  const config = getConfig();
  const url = `${config?.url?.external?.vizion?.backend}/api/item/get-trigger-data`;
  // const url = "http://localhost:5000/api/item/get-trigger-data";

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
