import { AxiosResponse } from "axios";
import { getConfig } from "@/config";
import ROUTES from "@/routes";
import useAxios from "@/hooks/use-axios";

interface FinancialTrendPoint {
  timestamp: string;
  clock: string;
  value_avg: string;
}

type FinancialTrendResponse = {
  success: boolean;
  data: Record<string, FinancialTrendPoint[]>;
};

type FinancialRequestPayload = {
  numOfDays: number;
  primaryHost: string;
  currentTime: Date;
  proxyType: string;
};

const useFinancialAPI = () => {
  const config = getConfig();
  const url = `${config?.url?.external?.vizion?.backend}${ROUTES.VISION.API.FINANCIAL}`;

  const { backendAxiosInstance } = useAxios();

  /** api request */
  const request = backendAxiosInstance.post<
    FinancialTrendResponse,
    AxiosResponse<FinancialTrendResponse>,
    FinancialRequestPayload
  >;

  return {
    url,
    request,
  };
};

export type { FinancialTrendResponse };
export default useFinancialAPI;
