"use client";
import { useMemo } from "react";
import useSWRImmutable from "swr/immutable";
import type { WalletListItem } from "./supernet/wallet-list";
import useFetcher from "@/hooks/use-fetcher";
import { withApiBasePath } from "@/constants/api";
import type { NodeNetworkStates, NodeType } from "@/types/node";
import type {
  PolygonBlockchainArtifact,
  PolygonBlockchainDetails,
  PolygonRollupNode,
  PolygonRollupNodeCount,
  PolygonRollupNodeSummary,
  PolygonRollupOverview,
} from "@/types/polygon-cdk";

type RequestState<T> = {
  request: {
    data: T | undefined;
    isLoading: boolean;
    error: unknown;
  };
  url?: string;
};

type OverviewResponse = { success: boolean; data?: PolygonRollupOverview };
type BlockchainDetailsResponse = { success: boolean; data?: PolygonBlockchainDetails };

const POLYGON_ROLLUP_TYPE = "polygon-cdk";
const BLOCK_HEIGHT_KEYS = [
  "block_height",
  "blockHeight",
  "block_number",
  "blockNumber",
  "l2_block_number",
  "l2BlockNumber",
];

type ParsedWalletArtifact = {
  id?: string;
  name?: string;
  address?: string;
  balance?: string | number;
  currency?: string;
  source: "l1" | "l2";
  raw?: Record<string, unknown>;
};

type WalletDetailsData = {
  name?: string;
  address?: string;
  l1Balance?: string | number;
  l1Currency?: string;
  l2Balance?: string | number;
  l2Currency?: string;
  monthlyProjectedSpend?: string;
};

type WalletDetailsResponse = {
  data?: WalletDetailsData;
};

type PolygonNodeInfra = {
  cloud?: string;
  managed?: boolean;
  region?: { region?: string; regionName?: string };
};

type PolygonNodeDetail = {
  name?: string;
  type?: string;
  status?: NodeNetworkStates;
  createdAt?: string;
  infra?: PolygonNodeInfra;
  metadata?: Record<string, unknown>;
};

type PolygonNodeRpcAccess = {
  http?: boolean;
  ws?: boolean;
  apis?: string[];
};

type PolygonNodeRpcConfig = {
  endpoint?: string;
  rpcAccess?: PolygonNodeRpcAccess;
  enbaledL2SuggestedGasPricePolling?: boolean;
  maxCumulativeGasUsed?: string | number;
  maxReqPerIpPerSec?: string | number;
  traceBatchUseHTTPS?: boolean;
  readTimeout?: string | number;
  writeTimeout?: string | number;
  [key: string]: unknown;
};

type PolygonNodeCredentials = {
  username?: string;
  password?: string;
};

const createStubRequest = <T = Record<string, any>>(data?: T): RequestState<T> => ({
  request: {
    data,
    isLoading: false,
    error: undefined,
  },
});

const stub = (..._args: Array<unknown>): RequestState<Record<string, any>> => createStubRequest({ data: {} });

const ensureRecord = (val: unknown): Record<string, unknown> | undefined => {
  if (val && typeof val === "object" && !Array.isArray(val)) {
    return val as Record<string, unknown>;
  }
  return undefined;
};

const parseBoolean = (value?: unknown): boolean | undefined => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(normalized)) return true;
    if (["false", "0", "no", "n"].includes(normalized)) return false;
  }
  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  return undefined;
};

const readString = (value?: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
};

