import { AxiosResponse } from "axios";
import { getConfig } from "@/config";
import useAxios from "@/hooks/use-axios";

type EnableDisableRestakeResponse = {
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

const useEnableDisableRestakeAPI = (nodeId: string, networkId: string, disable: boolean) => {
  const config = getConfig();
  const { backendAxiosInstance } = useAxios();
  /** api url */
  let url: string;
  if (disable) {
    url = `${config?.url?.external?.coreum?.backend}/restake/${networkId}/nodes/${nodeId}/disable`;
  } else {
    url = `${config?.url?.external?.coreum?.backend}/restake/${networkId}/nodes/${nodeId}`;
  }

  /** api request */
  /** api request */
  const request = disable
    ? () => backendAxiosInstance.get<EnableDisableRestakeResponse, AxiosResponse<EnableDisableRestakeResponse>>(url)
    : () =>
        backendAxiosInstance.post<EnableDisableRestakeResponse, AxiosResponse<EnableDisableRestakeResponse>>(
          url,
          { nodeId, networkId }, //payload
        );

  return {
    url,
    request,
  };
};

export type { EnableDisableRestakeResponse };
export default useEnableDisableRestakeAPI;
