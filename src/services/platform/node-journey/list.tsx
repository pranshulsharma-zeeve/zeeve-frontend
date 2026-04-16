import useSWRImmutable from "swr/immutable";
import { PlatformServiceError } from "../types";
import { NodeType } from "@/types/protocol";
import useFetcher from "@/hooks/use-fetcher";
import ROUTES from "@/routes";
import { ProtocolDetailsApiResponse } from "@/types/api/protocols";

const NODE_TYPE_LABEL: Record<NodeType, string> = { full: "RPC", archive: "Archive", validator: "Validator" };

const useNodeProtocolsAPI = (nodeType: NodeType) => {
  const url = `${ROUTES.PLATFORM.API.DETAILS_PROTOCOLS}?node_type=${NODE_TYPE_LABEL[nodeType]}`;
  const fetcher = useFetcher();

  const request = useSWRImmutable<ProtocolDetailsApiResponse, PlatformServiceError>(
    url,
    (key: string) => fetcher(key),
    {
      shouldRetryOnError: false,
    },
  );

  return {
    url,
    request,
  };
};

export type { ProtocolDetailsApiResponse as NodeProtocolListResponse };
export { NODE_TYPE_LABEL };
export default useNodeProtocolsAPI;