const sanitizeEndpointHost = (endpoint?: string | null) => {
  if (!endpoint) return undefined;
  const trimmed = endpoint.trim();
  if (!trimmed) return undefined;
  try {
    const url = trimmed.includes("://") ? new URL(trimmed) : new URL(`https://${trimmed}`);
    return url.host;
  } catch {
    return trimmed.replace(/^https?:\/\//i, "");
  }
};

const buildRpcAccess = (host?: string) => {
  if (!host) return undefined;
  return {
    http: { enabled: true, endpoint: `https://${host}` },
    ws: { enabled: true, endpoint: `wss://${host}` },
  };
};

const normaliseStatus = (status?: string): NodeNetworkStates | undefined => {
  if (!status) return undefined;
  const normalized = status.toLowerCase();
  switch (normalized) {
    case "running":
    case "active":
    case "ready":
    case "success":
      return "ready";
    case "deploying":
    case "provisioning":
      return "provisioning";
    case "deleting":
    case "deleted":
      return "deleted";
    case "failed":
      return "failed";
    default:
      return normalized as NodeNetworkStates;
  }
};

const resolveNodeType = (nodeType?: string): NodeType => {
  const normalized = (nodeType ?? "").toLowerCase();
  if (normalized.includes("zkevm")) return "zkevm";
  if (normalized.includes("prover")) return "prover";
  if (normalized.includes("dac")) return "dac";
  if (normalized.includes("validator")) return "validator";
  if (normalized.includes("sentry")) return "sentry";
  if (normalized.includes("full")) return "full";
  if (normalized.includes("archive")) return "archive";
  return "rpc";
};

const mapNode = (node: PolygonRollupNode): PolygonRollupNodeSummary => {
  const host =
    sanitizeEndpointHost(node.endpoint_url) ??
    sanitizeEndpointHost(String(ensureRecord(node.metadata)?.endpoint ?? ""));
  const rpcAccess = buildRpcAccess(host);
  return {
    id: String(node.id ?? node.nodid ?? node.name ?? Math.random().toString(36).slice(2)),
    name: node.name ?? "Node",
    nodeType: resolveNodeType(node.node_type),
    status: normaliseStatus(node.status),
    createdAt: node.created_at ? new Date(node.created_at) : undefined,
    endpoint: host,
    nodeEndpointConfig: rpcAccess ? { endpoint: host, ...rpcAccess } : undefined,
    rpcAccess,
  };
};

const deriveBlockHeightFromNode = (node?: PolygonRollupNode) => {
  if (!node) return undefined;
  const metadata = ensureRecord(node.metadata);
  if (!metadata) return undefined;
  for (const key of BLOCK_HEIGHT_KEYS) {
    if (metadata[key] !== undefined) {
      const value = metadata[key];
      if (typeof value === "number") return value;
      if (typeof value === "string" && value) {
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) return parsed;
      }
    }
  }
  const metrics = ensureRecord(metadata.metrics);
  if (metrics) {
    for (const key of BLOCK_HEIGHT_KEYS) {
      if (metrics[key] !== undefined) {
        const value = metrics[key];
        if (typeof value === "number") return value;
        if (typeof value === "string" && value) {
          const parsed = Number(value);
          if (!Number.isNaN(parsed)) return parsed;
        }
      }
    }
  }
  return undefined;
};

const deriveNetworkStatus = (nodes?: PolygonRollupNode[]): NodeNetworkStates => {
  if (!nodes?.length) return "requested";
  if (nodes.some((node) => normaliseStatus(node.status) === "failed")) return "failed";
  if (nodes.some((node) => normaliseStatus(node.status) === "provisioning")) return "provisioning";
  return "ready";
};

const calculateNodeCount = (nodes?: PolygonRollupNode[]): PolygonRollupNodeCount => {
  if (!nodes) return {};
  return nodes.reduce<PolygonRollupNodeCount>(
    (acc, node) => {
      const type = resolveNodeType(node.node_type);
      acc.total = (acc.total ?? 0) + 1;
      acc[type] = (acc[type] ?? 0) + 1;
      return acc;
    },
    { total: 0 },
  );
};

const normalizeIdentifier = (value?: unknown) =>
  value !== undefined && value !== null ? String(value).toLowerCase() : undefined;

const findNodeByIdentifier = (
  nodes: PolygonRollupNode[] | undefined,
  nodeId?: string,
): PolygonRollupNode | undefined => {
  if (!nodes || !nodeId) return undefined;
  const target = normalizeIdentifier(nodeId);
  if (!target) return undefined;
  return nodes.find((node) => {
    const metadata = ensureRecord(node.metadata);
    const candidates: Array<unknown> = [node.nodid, node.id, node.name, metadata?.nodeId, metadata?.id];
    return candidates.some((candidate) => normalizeIdentifier(candidate) === target);
  });
};

