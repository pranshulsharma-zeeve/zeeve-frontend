import { AxiosResponse } from "axios";
import useAxios from "@/hooks/use-axios";
import { withApiBasePath } from "@/constants/api";

interface DisableRestakeRequestPayload {
  hostId: string;
}

interface ResponsePayload {
  success: boolean;
}

/** hook to use disable restake api */
const useDisableRestakeAPI = (nodeId: string) => {
  const { backendAxiosInstance } = useAxios();
  /** api url */
  const url = withApiBasePath(`/subscriptions/${nodeId}/restake/disable`);
  /** api request */
  const request = backendAxiosInstance.post<
    ResponsePayload,
    AxiosResponse<ResponsePayload>,
    DisableRestakeRequestPayload
  >;

  return {
    url,
    request,
  };
};

export default useDisableRestakeAPI;
export type { DisableRestakeRequestPayload };
