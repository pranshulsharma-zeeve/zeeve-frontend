import { AxiosResponse } from "axios";
import ROUTES from "@/routes";
import useAxios from "@/hooks/use-axios";
import { NodeConfigurationSchemaType } from "@/app/manage/nodes/full/[id]/_components/details/node-configuration/schema";
import { withApiBasePath } from "@/constants/api";

interface AddConfigUpdationLogRequestPayload {
  userEmail: string;
  updatedAt: string;
  protocolName: string;
  nodeId: string;
  updatedConfig: NodeConfigurationSchemaType;
  status: string;
}
interface ResponsePayload {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: string;
}

const useAddConfigUpdationLogAPI = () => {
  const { backendAxiosInstance } = useAxios();
  /** api url */
  const url = withApiBasePath(`${ROUTES.PLATFORM.API.NODE_CONFIG}/add-updation-log`);
  /** api request */
  const request = backendAxiosInstance.post<
    ResponsePayload,
    AxiosResponse<ResponsePayload>,
    AddConfigUpdationLogRequestPayload
  >;

  return {
    url,
    request,
  };
};

export default useAddConfigUpdationLogAPI;
export type { AddConfigUpdationLogRequestPayload };
