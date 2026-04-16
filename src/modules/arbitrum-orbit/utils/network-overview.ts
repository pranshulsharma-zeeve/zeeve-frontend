import { NodeNetworkStates } from "@orbit/types/node";
import {
  LayerTokenInfo,
  OVERVIEW_INFO,
  OverviewNode,
  RollupLayerMetadata,
  RollupWalletInfo,
} from "@orbit/types/overview";

const toNumber = (value?: string | number): number | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }
  return typeof value === "string" ? Number(value) : value;
};

const isNodeReady = (status: string | undefined) => status?.toLowerCase() === "ready";
const isNodeFailed = (status: string | undefined) => status?.toLowerCase() === "failed";
const isNodeDeleting = (status: string | undefined) =>
  status?.toLowerCase() === "deleting" || status?.toLowerCase() === "deleted";

const findRpcNode = (nodes?: OverviewNode[]) =>
  nodes?.find((node) => node.node_type?.toLowerCase().includes("rpc")) ??
  nodes?.find((node) => node.node_type === "rpc");

const getLayerExplorerUrl = (layer?: RollupLayerMetadata) =>
  layer?.urls?.explorer ??
  (layer?.explorerUrl as string | undefined) ??
  (layer?.blockExplorerUrl as string | undefined);

const getLayerBridgeUrl = (layer?: RollupLayerMetadata) =>
  layer?.urls?.bridge ?? (layer?.bridgeUrl as string | undefined);

const getLayerRpcUrl = (layer?: RollupLayerMetadata) =>
  layer?.urls?.rpc ?? (layer?.rpcUrl as string | undefined) ?? (layer?.rpcUrls as string | undefined);

const getLayerFaucetUrl = (layer?: RollupLayerMetadata) => layer?.urls?.faucet ?? (layer?.faucet as string | undefined);

const deriveNetworkStatus = (nodes?: OverviewNode[]): NodeNetworkStates | undefined => {
  if (!nodes || nodes.length === 0) {
    return undefined;
  }
  const statuses = nodes.map((node) => node.status?.toString().toLowerCase());
  if (statuses.every((status) => status && isNodeReady(status))) {
    return "ready";
  }
  if (statuses.some((status) => status && isNodeFailed(status))) {
    return "failed";
  }
  if (statuses.some((status) => status && isNodeDeleting(status))) {
    return "deleting";
  }
  return "provisioning";
};

export const getNetworkName = (overview?: OVERVIEW_INFO) =>
  overview?.service_name ?? overview?.user_inputs?.name ?? overview?.rollup_metadata?.l3?.name;

export const getNetworkStatus = (overview?: OVERVIEW_INFO): NodeNetworkStates | string | undefined => {
  const status = overview?.status ?? overview?.rollup_metadata?.general?.status;
  if (status) {
    return status;
  }
  return deriveNetworkStatus(overview?.nodes);
};

export const getNetworkEnvironment = (overview?: OVERVIEW_INFO) => overview?.user_inputs?.extras?.network_type;

export const getAgentId = (overview?: OVERVIEW_INFO) => overview?.rollup_metadata?.general?.agentId;

export const getAnalyticsId = (overview?: OVERVIEW_INFO) => overview?.rollup_metadata?.general?.analyticsId;

export const getNetworkOwner = (overview?: OVERVIEW_INFO) => overview?.rollup_metadata?.general?.ownedBy;

export const getL3ExplorerUrl = (overview?: OVERVIEW_INFO) =>
  getLayerExplorerUrl(overview?.rollup_metadata?.l3) ?? overview?.rollup_metadata?.general?.blockExplorerUrl;

export const getL2ExplorerUrl = (overview?: OVERVIEW_INFO) => getLayerExplorerUrl(overview?.rollup_metadata?.l2);

export const getL1ExplorerUrl = (overview?: OVERVIEW_INFO) => getLayerExplorerUrl(overview?.rollup_metadata?.l1);

