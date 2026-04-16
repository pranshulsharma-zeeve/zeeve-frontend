import { AxiosResponse } from "axios";
import { getConfig } from "@/config";
import ROUTES from "@/routes";
import useAxios from "@/hooks/use-axios";
import { OpStackDashboard } from "@/store/vizion/opstack-dashboard";

type OpStackDashboardStatusResponse = OpStackDashboard;
type OpStackDashboardRequestPayload = {
  hostIds: string[];
  primaryHost: string;
};

const useOpStackDashboardAPI = () => {
  const config = getConfig();
  const url = `${config?.url?.external?.vizion?.backend}${ROUTES.VISION.API.OPSTACK_DASHBOARD}`;

  const { backendAxiosInstance } = useAxios();

  /** api request */
  const request = backendAxiosInstance.post<
    OpStackDashboardStatusResponse,
    AxiosResponse<OpStackDashboardStatusResponse>,
    OpStackDashboardRequestPayload
  >;

  return {
    url,
    request,
  };
};

export type { OpStackDashboardStatusResponse };
export default useOpStackDashboardAPI;
