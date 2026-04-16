import useSWRImmutable from "swr/immutable";
import useFetcher from "@/hooks/use-fetcher";
import ROUTES from "@/routes";
import { NodeNetworkStates, NodeType } from "@/types/node";

type MachineSpec = {
  cpu: string;
  ram: string;
  storage: string;
};

type Cloud = {
  cloudId: string;
  regionId: string;
  regionName: string;
  credId: string;
  machineSpec: MachineSpec;
  zeeveManaged: boolean;
  cloudName: string;
};

type Enable = {
  ws: boolean;
  http: boolean;
};

type Rpc = {
  authType: string;
  bucketId: string;
  enable: Enable;
};
type General = {
  name?: string;
  description?: string;
  workspaceId?: string;
  networkType: string;
  nodeType: NodeType;
};
type Nodes = {
  id: string;
  endpoint?: string;
  instanceType?: string;
  name: string;
  offlineSetup: boolean;
  inputs?: string[];
};

type MetaData = {
  general: General;
  cloud: Cloud;
  rpc: Rpc;
  peerId: string;
  type: NodeType;
  accountId?: string;
  blsKey?: string;
  blsProof?: string;
  nodes: Nodes[];
  nodeId?: string;
  validatorId?: string;
  owner?: string;
  signer?: string;
};

type Agent = {
  online: string;
  id: string;
  represents: string;
};

type Node = {
  id: string;
  name: string;
  status: string;
  accountId: string;
  userId: string;
  createdAt: string;
  metaData: MetaData;
  agent: Agent;
};

type Network = {
  id: string;
  name: string;
  workspaceId: string;
  deploymentId: string | null;
  description: string;
  status: NodeNetworkStates;
  createdAt: string;
  updatedAt: string;
  zpv: string;
  customDashboardUrl: string | null;
  isProvisioned: boolean;
  accountId: string;
  failureReason: string | null;
  offlineSetup: boolean;
  organizationId: string | null;
};

type Protocol = {
  id: string;
  name: string;
  platformEnabled: boolean;
  frontendBaseSubUrl: string | null;
};

type NetworkDetailResponse = {
  network: Network;
  protocol: Protocol;
  nodes: Node[];
};

const useNetworkDetailAPI = (network: string) => {
  /** api url */
  const url = `${ROUTES.PLATFORM.API.NETWORKS}${network}`;
  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<NetworkDetailResponse>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { NetworkDetailResponse, Cloud };
export default useNetworkDetailAPI;
