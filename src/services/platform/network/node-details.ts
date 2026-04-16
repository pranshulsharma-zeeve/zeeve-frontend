import useSWRImmutable from "swr/immutable";
import useFetcher from "@/hooks/use-fetcher";
import { withApiBasePath } from "@/constants/api";

type NodeDetailsResponse = {
  success: boolean;
  data: {
    node_name: string;
    protocol_name: string;
    status: string;
    created_on: string;
    node_id: string;
    plan_name?: string;
    isVisionOnboarded: boolean;
    network_type: string;
    endpoint: string;
    api_key: string;
    agent_id: string;
    metadata: {
      blsKey?: string;
      blsProof?: string;
      nodeId?: string;
      interval?: number;
      minimum_reward?: number;
    };
  };
};

const useNodeDetailsAPI = (nodeId: string) => {
  /** api url */
  const url = withApiBasePath(`/details/node?node_id=${nodeId}`);
  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<NodeDetailsResponse>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { NodeDetailsResponse };
export default useNodeDetailsAPI;