const deriveInfraFromMetadata = (metadata?: Record<string, unknown>): PolygonNodeInfra | undefined => {
  if (!metadata) return undefined;
  const infraRecord = ensureRecord(metadata.infra);
  const fallbackRegion = typeof metadata.region === "string" ? metadata.region : undefined;
  if (!infraRecord) {
    return fallbackRegion ? { region: { region: fallbackRegion } } : undefined;
  }
  const regionRecord = ensureRecord(infraRecord.region);
  const region = regionRecord
    ? {
        region:
          readString(regionRecord.region) ??
          readString(regionRecord.code) ??
          readString(regionRecord.id) ??
          readString(fallbackRegion),
        regionName:
          readString(regionRecord.regionName) ?? readString(regionRecord.name) ?? readString(regionRecord.label),
      }
    : fallbackRegion
      ? { region: fallbackRegion }
      : undefined;
  return {
    cloud: typeof infraRecord.cloud === "string" ? infraRecord.cloud : undefined,
    managed: parseBoolean(infraRecord.managed),
    region,
  };
};

const deriveNodeDetail = (node?: PolygonRollupNode): PolygonNodeDetail | undefined => {
  if (!node) return undefined;
  const metadata = ensureRecord(node.metadata);
  return {
    name: node.name ?? (metadata?.name as string | undefined),
    type: node.node_type ?? (metadata?.type as string | undefined),
    status: normaliseStatus(node.status ?? (metadata?.status as string | undefined)),
    createdAt: readString(node.created_at) ?? readString(metadata?.createdAt) ?? readString(metadata?.created_at),
    infra: deriveInfraFromMetadata(metadata),
    metadata,
  };
};

const deriveRpcAccessFromNode = (node?: PolygonRollupNode) => {
  if (!node) return undefined;
  const metadata = ensureRecord(node.metadata);
  const rpcAccessRecord = ensureRecord(metadata?.rpcAccess ?? metadata?.rpc_access);
  const endpointSource =
    readString(rpcAccessRecord?.endpoint) ?? readString(node.endpoint_url) ?? readString(metadata?.endpoint);
  const endpoint = sanitizeEndpointHost(endpointSource);
  const httpEnabled = typeof rpcAccessRecord?.http === "boolean" ? rpcAccessRecord.http : endpoint ? true : undefined;
  const wsEnabled = typeof rpcAccessRecord?.ws === "boolean" ? rpcAccessRecord.ws : undefined;
  const apisSource = Array.isArray(rpcAccessRecord?.apis)
    ? rpcAccessRecord?.apis
    : Array.isArray(metadata?.enabledRpcMethods)
      ? metadata?.enabledRpcMethods
      : undefined;
  const apis = apisSource
    ?.map((api) => (typeof api === "string" ? api.trim() : undefined))
    .filter((api): api is string => Boolean(api));
  return {
    endpoint,
    rpcAccess: {
      http: httpEnabled,
      ws: wsEnabled,
      apis,
    },
  };
};

const deriveRpcConfigFromNode = (node?: PolygonRollupNode): PolygonNodeRpcConfig | undefined => {
  if (!node) return undefined;
  const metadata = ensureRecord(node.metadata);
  const rpcConfigRecord = ensureRecord(metadata?.rpcConfig ?? metadata?.rpc_config);
  const access = deriveRpcAccessFromNode(node);
  if (!rpcConfigRecord && !access) return undefined;
  const readNumericLike = (value?: unknown) =>
    typeof value === "string" || typeof value === "number" ? value : undefined;
  const config: PolygonNodeRpcConfig = {
    endpoint: access?.endpoint,
    rpcAccess: access?.rpcAccess,
    enbaledL2SuggestedGasPricePolling: parseBoolean(
      rpcConfigRecord?.enbaledL2SuggestedGasPricePolling ?? rpcConfigRecord?.enabledL2SuggestedGasPricePolling,
    ),
    maxCumulativeGasUsed: readNumericLike(rpcConfigRecord?.maxCumulativeGasUsed),
    maxReqPerIpPerSec: readNumericLike(rpcConfigRecord?.maxReqPerIpPerSec),
    traceBatchUseHTTPS: parseBoolean(rpcConfigRecord?.traceBatchUseHTTPS),
    readTimeout: readNumericLike(rpcConfigRecord?.readTimeout),
    writeTimeout: readNumericLike(rpcConfigRecord?.writeTimeout),
  };
  return config;
};