export const getBridgeUrl = (overview?: OVERVIEW_INFO) =>
  getLayerBridgeUrl(overview?.rollup_metadata?.l3) ??
  getLayerBridgeUrl(overview?.rollup_metadata?.l2) ??
  overview?.rollup_metadata?.general?.bridgeUrl;

export const getFaucetUrl = (overview?: OVERVIEW_INFO) =>
  getLayerFaucetUrl(overview?.rollup_metadata?.l2) ??
  overview?.rollup_metadata?.general?.faucetUrl ??
  overview?.rollup_metadata?.wallets?.faucet;

export const getL1RpcUrl = (overview?: OVERVIEW_INFO) => getLayerRpcUrl(overview?.rollup_metadata?.l1);

export const getRpcUrl = (overview?: OVERVIEW_INFO) => getLayerRpcUrl(overview?.rollup_metadata?.l2);

export const getL3RpcUrl = (overview?: OVERVIEW_INFO) => getLayerRpcUrl(overview?.rollup_metadata?.l3);

export const getChallengePeriodBlock = (overview?: OVERVIEW_INFO) => overview?.rollup_metadata?.challengePeriodBlock;

export const getConfirmationPeriodInBlock = (overview?: OVERVIEW_INFO) =>
  overview?.rollup_metadata?.confirmPeriodInBlock ??
  overview?.rollup_metadata?.l1?.confirmPeriodInBlock ??
  overview?.rollup_metadata?.l2?.confirmPeriodInBlock;

export const getWallets = (overview?: OVERVIEW_INFO): RollupWalletInfo | undefined =>
  overview?.rollup_metadata?.wallets;

export const getEnabledRpcMethods = (overview?: OVERVIEW_INFO) => overview?.rollup_metadata?.enabledRpcMethods ?? [];

export const getStateToken = (overview?: OVERVIEW_INFO) =>
  overview?.rollup_metadata?.stakeToken ?? overview?.rollup_metadata?.wallets?.nativeToken;

export const getBaseStake = (overview?: OVERVIEW_INFO) => overview?.rollup_metadata?.baseStake;

export const getSettlementLayer = (overview?: OVERVIEW_INFO) =>
  overview?.rollup_metadata?.general?.settlementLayer ??
  overview?.user_inputs?.configuration?.settlement_layer ??
  overview?.rollup_metadata?.l1?.name;

export const getDataAvailabilityLayer = (overview?: OVERVIEW_INFO) =>
  overview?.user_inputs?.configuration?.external_d_a ?? overview?.rollup_metadata?.l2?.chainType;

export const getCreatedAt = (overview?: OVERVIEW_INFO) =>
  overview?.rollup_metadata?.general?.createdAt ?? overview?.created_at;

export const getL3ChainId = (overview?: OVERVIEW_INFO) =>
  toNumber(
    overview?.rollup_metadata?.l3?.chainId ?? overview?.chain_id ?? overview?.user_inputs?.configuration?.chainId,
  );

export const getL2ChainId = (overview?: OVERVIEW_INFO) =>
  toNumber(
    overview?.rollup_metadata?.l2?.chainId ?? overview?.chain_id ?? overview?.user_inputs?.configuration?.chainId,
  );

const formatRpcEndpoint = (endpoint?: string, protocol?: "https" | "wss") => {
  if (!endpoint || !protocol) {
    return endpoint;
  }

  const trimmedEndpoint = endpoint.trim();
  if (!trimmedEndpoint) {
    return undefined;
  }

  const lowerEndpoint = trimmedEndpoint.toLowerCase();
  if (
    lowerEndpoint.startsWith("http://") ||
    lowerEndpoint.startsWith("https://") ||
    lowerEndpoint.startsWith("ws://") ||
    lowerEndpoint.startsWith("wss://")
  ) {
    return trimmedEndpoint;
  }

  if (trimmedEndpoint.startsWith("//")) {
    return `${protocol}:${trimmedEndpoint}`;
  }

  const sanitized = trimmedEndpoint.replace(/^\/+/, "");
  return `${protocol}://${sanitized}`;
};

