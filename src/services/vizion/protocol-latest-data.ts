/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { getConfig } from "@/config";
import useAxios from "@/hooks/use-axios";
import VISION_ROUTES from "@/routes/vision";

type ProtocolDataResponse = {
  success: boolean;
  data: {
    blockHeight: string;
    syncStatus: string;
  };
};

type ProtocolDataPayload = {
  hostIds: string[];
  primaryHost: string;
  range?: string;
  currentTime?: string;
};

/**
 * Hook for fetching protocol data via generic endpoint
 * @param protocol - Protocol name (e.g., 'coreum', 'avalanche'). If not provided, defaults to 'coreum' for backward compatibility.
 */
const useProtocolDataAPI = (protocol?: string) => {
  const config = getConfig();
  const vizionBackend = config?.url?.external?.vizion?.backend;
  const protocolParam = protocol?.toLowerCase() || "";
  const url = `${vizionBackend}${VISION_ROUTES.API.PROTOCOL_DATA}?protocol=${encodeURIComponent(protocolParam)}`;

  const { backendAxiosInstance } = useAxios();

  /** api request */
  const request = backendAxiosInstance.post<
    ProtocolDataResponse,
    AxiosResponse<ProtocolDataResponse>,
    ProtocolDataPayload
  >;

  return {
    url,
    request,
  };
};

export type { ProtocolDataResponse, ProtocolDataPayload };
export default useProtocolDataAPI;
