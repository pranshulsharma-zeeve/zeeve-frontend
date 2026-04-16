import { AxiosResponse } from "axios";
import type { ProtocolDataPayload } from "./protocol-latest-data";
import { getConfig } from "@/config";
import useAxios from "@/hooks/use-axios";
import VISION_ROUTES from "@/routes/vision";

type PortUptimeTrendItem = {
  itemid: string;
  clock: string;
  value_avg: string;
  timestamp: string;
};

type PortUptimeTrendResponse = {
  success: boolean;
  // Backend returns a single series keyed by a protocol-specific port label (e.g., "Port 26657 Status", "Port 9944 Status").
  data: Record<string, PortUptimeTrendItem[]>;
};

type PortUptimeTrendPayload = ProtocolDataPayload;

/**
 * Hook for fetching port uptime history via generic endpoint
 * @param protocol - Protocol name (e.g., 'coreum', 'avalanche'). If not provided, defaults to 'coreum' for backward compatibility.
 */
const usePortUptimeTrendAPI = (protocol?: string) => {
  const config = getConfig();
  const vizionBackend = config?.url?.external?.vizion?.backend;
  const protocolParam = protocol?.toLowerCase() || "coreum";
  const url = `${vizionBackend}${VISION_ROUTES.API.PORT_UPTIME_HISTORY_GENERIC}?protocol=${encodeURIComponent(protocolParam)}`;

  const { backendAxiosInstance } = useAxios();

  const request = backendAxiosInstance.post<
    PortUptimeTrendResponse,
    AxiosResponse<PortUptimeTrendResponse>,
    PortUptimeTrendPayload
  >;

  return {
    url,
    request,
  };
};

export type { PortUptimeTrendItem, PortUptimeTrendPayload, PortUptimeTrendResponse };
export default usePortUptimeTrendAPI;