const appendWsSuffix = (endpoint?: string) => {
  if (!endpoint) {
    return endpoint;
  }

  const trimmedEndpoint = endpoint.trim();
  if (!trimmedEndpoint) {
    return undefined;
  }

  try {
    const url = new URL(trimmedEndpoint);
    const normalizedPath = url.pathname.replace(/\/+$/, "");
    if (normalizedPath.toLowerCase().endsWith("/ws")) {
      return url.toString();
    }
    url.pathname = normalizedPath ? `${normalizedPath}/ws` : "/ws";
    return url.toString();
  } catch {
    const match = trimmedEndpoint.match(/^[^?#]*/);
    const basePart = match?.[0] ?? trimmedEndpoint;
    const suffixPart = trimmedEndpoint.slice(basePart.length);
    const normalizedBase = basePart.replace(/\/+$/, "");
    if (normalizedBase.toLowerCase().endsWith("/ws")) {
      return trimmedEndpoint;
    }
    return `${normalizedBase}/ws${suffixPart}`;
  }
};

export const getRpcNodeInfo = (overview?: OVERVIEW_INFO) => {
  const rpcNode = overview?.rollup_metadata?.rpcNode;
  const fallbackRpcNode = findRpcNode(overview?.nodes);

  const endpointConfig = rpcNode?.nodeEndpointConfig;
  const rpcNodeEndpoint = fallbackRpcNode?.endpoint_url ?? endpointConfig?.endpoint ?? getRpcUrl(overview);

  const httpEndpoint =
    endpointConfig?.http === false
      ? undefined
      : formatRpcEndpoint(endpointConfig?.httpEndpoint ?? rpcNodeEndpoint, "https");

  const wsEndpoint =
    endpointConfig?.ws === false
      ? undefined
      : appendWsSuffix(formatRpcEndpoint(endpointConfig?.wsEndpoint ?? rpcNodeEndpoint, "wss"));

  return {
    name: rpcNode?.name ?? fallbackRpcNode?.name,
    httpEndpoint,
    wsEndpoint,
    jsonRpcApiMethods: endpointConfig?.jsonRpcApiMethods ?? getEnabledRpcMethods(overview),
  };
};

export const getNodeCounts = (overview?: OVERVIEW_INFO) => {
  const counts: Record<string, number> = {};
  overview?.nodes?.forEach((node) => {
    const key = node.node_type ?? "unknown";
    counts[key] = (counts[key] ?? 0) + 1;
  });
  return counts;
};

export const getL2TokenInfo = (overview?: OVERVIEW_INFO): LayerTokenInfo => {
  const layer = overview?.rollup_metadata?.l2;
  const token = layer?.token;
  return {
    name: token?.name ?? layer?.tokenName,
    symbol: token?.symbol ?? layer?.tokenSymbol,
    type: token?.type ?? layer?.tokenType,
    premineAmount: token?.premineAmount ?? layer?.premineAmount,
    premineAddress: token?.premineAddress ?? layer?.premineAddress,
    confirmPeriodInBlock: layer?.confirmPeriodInBlock,
    blockTime: layer?.blockTime,
  };
};

export const getL1TokenInfo = (overview?: OVERVIEW_INFO): LayerTokenInfo => {
  const layer = overview?.rollup_metadata?.l1;
  const token = layer?.token;

  return {
    name: token?.name ?? layer?.name,
    symbol: token?.symbol ?? layer?.symbol,
    type: token?.type ?? layer?.tokenType,
    premineAmount: token?.premineAmount ?? layer?.premineAmount,
    premineAddress: token?.premineAddress ?? layer?.premineAddress,
    confirmPeriodInBlock: layer?.confirmPeriodInBlock,
    blockTime: layer?.blockTime,
  };
};

export const getLayerName = (layer?: RollupLayerMetadata, fallback?: string) => layer?.name ?? fallback;

export const getNodeStatusLabel = (status?: string) => status ?? "NA";
