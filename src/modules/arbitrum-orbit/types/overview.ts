/* eslint-disable prettier/prettier */
import { NodeNetworkStates } from "./node";

export type LayerUrls = {
  explorer?: string;
  bridge?: string;
  faucet?: string;
  rpc?: string;
  [key: string]: string | undefined;
};

export type LayerTokenInfo = {
  name?: string;
  symbol?: string;
  type?: string;
  premineAmount?: string;
  premineAddress?: string;
  [key: string]: string | undefined;
};

export type RollupLayerMetadata = {
  name?: string;
  chainId?: number | string;
  rpcUrl?: string;
  rpcUrls?: string;
  symbol?: string;
  explorerUrl?: string;
  blockExplorerUrl?: string;
  bridgeUrl?: string;
  faucet?: string;
  blockTime?: string;
  confirmPeriodInBlock?: string;
  networkType?: string;
  chainType?: string;
  tokenName?: string;
  tokenSymbol?: string;
  tokenType?: string;
  premineAmount?: string;
  premineAddress?: string;
  config?: Record<string, string>;
  urls?: LayerUrls;
  token?: LayerTokenInfo;
  [key: string]: unknown;
};

export type RollupWalletInfo = {
  batchPoster?: string;
  staker?: string;
  owner?: string;
  nativeToken?: string;
  faucet?: string;
  [key: string]: string | undefined;
};

export type RollupRpcNodeConfig = {
  name?: string;
  nodeEndpointConfig?: {
    endpoint?: string;
    httpEndpoint?: string;
    wsEndpoint?: string;
    ws?: boolean;
    http?: boolean;
    jsonRpcApiMethods?: string[];
    credentials?: {
      type?: string;
      apiKey?: string;
    };
  };
};

export type RollupMetadataGeneral = {
  agentId?: string;
  analyticsId?: string;
  ownedBy?: string;
  status?: NodeNetworkStates;
  faucetUrl?: string;
  blockExplorerUrl?: string;
  bridgeUrl?: string;
  stateToken?: string;
  baseStake?: string;
  settlementLayer?: string;
  createdAt?: string;
  [key: string]: unknown;
};

export type RollupMetadataConfigs = {
  l2?: Record<string, string>;
  l3?: Record<string, string>;
  [key: string]: Record<string, string> | undefined;
};

export type RollupMetadata = {
  l1?: RollupLayerMetadata;
  l2?: RollupLayerMetadata;
  l3?: RollupLayerMetadata;
  configs?: RollupMetadataConfigs;
  wallets?: RollupWalletInfo;
  rpcNode?: RollupRpcNodeConfig;
  general?: RollupMetadataGeneral;
  baseStake?: string | number;
  stakeToken?: string | number;
  challengePeriodBlock?: string | number;
  confirmPeriodInBlock?: string | number;
  enabledRpcMethods?: string[];
  [key: string]: unknown;
};

export type OverviewNodeMetadata = {
  name?: string;
  role?: string;
  address?: string;
  nodeId?: string;
  publicKey?: string;
  ip?: string;
  p2pPort?: number;
  rpcPort?: number;
  grpcPort?: number;
  region?: string;
  version?: string;
  l1?: {
    rpcUrl?: string;
    chainId?: number | string;
  };
  [key: string]: unknown;
};

export type OverviewNode = {
  id: number;
  nodid: string;
  name: string;
  node_type: string;
  status: NodeNetworkStates | string;
  endpoint_url: string;
  metadata?: OverviewNodeMetadata;
  created_at: string;
};

export type UserInputExtras = {
  is_demo?: boolean;
  network_type?: string;
  [key: string]: unknown;
};

export type UserInputConfiguration = {
  chainId?: string | number;
  sequencer?: string;
  external_d_a?: string;
  settlement_layer?: string;
  [key: string]: unknown;
};

export type UserInputs = {
  name?: string;
  nodes?: unknown[];
  extras?: UserInputExtras;
  type_id?: number;
  region_ids?: number[];
  configuration?: UserInputConfiguration;
  rollup_type_id?: string;
  core_components?: unknown[];
  [key: string]: unknown;
};

export type OVERVIEW_INFO = {
  service_id: number;
  service_name: string;
  status?: NodeNetworkStates | string;
  chain_id?: number | string;
  user_inputs: UserInputs;
  nodes: OverviewNode[];
  rollup_metadata: RollupMetadata;
  created_at: string;
  [key: string]: unknown;
};
