type NodeType = "nitroNode" | "arbitrumSepoliaNode" | "ethereumSepoliaNode" | "arbitrumDA";
type NodeNetworkStates =
  | "requested"
  | "provisioning"
  | "ready"
  | "deleting"
  | "deleted"
  | "failed"
  | "syncing"
  | "active";

type Node = {
  nodeId: string;
  nodeName: string;
  nodeType: NodeType;
  nodeRegion?: string;
  nodeStatus: NodeNetworkStates | undefined;
  nodeCreatedAt: Date | string;
};

type JsonRpcApiMethods = "ETH" | "WEB3" | "NET" | "Debug" | "DB" | "Personal" | "SSH" | "TXPOOL" | "ADMIN";

type NodeDetail = {
  nodeId: string;
  nodeName: string;
  nodeNetworkId: string;
  nodeType: NodeType;
  chainId: number;
  blockNumber: string;
  agentId: string;
  nodeCloudConfig: {
    managedHosting: boolean;
    cloudName: string;
    region: { id: string; region_name: string; region: string };
    machine: {
      ram: {
        allocated: number;
        consumed: number;
      };
      vCPU: {
        allocated: number;
        consumed: number;
      };
      storage: {
        allocated: number;
        consumed: number;
      };
    };
  };
  nodeEndpointConfig?: {
    endpoint: string;
    ws: boolean;
    http: boolean;
    jsonRpcApiMethods?: JsonRpcApiMethods[];
    credentials: {
      type: string;
      apiKey: string;
    };
  };
  nodeCreatedBy: string;
  nodeCreatedAt: Date;
  nodeUpdatedAt: Date;
  nodeStatus?: NodeNetworkStates;
};
export type { NodeType, NodeNetworkStates, Node, JsonRpcApiMethods, NodeDetail };
