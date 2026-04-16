import useSWRImmutable from "swr/immutable";
import { useSearchParams } from "next/navigation";
import useFetcher from "@/hooks/use-fetcher";
import ROUTES from "@/routes";
import { NodeNetworkStates, NodeType } from "@/types/node";
import { NetworkType } from "@/types/common";
import { AuthenticationType } from "@/types/credentials";

type AssociationType = "node" | "network";
type AgentOnlineStatus = "online" | "offline";

type NetworkDetailsType = {
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
  offlineSetup: boolean;
  failureReason: string | null;
  organizationId: string;
  paymentStatus: boolean;
  networkFromNodeJourney: boolean;
};
type ProtocolDetailsType = {
  id: string;
  name: string;
  platformEnabled: boolean;
  frontendBaseSubUrl: string;
};
interface NodeDetails {
  id: string;
  endpoint: string;
  instanceType: string;
  isVisionOnboarded?: boolean;
  inputs: {
    network: string;
    nodeType: string;
  };
  name: string;
  offlineSetup: boolean;
}
type MetaDataNetwork = {
  id: string;
  name: string;
  status: NodeNetworkStates;
  accountId: string;
  userId: string;
  createdAt: string;
  general: {
    name: string;
    workspaceId: string;
    description: string;
    networkType: NetworkType;
    nodeType: NodeType;
  };
  cloud: {
    regionId: string;
    credId: string;
    regionName: string;
    cloudId: string;
    zeeveManaged: boolean;
    cloudName: string;
    machineSpec: {
      cpu: string;
      ram: string;
      storage: string;
    };
  };
  rpc: {
    authType: AuthenticationType;
    username?: string;
    jsonRpcApiMethods: string[];
    apiKey?: string;
    enable: {
      http?: boolean;
      ws?: boolean;
    };
  };
  network: {
    ownedBy: string;
    ownedById: string;
    details: string;
    managed: boolean;
    offlineSetup: boolean;
  };
  nodes: NodeDetails[];
};

interface AgentDetailsType {
  id: string;
  online: AgentOnlineStatus;
  represents: AssociationType;
}

type NodeDetailsType = {
  id: string;
  name: string;
  status: NodeNetworkStates;
  accountId: string;
  userId: string;
  createdAt: string;
  metaData: MetaDataNetwork;
  agent?: AgentDetailsType;
};
type NetworkDetailsResponse = {
  network: NetworkDetailsType;
  protocol: ProtocolDetailsType;
  nodes: Array<NodeDetailsType>;
};

const useProtocolDetailsAPI = (networkId: string) => {
  /** api url */
  const searchParams = useSearchParams();
  const planType = searchParams.get("planType") ?? "";
  const url = `${ROUTES.PLATFORM.API.NODE_JOURNEY_NETWORKS}/${networkId}?planType=${planType}`;

  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<NetworkDetailsResponse>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type {
  NetworkDetailsResponse,
  AssociationType,
  AgentOnlineStatus,
  NetworkDetailsType,
  ProtocolDetailsType,
  MetaDataNetwork,
  AgentDetailsType,
  NodeDetailsType,
};
export default useProtocolDetailsAPI;
