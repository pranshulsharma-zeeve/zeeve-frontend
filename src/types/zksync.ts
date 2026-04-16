"use client";
import { NodeNetworkStates, NodeType } from "@/types/node";

type ZkSyncRollupUserInputs = Record<string, unknown>;

type ZkSyncRollupNode = {
  id?: number | string;
  nodid?: string;
  name?: string;
  node_type?: string;
  status?: NodeNetworkStates | string;
  endpoint_url?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
};

type ZkSyncRollupOverview = {
  service_id?: number;
  service_name?: string;
  user_inputs?: ZkSyncRollupUserInputs;
  nodes?: ZkSyncRollupNode[];
  rollup_metadata?: Record<string, unknown>;
  generalConfig?: GENERALCONFIG;
  isPrividium?: boolean;
};

type ZkSyncRollupNodeSummary = {
  id: string;
  name: string;
  nodeType: NodeType;
  status?: NodeNetworkStates;
  createdAt?: Date;
  endpoint?: string;
  nodeEndpointConfig?: {
    endpoint?: string;
    http?: { enabled: boolean; endpoint: string };
    ws?: { enabled: boolean; endpoint: string };
  };
  rpcAccess?: { http?: { enabled: boolean; endpoint: string }; ws?: { enabled: boolean; endpoint: string } };
};

type ZkSyncRollupNodeCount = {
  total?: number;
} & Partial<Record<NodeType, number>>;

type ZkSyncBlockchainArtifact = {
  name?: string;
  is_json?: boolean;
  content?: unknown;
};

type ZkSyncBlockchainDetails = {
  service_id?: number;
  service_name?: string;
  user_inputs?: ZkSyncRollupUserInputs;
  artifacts?: ZkSyncBlockchainArtifact[];
};

export type GENERALCONFIG = {
  chainStateKeeperTxSlot: string;
  chainStateKeeperMaxAllowedL2TxGasLimit: string;
  chainStateKeeperBlockCommitDeadlineMs: string;
  chainStateKeeperMiniBlockCommitDeadlineMs: string;
  ChainStateKeeperMiniBlockSealQueueCapacity: string;
  chainStateKeeperMaxSingleTxGas: string;
  chainStateKeeperCloseBlockAtGeometryPercentage: string;
  chainStateKeeperCloseBlockAtEthParamsPercentage: string;
  chainStateKeeperCloseBlockAtGasPercentage: string;
  chainStateKeeperRejectTxAtGeometryPercentage: string;
  chainStateKeeperRejectTxAtEthParamsPercentage: string;
  chainStateKeeperRejectTxAtGasPercentage: string;
  chainStateKeeperFairL2GasPrice: string;
  ChainStateKeeperValidationComputationalGasLimit: string;
  ChainStateKeeperVirtualBlocksInterval: string;
  chainStateKeeperVirtualBlocksPerMiniBlock: string;
  ChainCircuitBreakerSyncIntervalMs: string;
  chainCircuitBreakerHttpReqMaxEntryNumber: string;
  chainCircuitBreakerHttpReqRetryIntervalSec: string;
  contractsValidatorTimeLockExecutionDelay: string;
  contractsInitialProtocolVersion: string;
  apiNamespaces?: string[] | string;
  gasPriceScaleFactor?: string | number;
  estimateGasScaleFactor?: string | number;
  removeStuckTxs?: boolean;
  stuckTxTimeout?: string | number;
  feeModelVersion?: string;
  pubdataSendingMode?: string;
  daClient?:
    | {
        enabled?: boolean;
        maxCircuitsPerBatch?: string | number;
      }
    | string;
  maxCircuitsPerBatch?: string | number;
  rpcConfig?: {
    apiNamespaces?: string[];
    gasPriceScaleFactor?: string | number;
    estimateGasScaleFactor?: string | number;
  };
  transactionMempool?: {
    stuckTransactionsTimeoutMs?: string | number;
    stuckTransactionsTimeoutSec?: string | number;
    removeStuckTransactions?: boolean;
  };
};

export type TOKEN_INFO = {
  tokenType: string;
  customTokenInfo?: {
    name: string;
    symbol: string;
    decimal: number;
  };
};

export type BLOCKCHAIN_CONFIG = {
  genesisFile: string;
  generalConfig: GENERALCONFIG;
  tokenInfo: TOKEN_INFO;
};

export type {
  ZkSyncBlockchainArtifact,
  ZkSyncBlockchainDetails,
  ZkSyncRollupNode,
  ZkSyncRollupNodeCount,
  ZkSyncRollupNodeSummary,
  ZkSyncRollupOverview,
  ZkSyncRollupUserInputs,
};
