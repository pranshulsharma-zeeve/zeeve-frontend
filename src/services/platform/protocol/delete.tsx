import { AxiosResponse } from "axios";
import ROUTES from "@/routes";
import useAxios from "@/hooks/use-axios";

type DeleteProtocolResponse = {
  success: boolean;
  data: {
    redirectionUrl: string;
    message: string;
  };
};

const useDeleteProtocolAPI = (protocolId: string) => {
  const { backendAxiosInstance } = useAxios();
  /** API url for deleting the Protocol */
  const url = `${ROUTES.PLATFORM.API.NODE_JOURNEY_NETWORKS}/${protocolId}/delete`;

  const request = backendAxiosInstance.get<DeleteProtocolResponse, AxiosResponse<DeleteProtocolResponse>>;

  return {
    url,
    request,
  };
};

export type { DeleteProtocolResponse };
export default useDeleteProtocolAPI;
