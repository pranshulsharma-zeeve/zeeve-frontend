import useSWRImmutable from "swr/immutable";
import { PlatformServiceError } from "../types";
import { NodeType, ProtocolType } from "@/types/protocol";
import useFetcher from "@/hooks/use-fetcher";
import ROUTES from "@/routes";

type ProtocolListResponseData = {
  protocolName: string;
  protocolDesc: string;
  protocolId: string;
  protocolType: ProtocolType;
  platformEnabled: boolean;
  protocolFrontendBaseURL: string;
  subscriptionLink: string;
  nodeType: NodeType;
};

type ProtocolListResponse = ProtocolListResponseData[] | [];

const useProtocolListAPI = (nodeType: NodeType, protocolType?: ProtocolType, platformEnabled?: boolean) => {
  const queryParams = new URLSearchParams();
  if (nodeType) queryParams.append("nodeType", nodeType);
  if (protocolType !== undefined) queryParams.append("protocolType", protocolType.toString());
  if (platformEnabled !== undefined) queryParams.append("platformEnabled", platformEnabled.toString());

  /** api url */
  const url = `${ROUTES.PLATFORM.API.PROTOCOLS}?${queryParams.toString()}`;

  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<ProtocolListResponse, PlatformServiceError>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { ProtocolListResponse, ProtocolListResponseData };
export default useProtocolListAPI;