const deriveNodeCredentials = (metadata?: Record<string, unknown>): PolygonNodeCredentials | undefined => {
  if (!metadata) return undefined;
  const credentials = ensureRecord(metadata.credentials ?? metadata.auth ?? metadata.credential);
  if (!credentials) return undefined;
  const username = typeof credentials.username === "string" ? credentials.username : undefined;
  const password = typeof credentials.password === "string" ? credentials.password : undefined;
  if (!username && !password) return undefined;
  return { username, password };
};

const buildQuery = (serviceId?: string) => {
  const params = new URLSearchParams({ type: POLYGON_ROLLUP_TYPE });
  if (serviceId) {
    params.set("service_id", serviceId);
  }
  return params.toString();
};

const findArtifact = (artifacts: PolygonBlockchainArtifact[] | undefined, matcher: (name: string) => boolean) => {
  if (!artifacts?.length) return undefined;
  return artifacts.find((artifact) => matcher((artifact.name ?? "").toLowerCase()));
};

const parseWalletArtifacts = (artifacts?: PolygonBlockchainArtifact[]): ParsedWalletArtifact[] => {
  if (!artifacts?.length) return [];
  const wallets: ParsedWalletArtifact[] = [];
  artifacts.forEach((artifact) => {
    const artifactName = artifact.name?.toLowerCase() ?? "";
    if (!artifactName.includes("wallet")) return;
    const content = artifact.content;
    if (!content || typeof content !== "object") return;
    const record = content as Record<string, unknown>;
    const name = typeof record.name === "string" ? record.name : artifact.name?.replace(/\.json$/i, "");
    const address = typeof record.address === "string" ? record.address : undefined;
    const balance =
      (record.balance as string | number | undefined) ?? (record.l1Balance as string | number | undefined);
    const currency = (record.currency as string | undefined) ?? (record.l1Currency as string | undefined);
    const sourceField =
      (record.network as string | undefined) ??
      (record.source as string | undefined) ??
      (record.chain as string | undefined);
    const source: "l1" | "l2" = sourceField?.toLowerCase().includes("l2") ? "l2" : "l1";
    wallets.push({
      id: typeof record.id === "string" ? record.id : undefined,
      name,
      address,
      balance,
      currency,
      source,
      raw: record,
    });
  });
  return wallets;
};

