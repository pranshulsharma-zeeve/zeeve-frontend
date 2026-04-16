import useSWR from "swr";
import { PlatformServiceError } from "../types";
import ROUTES from "@/routes";
import useFetcher from "@/hooks/use-fetcher";
import { withApiBasePath } from "@/constants/api";

interface NodeConfigStatusResponse {
  success: boolean;
  data?: {
    ansibleServerResponse?: {
      job?: {
        status?: string;
      };
    };
  };
  message?: string;
}

const useNodeConfigStatusAPI = (nodeId: string | undefined, isSaving: boolean) => {
  const fetcher = useFetcher();
  const url = withApiBasePath(`${ROUTES.PLATFORM.API.NODE_CONFIG}/status?nodeId=${nodeId}`);

  const request = useSWR<NodeConfigStatusResponse, PlatformServiceError>(isSaving && nodeId ? url : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: isSaving ? 10_000 : 0,
  });

  return {
    url,
    request,
  };
};

export default useNodeConfigStatusAPI;
export type { NodeConfigStatusResponse };
