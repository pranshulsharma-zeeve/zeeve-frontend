import { AxiosResponse } from "axios";
import { getConfig } from "@/config";
import useAxios from "@/hooks/use-axios";

export type HistoricalAlert = {
  eventid: string;
  name: string;
  severity: string;
  acknowledged: string;
  clock: string;
  status: string;
  opdata?: string;
  tags?: Array<Record<string, string>>;
};

export type HistoricalAlertsResponse = {
  success: boolean;
  data: HistoricalAlert[] | Record<string, HistoricalAlert[]>;
  summary?: Record<string, unknown>;
  range?: string;
  timeFrom?: number;
  timeTill?: number;
};

export type HistoricalAlertsRequestPayload = {
  hostIds: string[];
  range?: string;
  currentTime?: string
};

const useHistoricalAlertsAPI = () => {
  const config = getConfig();
  const url = `${config?.url?.external?.vizion?.backend}/api/history/historical-alerts`;
  const { backendAxiosInstance } = useAxios();

  const request = backendAxiosInstance.post<
    HistoricalAlertsResponse,
    AxiosResponse<HistoricalAlertsResponse>,
    HistoricalAlertsRequestPayload
  >;

  return {
    url,
    request,
  };
};

export default useHistoricalAlertsAPI;
