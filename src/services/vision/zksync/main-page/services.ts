import { AxiosResponse } from "axios";
import { getConfig } from "@/config";
import ROUTES from "@/routes";
import useAxios from "@/hooks/use-axios";

type ContainerItem = {
  itemid: string;
  name: string;
  key_: string;
  lastclock: string;
  lastvalue: string;
  tags: { tag: string; value: string }[];
  fieldType: string;
};

type ServiceStatusResponse = {
  success: boolean;
  data: Record<string, ContainerItem[]>;
};

type ServiceRequestPayload = {
  hostIds: string[];
  primaryHost: string;
};

const useServiceAPI = () => {
  const config = getConfig();
  const url = `${config?.url?.external?.vizion?.backend}${ROUTES.VISION.API.SERVICE}`;

  const { backendAxiosInstance } = useAxios();

  /** api request */
  const request = backendAxiosInstance.post<
    ServiceStatusResponse,
    AxiosResponse<ServiceStatusResponse>,
    ServiceRequestPayload
  >;

  return {
    url,
    request,
  };
};

export type { ServiceStatusResponse };
export default useServiceAPI;
