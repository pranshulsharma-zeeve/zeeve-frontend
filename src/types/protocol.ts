type NodeType = "full" | "validator" | "archive";
type ProtocolType = "public" | "permissioned" | "hybrid" | "sidechain";
type NetworkType = "testnet" | "mainnet";

type RpcPlanType = "basic" | "advance" | "enterprise";
type ArchivePlanType = "basic" | "advance" | "enterprise";
type ValidatorPlanType = "advance" | "enterprise";

type NodePlanTypeMap = {
  full: RpcPlanType;
  archive: ArchivePlanType;
  validator: ValidatorPlanType;
};

type ApiNodeType = "RPC" | "Archive" | "Validator";
type SubscriptionNodeType = "rpc" | "archive" | "validator";

export type {
  NodeType,
  ProtocolType,
  NetworkType,
  RpcPlanType,
  ArchivePlanType,
  ValidatorPlanType,
  NodePlanTypeMap,
  ApiNodeType,
  SubscriptionNodeType,
};
