import { AxiosResponse } from "axios";
import { getConfig } from "@/config";
import ROUTES from "@/routes";
import useAxios from "@/hooks/use-axios";
import { BlockStatus } from "@/services/vision/types/vision-types";

type BlockStatusResponse = {
  success: boolean;
  data: BlockStatus;
};

type BlockStatusRequestPayload = {
  hostIds: string[];
  primaryHost: string;
};

const useBlockStatusAPI = () => {
  const config = getConfig();
  const url = `${config?.url?.external?.vizion?.backend}${ROUTES.VISION.API.BLOCK_STATUS}`;
  const { backendAxiosInstance } = useAxios();

  /** api request */
  const request = backendAxiosInstance.post<
    BlockStatusResponse,
    AxiosResponse<BlockStatusResponse>,
    BlockStatusRequestPayload
  >;

  return {
    url,
    request,
  };
};

export type { BlockStatusResponse };
export default useBlockStatusAPI;
