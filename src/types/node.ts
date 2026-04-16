type NodeNetworkStates =
  | "requested"
  | "payment pending"
  | "provisioning"
  | "ready"
  | "deleting"
  | "closed"
  | "suspended"
  | "deleted"
  | "failed"
  | "updating"
  | "success"
  | "retry"
  | "User Input Required"
  | "syncing";
type SubscriptionStatus = "available" | "consumed" | "all";
type NodeType = "sentry" | "validator" | "full" | "archive" | "zkevm" | "zksync" | "rpc" | "prover" | "dac";
type NodeSyncingStatus = "Not Started" | "Syncing" | "Synced";

type Node = {
  name: string;
  id: string;
  agentId?: string;
  type: NodeType;
};

type NodeServiceStatus = {
  status?: NodeSyncingStatus;
  blockHeight?: string;
};

export type { NodeNetworkStates, SubscriptionStatus, NodeType, NodeSyncingStatus, Node, NodeServiceStatus };
