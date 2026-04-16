import { AxiosResponse } from "axios";
import { getConfig } from "@/config";
import ROUTES from "@/routes";
import useAxios from "@/hooks/use-axios";
import { Dashboard } from "@/store/vizion/dashboard";

type DashboardStatusResponse = Dashboard;
type DashboardRequestPayload = {
  hostIds: string[];
  primaryHost: string;
};

const useDashboardAPI = () => {
  const config = getConfig();
  const url = `${config?.url?.external?.vizion?.backend}${ROUTES.VISION.API.DASHBOARD}`;

  const { backendAxiosInstance } = useAxios();

  /** api request */
  const request = backendAxiosInstance.post<
    DashboardStatusResponse,
    AxiosResponse<DashboardStatusResponse>,
    DashboardRequestPayload
  >;

  return {
    url,
    request,
  };
};

export type { DashboardStatusResponse };
export default useDashboardAPI;