const usePolygonValidiumService = () => {
  const fetcher = useFetcher();

  const useRollupOverview = (serviceId?: string) => {
    const url = serviceId ? withApiBasePath(`/rollup_node/overview?${buildQuery(serviceId)}`) : null;
    const request = useSWRImmutable<OverviewResponse>(url, fetcher, {
      shouldRetryOnError: false,
    });
    return { url: url ?? undefined, request };
  };

  const useRollupBlockchainDetails = (serviceId?: string) => {
    const url = serviceId ? withApiBasePath(`/rollup_node/blockchain_details?${buildQuery(serviceId)}`) : null;
    const request = useSWRImmutable<BlockchainDetailsResponse>(url, fetcher, {
      shouldRetryOnError: false,
    });
    return { url: url ?? undefined, request };
  };

  const usePolygonNodeList = (
    serviceId?: string,
  ): RequestState<{
    rpc: PolygonRollupNodeSummary[];
    prover: PolygonRollupNodeSummary[];
    dac: PolygonRollupNodeSummary[];
    zkevm?: PolygonRollupNodeSummary;
  }> => {
    const base = useRollupOverview(serviceId);
    const request = useMemo(() => {
      const nodes = (base.request.data?.data?.nodes ?? []).map(mapNode);
      const grouped = nodes.reduce<{
        rpc: PolygonRollupNodeSummary[];
        prover: PolygonRollupNodeSummary[];
        dac: PolygonRollupNodeSummary[];
        zkevm?: PolygonRollupNodeSummary;
      }>(
        (acc, node) => {
          if (node.nodeType === "rpc") acc.rpc.push(node);
          else if (node.nodeType === "prover") acc.prover.push(node);
          else if (node.nodeType === "dac") acc.dac.push(node);
          else if (node.nodeType === "zkevm" && !acc.zkevm) acc.zkevm = node;
          else acc.rpc.push(node);
          return acc;
        },
        { rpc: [], prover: [], dac: [] },
      );
      return {
        data: grouped,
        isLoading: !base.request.data && !base.request.error,
        error: base.request.error,
      };
    }, [base.request.data, base.request.error]);

    return { url: base.url, request };
  };

  const usePolygonNodeSummary = (
    serviceId?: string,
  ): RequestState<{
    rpcNode?: PolygonRollupNodeSummary;
    generalInfo: { status: NodeNetworkStates };
    nodeCount: PolygonRollupNodeCount;
  }> => {
    const base = useRollupOverview(serviceId);
    const request = useMemo(() => {
      const rawOverview = base.request.data?.data;
      const nodes = rawOverview?.nodes ?? [];
      const rpcNode = nodes.find((node) => resolveNodeType(node.node_type) === "rpc");
      return {
        data: {
          rpcNode: rpcNode ? mapNode(rpcNode) : undefined,
          generalInfo: { status: deriveNetworkStatus(nodes) },
          nodeCount: calculateNodeCount(nodes),
        },
        isLoading: !base.request.data && !base.request.error,
        error: base.request.error,
      };
    }, [base.request.data, base.request.error]);
    return { url: base.url, request };
  };

  const usePolygonBlockNumber = (serviceId?: string): RequestState<{ data: { blockHeight?: number } }> => {
    const base = useRollupOverview(serviceId);
    const request = useMemo(() => {
      const blockHeight = base.request.data?.data?.nodes
        ?.map((node) => deriveBlockHeightFromNode(node))
        .find((height): height is number => typeof height === "number");
      return {
        data: { data: { blockHeight } },
        isLoading: !base.request.data && !base.request.error,
        error: base.request.error,
      };
    }, [base.request.data, base.request.error]);
    return { url: base.url, request };
  };

  const usePolygonBlockchainConfig = (serviceId?: string): RequestState<{ data?: Record<string, any> }> => {
    const base = useRollupBlockchainDetails(serviceId);
    const request = useMemo(() => {
      const artifacts = base.request.data?.data?.artifacts ?? [];
      const configArtifact = findArtifact(artifacts, (name) => name.includes("rollup") && name.includes("config"));
      return {
        data: { data: (configArtifact?.content as Record<string, any>) ?? {} },
        isLoading: !base.request.data && !base.request.error,
        error: base.request.error,
      };
    }, [base.request.data, base.request.error]);
    return { url: base.url, request };
  };

  const usePolygonGenesisFile = (serviceId?: string): RequestState<{ data?: Record<string, any> | string }> => {
    const base = useRollupBlockchainDetails(serviceId);
    const request = useMemo(() => {
      const artifacts = base.request.data?.data?.artifacts ?? [];
      const genesisArtifact = findArtifact(artifacts, (name) => name.includes("genesis"));
      return {
        data: { data: (genesisArtifact?.content as Record<string, any> | string) ?? undefined },
        isLoading: !base.request.data && !base.request.error,
        error: base.request.error,
      };
    }, [base.request.data, base.request.error]);
    return { url: base.url, request };
  };

  const useWalletArtifacts = (serviceId?: string): RequestState<ParsedWalletArtifact[]> => {
    const base = useRollupBlockchainDetails(serviceId);
    const request = useMemo(() => {
      const wallets = parseWalletArtifacts(base.request.data?.data?.artifacts);
      return {
        data: wallets,
        isLoading: !base.request.data && !base.request.error,
        error: base.request.error,
      };
    }, [base.request.data, base.request.error]);
    return { url: base.url, request };
  };

  const usePolygonWalletDetails = (
    serviceId?: string,
    field?: string,
    value?: string,
  ): RequestState<WalletDetailsResponse> => {
    const walletArtifacts = useWalletArtifacts(serviceId);
    const request = useMemo(() => {
      const wallets = walletArtifacts.request.data ?? [];
      const matcher = value?.toLowerCase();
      const selected =
        field === "name" && matcher ? wallets.find((wallet) => wallet.name?.toLowerCase() === matcher) : wallets[0];
      return {
        data: selected
          ? {
              data: {
                name: selected.name,
                address: selected.address,
                l1Balance: selected.balance,
                l1Currency: selected.currency,
                monthlyProjectedSpend: undefined,
              },
            }
          : { data: undefined },
        isLoading: walletArtifacts.request.isLoading,
        error: walletArtifacts.request.error,
      };
    }, [field, value, walletArtifacts.request.data, walletArtifacts.request.error, walletArtifacts.request.isLoading]);
    return { url: walletArtifacts.url, request };
  };

  const usePolygonWalletList = (
    serviceId?: string,
  ): RequestState<{ data?: { l1: WalletListItem[]; l2: WalletListItem[] } }> => {
    const walletArtifacts = useWalletArtifacts(serviceId);
    const request = useMemo(() => {
      const wallets = walletArtifacts.request.data ?? [];
      const l1: WalletListItem[] = [];
      const l2: WalletListItem[] = [];
      wallets.forEach((wallet) => {
        const entry: WalletListItem = {
          name: wallet.name ?? "Wallet",
          address: wallet.address,
          balance: wallet.balance,
          currency: wallet.currency,
        };
        if (wallet.source === "l2") l2.push(entry);
        else l1.push(entry);
      });
      return {
        data: { data: { l1, l2 } },
        isLoading: walletArtifacts.request.isLoading,
        error: walletArtifacts.request.error,
      };
    }, [walletArtifacts.request.data, walletArtifacts.request.error, walletArtifacts.request.isLoading]);
    return { url: walletArtifacts.url, request };
  };

  const usePolygonNodeInfo = (serviceId?: string, nodeId?: string): RequestState<{ data?: PolygonNodeDetail }> => {
    const overview = useRollupOverview(serviceId);
    const request = useMemo(() => {
      const node = findNodeByIdentifier(overview.request.data?.data?.nodes, nodeId);
      const detail = deriveNodeDetail(node);
      return {
        data: detail ? { data: detail } : undefined,
        isLoading: !overview.request.data && !overview.request.error,
        error: overview.request.error,
      };
    }, [nodeId, overview.request.data, overview.request.error]);
    return { url: overview.url, request };
  };

  const usePolygonNodeRpcConfig = (
    serviceId?: string,
    nodeId?: string,
  ): RequestState<{ data?: PolygonNodeRpcConfig }> => {
    const overview = useRollupOverview(serviceId);
    const request = useMemo(() => {
      const node = findNodeByIdentifier(overview.request.data?.data?.nodes, nodeId);
      const config = deriveRpcConfigFromNode(node);
      return {
        data: config ? { data: config } : undefined,
        isLoading: !overview.request.data && !overview.request.error,
        error: overview.request.error,
      };
    }, [nodeId, overview.request.data, overview.request.error]);
    return { url: overview.url, request };
  };

  const usePolygonNodeRpcCredentials = (
    serviceId?: string,
    nodeId?: string,
  ): RequestState<{ data?: PolygonNodeCredentials }> => {
    const overview = useRollupOverview(serviceId);
    const request = useMemo(() => {
      const node = findNodeByIdentifier(overview.request.data?.data?.nodes, nodeId);
      const metadata = ensureRecord(node?.metadata);
      const credentials = deriveNodeCredentials(metadata);
      return {
        data: credentials ? { data: credentials } : undefined,
        isLoading: !overview.request.data && !overview.request.error,
        error: overview.request.error,
      };
    }, [nodeId, overview.request.data, overview.request.error]);
    return { url: overview.url, request };
  };

  return {
    config: {
      blockchain: stub,
      rpc: stub,
      zkevm: stub,
    },
    node: {
      summary: usePolygonNodeSummary,
      info: usePolygonNodeInfo,
      list: usePolygonNodeList,
      rpc: {
        delete: stub,
        cred: usePolygonNodeRpcCredentials,
        config: usePolygonNodeRpcConfig,
      },
      zkevm: {
        config: stub,
        delete: stub,
      },
    },
    payment: {
      paymentSuccess: stub,
    },
    subscription: {
      list: stub,
      subscribe: stub,
    },
    supernet: {
      availableNodeCount: stub,
      blockNumber: usePolygonBlockNumber,
      blockchainConfig: usePolygonBlockchainConfig,
      cloudValidation: stub,
      createSupernet: stub,
      deleteNetwork: stub,
      explorerEndpoints: stub,
      genesisFile: usePolygonGenesisFile,
      infraDetails: stub,
      l1Info: stub,
      networkHealth: stub,
      smartContracts: stub,
      supernetInfo: useRollupOverview,
      blockchainDetails: useRollupBlockchainDetails,
      walletDetails: usePolygonWalletDetails,
      walletList: usePolygonWalletList,
      supernetList: stub,
      trialInfo: stub,
      appsList: stub,
      appsDetails: stub,
      dAWalletBalance: stub,
    },
  };
};

export default usePolygonValidiumService;
