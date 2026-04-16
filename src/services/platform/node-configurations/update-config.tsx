import { AxiosResponse } from "axios";
import ROUTES from "@/routes";
import useAxios from "@/hooks/use-axios";
import { NodeConfigurationSchemaType } from "@/app/manage/nodes/full/[id]/_components/details/node-configuration/schema";
import { withApiBasePath } from "@/constants/api";

interface UpdateNodeConfigurationsRequestPayload {
  client_domain: string;
  config: NodeConfigurationSchemaType;
}
interface ResponsePayload {
  success: boolean;
  data?: {
    ansibleServerResponse?: {
      status?: string;
      message?: string;
      status_url?: string;
      job_id?: string;
      client_domain?: string;
      client_name?: string;
      config_hash?: string;
    };
  };
  message?: string;
}

const useUpdateNodeConfigurationsAPI = (nodeId: string) => {
  const { backendAxiosInstance } = useAxios();
  /** api url */
  const url = withApiBasePath(`${ROUTES.PLATFORM.API.NODE_CONFIG}/update?nodeId=${nodeId}`);
  /** api request */
  const request = backendAxiosInstance.post<
    ResponsePayload,
    AxiosResponse<ResponsePayload>,
    UpdateNodeConfigurationsRequestPayload
  >;

  return {
    url,
    request,
  };
};

export default useUpdateNodeConfigurationsAPI;
export type { UpdateNodeConfigurationsRequestPayload };
