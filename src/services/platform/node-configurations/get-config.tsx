import useSWRImmutable from "swr/immutable";
import { PlatformServiceError } from "../types";
import useFetcher from "@/hooks/use-fetcher";

interface NodeConfigurationsResponse {
  opentelemetry: {
    enable: boolean;
    environment: string | null;
    debug: boolean;
    url_traces: string;
    url_logs: string;
    headers: string[];
    batch_traces: number;
    batch_logs: number;
    batch_timeout_ms: number;
    gc_telemetry: {
      enable: boolean;
      min_duration_ms: number;
    };
    trace_host_functions: boolean;
    instance_id: string;
  };
  tx_pool: {
    max_size: number;
    max_lifespan: number;
    tx_per_addr_limit: string;
  };
  log_filter: {
    max_nb_blocks: number;
    max_nb_logs: number;
    chunk_size: number;
  };
  observer: {
    evm_node_endpoint: string;
    rollup_node_tracking: boolean;
  };
  // tx_pool_timeout_limit: string;
  // tx_pool_addr_limit: string;
  // tx_pool_tx_per_addr_limit: string;
  experimental_features: {
    enable_websocket: boolean;
  };
  finalized_view: boolean;
  kernel_execution: {
    preimages_endpoint: string;
  };
}

const useNodeConfigurationsAPI = (endpoint: string | undefined, apiKey: string | undefined, isSaving: boolean) => {
  /** API url to fetch node configurations */
  const url = `https://${endpoint}/${apiKey}/rpc/configuration`;

  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<NodeConfigurationsResponse, PlatformServiceError>(
    endpoint && apiKey ? url : null,
    fetcher,
    // {
    //   shouldRetryOnError: isSaving,
    //   errorRetryInterval: 10_000, // retry after every 10 seconds
    //   errorRetryCount: isSaving ? 12 : 0,
    //   refreshInterval: isSaving ? 5000 : 0, // poll every 5 seconds
    // },
  );

  return {
    url,
    request,
  };
};

export default useNodeConfigurationsAPI;
