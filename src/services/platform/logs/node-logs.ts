import useSWRImmutable from "swr/immutable";
import useFetcher from "@/hooks/use-fetcher";
import { withApiBasePath } from "@/constants/api";

const convertMilliToNano = (millis: number): number => {
  return millis * 1_000_000;
};

type NodeLogsResponse = {
  success: boolean;
  data: {
    logs: {
      stream: {
        agent_id: string;
        app: string;
        app_kubernetes_io_instance: string;
        app_kubernetes_io_name: string;
        apps_kubernetes_io_pod_index: string;
        client: string;
        component: string;
        container: string;
        controller_revision_hash: string;
        environment: string;
        filename: string;
        instance: string;
        job: string;
        namespace: string;
        network_id: string;
        node_name: string;
        pod: string;
        pod_index: string;
        service_name: string;
        statefulset_kubernetes_io_pod_name: string;
        stream: string;
        web3protocol: string;
      };
      values: string[][];
    }[];
    combinedLogs: string[][];
  };
};

const useNodeLogsAPI = (params: {
  networkId: string;
  agentId: string;
  serviceName: string;
  startTime: Date;
  endTime: Date;
}) => {
  /** api url */
  const url = withApiBasePath(
    `/${params.networkId}/logs?agentId=${params.agentId}&serviceName=${params.serviceName}&startTime=${convertMilliToNano(params.startTime.getTime()).toString()}&endTime=${convertMilliToNano(params.endTime.getTime()).toString()}`,
  );
  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<NodeLogsResponse>(params.serviceName ? url : null, fetcher, {
    shouldRetryOnError: false,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
  });

  return {
    url,
    request,
  };
};

export type { NodeLogsResponse };
export default useNodeLogsAPI;
