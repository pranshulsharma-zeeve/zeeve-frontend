import { AxiosResponse } from "axios";
import { getConfig } from "@/config";
import ROUTES from "@/routes";
import useAxios from "@/hooks/use-axios";
import { ZksyncDashboard } from "@/store/vizion/zksync-dashboard";

type ZksyncDashboardStatusResponse = ZksyncDashboard;
type ZksyncDashboardRequestPayload = {
  hostIds: string[];
  primaryHost: string;
  rpc?: string[];
  bridge?: string[];
  explorer?: string[];
  prover?: string[];
  backup?: string[];
  core?: string[];
};

const useZksyncDashboardAPI = () => {
  const config = getConfig();
  const url = `${config?.url?.external?.vizion?.backend}${ROUTES.VISION.API.ZKSYNC_DASHBOARD}`;

  const { backendAxiosInstance } = useAxios();

  /** api request */
  const request = backendAxiosInstance.post<
    ZksyncDashboardStatusResponse,
    AxiosResponse<ZksyncDashboardStatusResponse>,
    ZksyncDashboardRequestPayload
  >;

  return {
    url,
    request,
  };
};

export type { ZksyncDashboardStatusResponse };
export default useZksyncDashboardAPI;
