import { AxiosResponse } from "axios";
import useAxios from "@/hooks/use-axios";
import { withApiBasePath } from "@/constants/api";

interface EnableRestakeRequestPayload {
  hostId: string;
  interval: number | undefined;
  minimumReward: number | undefined;
}

interface ResponsePayload {
  success: boolean;
}

/** hook to use enable restake api */
const useEnableRestakeAPI = (nodeId: string) => {
  const { backendAxiosInstance } = useAxios();
  /** api url */
  const url = withApiBasePath(`/subscriptions/${nodeId}/restake/enable`);
  /** api request */
  const request = backendAxiosInstance.post<
    ResponsePayload,
    AxiosResponse<ResponsePayload>,
    EnableRestakeRequestPayload
  >;

  return {
    url,
    request,
  };
};

export default useEnableRestakeAPI;
export type { EnableRestakeRequestPayload };
