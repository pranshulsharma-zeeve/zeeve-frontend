"use client";
import { AxiosResponse } from "axios";
import { SupportedRollupType, useResolvedRollupType } from "./rollup-type";
import ROUTES from "@orbit/routes";
import { backendAxiosInstance } from "@orbit/utils/axios";

type DeployNetworkResponseData = {
  message: string;
  // networkId: string;
  redirectionUrl: string;
};

type DeployNetworkResponse = {
  success: boolean;
  data: DeployNetworkResponseData;
};

type DeployNetworkRequest = {
  networkConfig: NetworkConfig;
  cloudConfig: CloudConfig;
  nodesConfig: NodesConfig;
};

type NetworkConfig = {
  generalConfig: GeneralConfig;
  chainConfig: ChainConfig;
};

type GeneralConfig = {
  name: string;
  description?: string;
  environment: string;
  workspaceId: string;
};

type ChainConfig = {
  settlementLayer: string;
  externalDA: string;
  externalDaPartner?: string;
  NativeGasToken?: string;
  ERC20ContractAddress?: string;
  sequencer: string;
  sequencerPartner?: string;
  premineAmount?: string;
  premineAddress?: string;
  tokenName?: string;
  tokenSymbol?: string;
  // deployKey: string;
  integerations: { [key: string]: boolean };
};

type CloudConfig = {
  cloudId: string;
  regionId: string;
  deploymentTypeId: string;
  managedHosting: boolean;
  projectId?: string;
  credId?: string;
};

type NodesConfig = {
  nitroNode: RPCNodeConfig[];
  arbitrumSepoliaNode: BlockChainNodeConfig[];
  // ethereumSepoliaNode: BlockChainNodeConfig[];
  arbitrumDA?: BlockChainNodeConfig[];
};

type RPCNodeConfig = {
  name: string;
  type: string;
  config: {
    rpcAccess: {
      credentials: {
        type: string;
      };
      apis: string[];
      http: boolean;
      ws: boolean;
    };
  };
};

type BlockChainNodeConfig = {
  name: string;
  type: string;
};

const useDeployNetwork = (rollupType?: SupportedRollupType) => {
  const resolvedRollupType = useResolvedRollupType(rollupType);
  const url = ROUTES.ARBITRUM_ORBIT.API.NETWORKS;

  const request = backendAxiosInstance.post<
    DeployNetworkResponse,
    AxiosResponse<DeployNetworkResponse>,
    DeployNetworkRequest
  >;

  return {
    rollupType: resolvedRollupType,
    url,
    request,
  };
};

export type { DeployNetworkRequest, DeployNetworkResponse };
export default useDeployNetwork;
