import { AxiosResponse } from "axios";
import { getConfig } from "@/config";
import ROUTES from "@/routes";
import useAxios from "@/hooks/use-axios";
import { ArbitrumDashboard } from "@/store/vizion/arbitrum-dashboard";

type ArbitrumDashboardStatusResponse = ArbitrumDashboard;
type ArbitrumDashboardRequestPayload = {
  hostIds: string[];
  primaryHost: string;
};

const useArbitrumDashboardAPI = () => {
  const config = getConfig();
  const url = `${config?.url?.external?.vizion?.backend}${ROUTES.VISION.API.ARBITRUM_DASHBOARD}`;

  const { backendAxiosInstance } = useAxios();

  /** api request */
  const request = backendAxiosInstance.post<
    ArbitrumDashboardStatusResponse,
    AxiosResponse<ArbitrumDashboardStatusResponse>,
    ArbitrumDashboardRequestPayload
  >;

  return {
    url,
    request,
  };
};

export type { ArbitrumDashboardStatusResponse };
export default useArbitrumDashboardAPI;
