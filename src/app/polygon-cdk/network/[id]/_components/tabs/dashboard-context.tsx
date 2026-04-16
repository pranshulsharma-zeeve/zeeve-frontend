"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import usePolygonValidiumService from "@/services/polygon-validium/use-polygon-validium-service";
import {
  buildRpcAccess,
  deriveBlockHeightFromNode,
  ensureRecord,
  firstDefined,
  humanizeKey,
  isHexAddress,
  normalizeStatus,
  normalizeUrl,
  parseBoolean,
  resolveNodeType,
  sanitizeEndpointHost,
  toNumber,
} from "@/rollups/helper";
import type {
  PolygonBlockchainArtifact,
  PolygonBlockchainDetails,
  PolygonRollupNode,
  PolygonRollupNodeCount,
  PolygonRollupOverview,
  PolygonRollupUserInputs,
} from "@/types/polygon-cdk";
import type { NodeNetworkStates, NodeType } from "@/types/node";
import type { WalletListItem } from "@/services/polygon-validium/supernet/wallet-list";
import { useSuperNetStore } from "@/store/super-net";

type PolygonRollupLayerMetadata = {
  name?: string;
  chainId?: string | number;
  rpcUrl?: string;
  rpcUrls?: string;
  explorerUrl?: string;
  bridgeUrl?: string;
  premineAmount?: string | number;
  premineAddress?: string;
  symbol?: string;
  tokenType?: string;
  chainType?: string;
  blockHeight?: number | string;
  blockTime?: string;
  config?: Record<string, unknown>;
  configuration?: Record<string, unknown>;
  configs?: Record<string, unknown>;
  gasConfig?: Record<string, unknown>;
  transactionConfig?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  extras?: Record<string, unknown>;
  [key: string]: unknown;
};

type PolygonRollupMetadata = {
  l1?: PolygonRollupLayerMetadata;
  l2?: PolygonRollupLayerMetadata;
  l3?: PolygonRollupLayerMetadata;
  wallets?: Record<string, string>;
  enabledRpcMethods?: string[];
  challengePeriodBlock?: string | number;
  baseStake?: string;
  stakeToken?: string;
  agentId?: string;
  status?: string;
  config?: Record<string, unknown>;
  configuration?: Record<string, unknown>;
  configs?: Record<string, unknown>;
  transactionConfig?: Record<string, unknown>;
  gasConfig?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  [key: string]: unknown;
};

type PolygonCdkOverviewData = PolygonRollupOverview & {
  status?: string;
  chain_id?: string | number;
  rollup_metadata?: PolygonRollupMetadata;
  created_at?: string;
};

type PolygonCdkSmartContract = {
  name?: string;
  address?: string;
  explorer?: string;
};

type PolygonCdkBlockchainDetailsData = PolygonBlockchainDetails & {
  status?: string;
  chain_id?: string | number;
  smartContracts?: { l1?: PolygonCdkSmartContract[]; l2?: PolygonCdkSmartContract[] };
  smart_contracts?: { l1?: PolygonCdkSmartContract[]; l2?: PolygonCdkSmartContract[] };
  wallets?: WalletListItem[];
  wallet_details?: WalletListItem[];
};

type CloudInfraRegion = {
  region?: string;
  regionName?: string;
};

type CloudInfraDetails = {
  cloud?: string;
  managed?: boolean;
  region?: CloudInfraRegion;
};

type AppToggle = {
  enabled?: boolean;
  [key: string]: unknown;
};

type WalletHighlight = {
  name: string;
  address?: string;
  balance?: string | number;
  currency?: string;
  monthlyProjectedSpend?: string;
  source?: "L1" | "L2" | "L1 & L2";
};

type WalletCollections = {
  l1: WalletListItem[];
  l2: WalletListItem[];
};

type NormalizedNode = {
  id: string;
  name: string;
  nodeType: NodeType;
  status?: NodeNetworkStates;
  createdAt?: Date;
  endpoint?: string;
  metadata?: Record<string, unknown>;
  rpcAccess?: {
    http?: { enabled: boolean; endpoint: string };
    ws?: { enabled: boolean; endpoint: string };
  };
};

type PolygonCdkSummary = {
  serviceId?: number;
  serviceName?: string;
  chainId?: string;
  status?: NodeNetworkStates;
  environment?: "production" | "sandbox";
  createdAt?: string;
  ownedBy?: string;
  agentId?: string;
  analyticsId?: string;
};

type SupernetSummary = {
  name?: string;
  chainId?: string;
  environment?: "production" | "sandbox";
  agentId?: string;
  analyticsId?: string;
  status?: NodeNetworkStates;
  createdAt?: string;
  ownedBy?: string;
  serviceId?: number;
  serviceName?: string;
  userInputs?: PolygonRollupUserInputs;
  nodes?: PolygonRollupNode[];
  overview?: PolygonRollupOverview;
};

type PolygonCdkDashboardData = {
  overview: PolygonCdkOverviewData | null;
  blockchainDetails: PolygonCdkBlockchainDetailsData | null;
  summary?: PolygonCdkSummary;
  supernetSummary?: SupernetSummary;
  nodes: NormalizedNode[];
  nodesByType: Partial<Record<NodeType, NormalizedNode[]>>;
  nodeCount: PolygonRollupNodeCount;
  rpcNode?: NormalizedNode;
  userInputs: PolygonRollupUserInputs;
  rollupMetadata?: PolygonRollupMetadata;
  blockHeight?: number;
  health: "healthy" | "unhealthy" | "NA";
  wallets: {
    sequencer?: WalletHighlight;
    aggregator?: WalletHighlight;
    explorerL1?: string;
    explorerL2?: string;
    rpcL1?: string;
    rpcL2?: string;
    collections: WalletCollections;
  };
  l1Info?: {
    chainId?: string;
    currency?: string;
    sequencerBalance?: string | number;
    aggregatorBalance?: string | number;
    createdAt?: string;
  };
  blockchainConfig?: Record<string, unknown>;
  smartContracts: {
    l1?: PolygonCdkSmartContract[];
    l2?: PolygonCdkSmartContract[];
    explorerL1?: string;
    explorerL2?: string;
  };
  cloudInfra?: CloudInfraDetails;
  bridge?: { url?: string };
  apps?: Record<string, AppToggle>;
  genesis?: unknown;
};

type PolygonCdkDashboardState = {
  overview: PolygonCdkOverviewData | null;
  blockchainDetails: PolygonCdkBlockchainDetailsData | null;
  normalized?: PolygonCdkDashboardData;
  isLoading: boolean;
  error?: string;
  lastUpdated?: number;
};

type PolygonCdkDashboardContextValue = PolygonCdkDashboardState & {
  refresh: () => Promise<void>;
};

const PolygonCdkDashboardContext = createContext<PolygonCdkDashboardContextValue | undefined>(undefined);

const mergeRecordCandidates = (...candidates: unknown[]): Record<string, unknown> | undefined => {
  let merged: Record<string, unknown> | undefined;
  candidates.forEach((candidate) => {
    const record = ensureRecord(candidate);
    if (!record) return;
    merged = merged ? { ...merged, ...record } : { ...record };
  });
  return merged;
};

const calculateNodeCount = (nodes?: PolygonRollupNode[]): PolygonRollupNodeCount => {
  if (!nodes?.length) return { total: 0 };
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

const mapNode = (node: PolygonRollupNode): NormalizedNode => {
  const metadata = ensureRecord(node.metadata);
  const endpointSource = node.endpoint_url ?? metadata?.endpoint;
  const endpoint = sanitizeEndpointHost(
    typeof endpointSource === "string" || typeof endpointSource === "boolean" ? endpointSource : undefined,
  );
  const fallbackId = Math.random().toString(36).slice(2);
  return {
    id: String(
      node.nodid ??
        node.name ??
        (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : fallbackId),
    ),
    name: node.name ?? "Node",
    nodeType: resolveNodeType(node.node_type),
    status: normalizeStatus(node.status),
    createdAt: node.created_at ? new Date(node.created_at) : undefined,
    endpoint,
    metadata,
    rpcAccess: buildRpcAccess(endpoint),
  };
};

const findArtifact = (
  artifacts: PolygonBlockchainArtifact[] | undefined,
  matcher: (name: string) => boolean,
): PolygonBlockchainArtifact | undefined => {
  if (!artifacts?.length) return undefined;
  return artifacts.find((artifact) => matcher((artifact.name ?? "").toLowerCase()));
};

const parseWalletArtifacts = (artifacts?: PolygonBlockchainArtifact[]): WalletCollections => {
  const collections: WalletCollections = { l1: [], l2: [] };
  if (!artifacts?.length) return collections;

  const pushEntry = (record: Record<string, unknown>, fallbackName?: string) => {
    const name = typeof record.name === "string" && record.name.trim() ? record.name : (fallbackName ?? "Wallet");
    const entry: WalletListItem = {
      name,
      type: (record.type as string | undefined) ?? fallbackName,
      address: typeof record.address === "string" ? record.address : undefined,
      balance: (() => {
        const value = (record.balance ?? record.l1Balance ?? record.l2Balance) as string | number | undefined;
        return typeof value === "string" || typeof value === "number" ? value : undefined;
      })(),
      currency:
        (record.currency as string | undefined) ??
        (record.l1Currency as string | undefined) ??
        (record.l2Currency as string | undefined),
    };
    const sourceValue = (record.source as string | undefined) ?? (record.network as string | undefined);
    const sourceLower = sourceValue?.toLowerCase() ?? "";
    const hasL1 = sourceLower.includes("l1");
    const hasL2 = sourceLower.includes("l2");

    if (hasL1 && hasL2) {
      // Push to both collections if source contains both l1 and l2
      collections.l1.push(entry);
      collections.l2.push(entry);
    } else if (hasL2) {
      collections.l2.push(entry);
    } else {
      // Default to l1 if source is not specified or doesn't match
      collections.l1.push(entry);
    }
  };

  const flattenRecord = (value: unknown, fallbackName?: string) => {
    const record = ensureRecord(value);
    if (!record) return;
    const hasWalletShape =
      typeof record.address === "string" ||
      typeof record.balance === "string" ||
      typeof record.balance === "number" ||
      typeof record.l1Balance === "string" ||
      typeof record.l1Balance === "number" ||
      typeof record.l2Balance === "string" ||
      typeof record.l2Balance === "number" ||
      typeof record.currency === "string" ||
      typeof record.name === "string";
    if (hasWalletShape) {
      pushEntry(record, fallbackName);
      return;
    }
    Object.entries(record).forEach(([key, nested]) => {
      const nestedRecord = ensureRecord(nested);
      if (!nestedRecord) return;
      const enrichedRecord: Record<string, unknown> = {
        name: typeof nestedRecord.name === "string" ? nestedRecord.name : key,
        type: typeof nestedRecord.type === "string" ? nestedRecord.type : key,
        ...nestedRecord,
      };
      flattenRecord(enrichedRecord, key);
    });
  };

  artifacts.forEach((artifact) => {
    const name = artifact.name?.toLowerCase() ?? "";
    if (!name.includes("wallet")) return;
    const content = artifact.content;
    if (Array.isArray(content)) {
      content.forEach((entry) => flattenRecord(entry));
      return;
    }
    if (typeof content === "object" && content) {
      flattenRecord(content as Record<string, unknown>);
    }
  });

  return collections;
};

const collectContractsFromValue = (value: unknown, fallbackLabel?: string): PolygonCdkSmartContract[] => {
  const contracts: PolygonCdkSmartContract[] = [];
  if (!value) return contracts;
  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      const nested = ensureRecord(entry);
      if (!nested) return;
      const address = nested.address as string | undefined;
      if (isHexAddress(address)) {
        contracts.push({
          name: (nested.name as string | undefined)?.trim() || `${fallbackLabel ?? "Contract"} ${index + 1}`,
          address,
          explorer: typeof nested.explorer === "string" ? nested.explorer : undefined,
        });
      }
    });
    return contracts;
  }
  const record = ensureRecord(value);
  if (!record) return contracts;
  Object.entries(record).forEach(([key, entryValue]) => {
    if (isHexAddress(entryValue)) {
      contracts.push({
        name: humanizeKey(key) ?? fallbackLabel ?? "Contract",
        address: entryValue,
      });
      return;
    }
    const nested = ensureRecord(entryValue);
    if (!nested) return;
    const address = nested.address as string | undefined;
    if (!isHexAddress(address)) return;
    contracts.push({
      name: (nested.name as string | undefined)?.trim() || humanizeKey(key) || fallbackLabel || "Contract",
      address,
      explorer: typeof nested.explorer === "string" ? nested.explorer : undefined,
    });
  });
  return contracts;
};

const parseContractArtifact = (artifactContent?: Record<string, unknown>) => {
  if (!artifactContent) return {};
  const l1Contracts: PolygonCdkSmartContract[] = [];
  const l2Contracts: PolygonCdkSmartContract[] = [];
  //   const chainInfo = ensureRecord(artifactContent.chainInfo ?? artifactContent.chain_info);
  //   if (chainInfo) {
  //     l2Contracts.push(...collectContractsFromValue(chainInfo, "Chain Info"));
  //   }
  //   const coreContracts = ensureRecord(artifactContent.coreContracts ?? artifactContent.core_contracts);
  //   if (coreContracts) {
  //     l2Contracts.push(...collectContractsFromValue(coreContracts));
  //   }
  const tokenBridgeContracts = ensureRecord(
    artifactContent.tokenBridgeContracts ?? artifactContent.token_bridge_contracts,
  );
  if (tokenBridgeContracts) {
    const l1Bridge = ensureRecord(tokenBridgeContracts.l1Contracts ?? tokenBridgeContracts.l1_contracts);
    if (l1Bridge) {
      l1Contracts.push(...collectContractsFromValue(l1Bridge, "Token Bridge"));
    }
    const l2Bridge = ensureRecord(tokenBridgeContracts.l2Contracts ?? tokenBridgeContracts.l2_contracts);
    if (l2Bridge) {
      l2Contracts.push(...collectContractsFromValue(l2Bridge, "Token Bridge"));
    }
  }
  return { l1: l1Contracts, l2: l2Contracts };
};

const normalizeContractList = (list?: PolygonCdkSmartContract[]) => {
  if (!list?.length) return undefined;
  const normalized = list
    .filter((contract): contract is PolygonCdkSmartContract =>
      Boolean(contract?.address && isHexAddress(contract.address)),
    )
    .map((contract) => ({
      name: contract.name?.trim() || "Contract",
      address: contract.address as string,
      explorer: typeof contract.explorer === "string" ? contract.explorer : undefined,
    }));
  return normalized.length ? normalized : undefined;
};

const mergeSmartContractLists = (
  ...lists: Array<PolygonCdkSmartContract[] | undefined>
): PolygonCdkSmartContract[] | undefined => {
  const seen = new Map<string, PolygonCdkSmartContract>();
  lists.forEach((list) => {
    list?.forEach((contract) => {
      if (!contract?.address || !isHexAddress(contract.address)) return;
      const key = contract.address.toLowerCase();
      if (!seen.has(key)) {
        seen.set(key, {
          ...contract,
          name: contract.name?.trim() || "Contract",
        });
      }
    });
  });
  return seen.size ? Array.from(seen.values()) : undefined;
};

const deriveWalletHighlight = (
  label: "sequencer" | "aggregator",
  collections: WalletCollections,
  metadataWallets?: Record<string, string>,
): WalletHighlight | undefined => {
  const matcher = label.toLowerCase();
  const findEntry = (list: WalletListItem[]) =>
    list.find((wallet) => wallet.name?.toLowerCase().includes(matcher) || wallet.type?.toLowerCase() === matcher);
  const l1Match = findEntry(collections.l1);
  const l2Match = findEntry(collections.l2);
  const address = firstDefined(l1Match?.address, l2Match?.address, metadataWallets?.[matcher]);
  const balance = firstDefined(l1Match?.balance, l2Match?.balance);
  const currency = firstDefined(l1Match?.currency, l2Match?.currency);
  if (!address && !balance) {
    return metadataWallets?.[matcher]
      ? {
          name: matcher,
          address: metadataWallets[matcher],
        }
      : undefined;
  }
  // Determine source based on where the wallet exists
  const source = l1Match && l2Match ? "L1 & L2" : l2Match ? "L2" : "L1";

  return {
    name: matcher,
    address,
    balance,
    currency,
    source,
  };
};

const deriveCloudInfra = (
  overview: PolygonCdkOverviewData | null,
  blockchainDetails: PolygonCdkBlockchainDetailsData | null,
): CloudInfraDetails | undefined => {
  const records: Record<string, unknown>[] = [];
  const addRecord = (value?: unknown) => {
    const record = ensureRecord(value);
    if (record) records.push(record);
    return record;
  };

  const userInputs = addRecord(overview?.user_inputs);
  const extras = addRecord(userInputs?.extras);
  const configuration = addRecord(userInputs?.configuration);
  addRecord(userInputs?.infra);
  addRecord(userInputs?.cloud_infra);
  addRecord(userInputs?.cloudInfra);
  addRecord(extras?.infra);
  addRecord(configuration?.infra);
  addRecord(overview?.rollup_metadata?.infra);
  addRecord(blockchainDetails?.user_inputs);
  const infraArtifact = blockchainDetails?.artifacts
    ? findArtifact(blockchainDetails.artifacts, (name) => name.includes("infra"))
    : undefined;
  addRecord(infraArtifact?.content);

  if (!records.length) return undefined;

  const readStringFromRecord = (record: Record<string, unknown>, keys: string[]): string | undefined => {
    for (const key of keys) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
    return undefined;
  };

  const readString = (keys: string[]): string | undefined => {
    for (const record of records) {
      const match = readStringFromRecord(record, keys);
      if (match) return match;
    }
    return undefined;
  };

  const readBoolean = (keys: string[]): boolean | undefined => {
    for (const record of records) {
      for (const key of keys) {
        if (!(key in record)) continue;
        const parsed = parseBoolean(record[key]);
        if (parsed !== undefined) return parsed;
      }
    }
    return undefined;
  };

  const readRegion = (): CloudInfraRegion | undefined => {
    for (const record of records) {
      const candidate = record.region ?? record.region_info ?? record.regionInfo ?? record.location;
      if (typeof candidate === "string" && candidate.trim()) {
        return { region: candidate.trim() };
      }
      const regionRecord = ensureRecord(candidate);
      if (regionRecord) {
        return {
          region: readStringFromRecord(regionRecord, ["region", "code", "id", "value"]),
          regionName: readStringFromRecord(regionRecord, ["regionName", "name", "label"]),
        };
      }
    }
    return undefined;
  };

  const cloud = readString(["cloud", "cloud_provider", "cloudProvider", "provider", "cloudName"]);
  const managed = readBoolean(["managed", "is_managed", "isManaged", "zeeveManaged"]);
  const region = readRegion();
  if (!cloud && !region && managed === undefined) return undefined;
  return { cloud, managed, region };
};

const deriveBridgeInfo = (metadata?: PolygonRollupMetadata) => {
  if (!metadata) return undefined;
  const candidate = firstDefined(
    metadata.l2?.bridgeUrl,
    (metadata.l2 as Record<string, unknown> | undefined)?.bridge_url as string | undefined,
    metadata.l1?.bridgeUrl,
    (metadata.l1 as Record<string, unknown> | undefined)?.bridge_url as string | undefined,
    metadata.bridgeUrl as string | undefined,
    metadata.bridge_url as string | undefined,
  );
  if (typeof candidate !== "string") return undefined;
  const url = normalizeUrl(candidate);
  if (!url) return undefined;
  return { url };
};

const extractAppsConfig = (
  overview: PolygonCdkOverviewData | null,
  blockchainDetails: PolygonCdkBlockchainDetailsData | null,
): Record<string, AppToggle> | undefined => {
  const result: Record<string, AppToggle> = {};
  const mergeRecord = (value?: unknown) => {
    const record = ensureRecord(value);
    if (!record) return;
    Object.entries(record).forEach(([key, entryValue]) => {
      const normalizedKey = key.trim();
      if (!normalizedKey) return;
      const entryRecord = ensureRecord(entryValue);
      if (entryRecord) {
        const merged: AppToggle = {
          ...(result[normalizedKey] ?? {}),
          ...entryRecord,
        };
        if ("enabled" in entryRecord) {
          const parsed = parseBoolean(entryRecord.enabled);
          if (parsed !== undefined) merged.enabled = parsed;
        }
        result[normalizedKey] = merged;
      } else {
        const parsed = parseBoolean(entryValue);
        result[normalizedKey] = {
          ...(result[normalizedKey] ?? {}),
          enabled: parsed ?? result[normalizedKey]?.enabled,
        };
      }
    });
  };

  const userInputs = ensureRecord(overview?.user_inputs);
  const extras = ensureRecord(userInputs?.extras);
  const configuration = ensureRecord(userInputs?.configuration);
  const blockchainInputs = ensureRecord(blockchainDetails?.user_inputs);
  const metadata = ensureRecord(overview?.rollup_metadata);
  const appsArtifact = blockchainDetails?.artifacts
    ? findArtifact(blockchainDetails.artifacts, (name) => name.includes("app"))
    : undefined;

  [
    userInputs?.apps,
    userInputs?.applications,
    userInputs?.apps_list,
    extras?.apps,
    extras?.applications,
    configuration?.apps,
    configuration?.applications,
    blockchainInputs?.apps,
    blockchainInputs?.applications,
    blockchainInputs?.apps_list,
    metadata?.apps,
    metadata?.applications,
    appsArtifact?.content,
  ].forEach(mergeRecord);

  return Object.keys(result).length ? result : undefined;
};

const extractGenesisFile = (blockchainDetails: PolygonCdkBlockchainDetailsData | null) => {
  if (!blockchainDetails?.artifacts?.length) return undefined;
  const artifact = findArtifact(blockchainDetails.artifacts, (name) => name.includes("genesis"));
  return artifact?.content;
};

const normalizeEnvironment = (value?: string): "production" | "sandbox" | undefined => {
  if (!value) return undefined;
  const normalized = value.toLowerCase();
  if (["prod", "production", "mainnet", "live"].includes(normalized)) return "production";
  if (["sandbox", "testnet", "dev", "development", "staging"].includes(normalized)) return "sandbox";
  return undefined;
};

const deriveSummary = (
  overview: PolygonCdkOverviewData | null,
  userInputs: PolygonRollupUserInputs,
  metadata?: PolygonRollupMetadata,
): { summary?: PolygonCdkSummary; supernetSummary?: SupernetSummary } => {
  if (!overview) return { summary: undefined, supernetSummary: undefined };
  const extras = ensureRecord((userInputs as Record<string, unknown>)?.extras);
  const configuration = ensureRecord((userInputs as Record<string, unknown>)?.configuration);
  const status = normalizeStatus(overview.status);
  const chainIdValue = firstDefined(
    overview.chain_id,
    userInputs.chain_id as string | number | undefined,
    userInputs.chainId as string | number | undefined,
    configuration?.chainId,
    metadata?.l2?.chainId,
  );
  const summary: PolygonCdkSummary = {
    serviceId: overview.service_id,
    serviceName: overview.service_name ?? (userInputs.name as string | undefined),
    chainId: chainIdValue ? String(chainIdValue) : undefined,
    status,
    environment: normalizeEnvironment(
      firstDefined(
        userInputs.network_type as string | undefined,
        userInputs.environment as string | undefined,
        extras?.network_type as string | undefined,
        extras?.environment as string | undefined,
      ),
    ),
    createdAt: firstDefined(
      overview.created_at,
      userInputs.created_at as string | undefined,
      userInputs.createdAt as string | undefined,
      userInputs.created_on as string | undefined,
    ),
    ownedBy: firstDefined(
      userInputs.owned_by as string | undefined,
      userInputs.ownedBy as string | undefined,
      extras?.ownedBy as string | undefined,
    ),
    agentId: firstDefined(
      extras?.agent_id as string | undefined,
      userInputs.agent_id as string | undefined,
      metadata?.agentId,
    ),
    analyticsId: firstDefined(
      extras?.analytics_id as string | undefined,
      userInputs.analytics_id as string | undefined,
    ),
  };
  const supernetSummary: SupernetSummary = {
    name: summary.serviceName,
    chainId: summary.chainId,
    environment: summary.environment,
    agentId: summary.agentId,
    analyticsId: summary.analyticsId,
    status: summary.status,
    createdAt: summary.createdAt,
    ownedBy: summary.ownedBy,
    serviceId: summary.serviceId,
    serviceName: summary.serviceName,
    userInputs,
    nodes: overview.nodes,
    overview,
  };
  return { summary, supernetSummary };
};

const extractSmartContracts = (
  blockchainDetails: PolygonCdkBlockchainDetailsData | null,
  contractContent?: Record<string, unknown>,
): { l1?: PolygonCdkSmartContract[]; l2?: PolygonCdkSmartContract[] } => {
  const baseContracts = blockchainDetails?.smartContracts ?? blockchainDetails?.smart_contracts ?? {};
  const baseL1 = normalizeContractList(baseContracts.l1);
  const baseL2 = normalizeContractList(baseContracts.l2);
  const artifactContracts = parseContractArtifact(contractContent);
  return {
    l1: mergeSmartContractLists(baseL1, artifactContracts.l1),
    l2: mergeSmartContractLists(baseL2, artifactContracts.l2),
  };
};

const extractBlockchainConfig = (
  rollupMetadata: PolygonRollupMetadata | undefined,
  blockchainDetails: PolygonCdkBlockchainDetailsData | null,
) => {
  const metadataConfig = (() => {
    if (!rollupMetadata) return undefined;
    const l2Record = ensureRecord(rollupMetadata.l2);
    const layerConfig = mergeRecordCandidates(
      l2Record?.config,
      l2Record?.configuration,
      l2Record?.configs,
      l2Record?.settings,
      l2Record?.extras,
      l2Record?.gasConfig,
      l2Record?.transactionConfig,
      (l2Record as Record<string, unknown> | undefined)?.gas_config,
      (l2Record as Record<string, unknown> | undefined)?.transaction_config,
      l2Record,
    );
    if (layerConfig) return layerConfig;
    return mergeRecordCandidates(
      rollupMetadata.config,
      rollupMetadata.configuration,
      rollupMetadata.configs,
      rollupMetadata.settings,
      rollupMetadata.gasConfig,
      rollupMetadata.transactionConfig,
    );
  })();
  if (metadataConfig) return metadataConfig;

  const artifacts = blockchainDetails?.artifacts;
  if (!artifacts?.length) return undefined;
  const configArtifact = findArtifact(artifacts, (name) => name.includes("rollup") && name.includes("config"));
  return (configArtifact?.content as Record<string, unknown>) ?? undefined;
};

const normalizeDashboard = (
  overview: PolygonCdkOverviewData | null,
  blockchainDetails: PolygonCdkBlockchainDetailsData | null,
): PolygonCdkDashboardData | undefined => {
  if (!overview && !blockchainDetails) return undefined;
  const nodes = overview?.nodes ?? [];
  const normalizedNodes = nodes.map(mapNode);
  const nodesByType = normalizedNodes.reduce<Partial<Record<NodeType, NormalizedNode[]>>>((acc, node) => {
    acc[node.nodeType] = acc[node.nodeType] ? [...(acc[node.nodeType] as NormalizedNode[]), node] : [node];
    return acc;
  }, {});
  const rpcNodeSource = nodes.find((node) => (node.node_type ?? "").toLowerCase().includes("rpc"));
  const rpcNode = rpcNodeSource ? mapNode(rpcNodeSource) : normalizedNodes.find((node) => node.nodeType === "rpc");
  const nodeCount = calculateNodeCount(nodes);
  const blockHeight = firstDefined(
    overview?.rollup_metadata?.l2?.blockHeight ? toNumber(overview.rollup_metadata.l2.blockHeight) : undefined,
    overview?.rollup_metadata?.l3?.blockHeight ? toNumber(overview.rollup_metadata.l3.blockHeight) : undefined,
    ...nodes.map((node) => deriveBlockHeightFromNode(node)),
  );
  const userInputs = (overview?.user_inputs as PolygonRollupUserInputs) ?? {};
  const rollupMetadata = overview?.rollup_metadata;
  const { summary, supernetSummary } = deriveSummary(overview, userInputs, rollupMetadata);
  const health: "healthy" | "unhealthy" | "NA" =
    summary?.status === "ready" ? (blockHeight ? "healthy" : "unhealthy") : "NA";
  const collections = parseWalletArtifacts(blockchainDetails?.artifacts);
  const l1LayerRecord = ensureRecord(rollupMetadata?.l1);
  const l2LayerRecord = ensureRecord(rollupMetadata?.l2);
  const contractArtifact = blockchainDetails?.artifacts
    ? findArtifact(blockchainDetails.artifacts, (name) => name.includes("contract"))
    : undefined;
  const contractContent = ensureRecord(contractArtifact?.content);
  const chainInfo = ensureRecord(
    contractContent?.chainInfo ?? contractContent?.chain_info ?? contractContent?.ChainInfo,
  );
  const readChainInfoField = (keys: string[]): string | undefined => {
    if (!chainInfo) return undefined;
    for (const key of keys) {
      const value = chainInfo[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
    return undefined;
  };
  const metadataExplorerL1 = firstDefined(
    rollupMetadata?.l1?.explorerUrl,
    l1LayerRecord?.explorer_url as string | undefined,
  );
  const metadataExplorerL2 = firstDefined(
    rollupMetadata?.l2?.explorerUrl,
    l2LayerRecord?.explorer_url as string | undefined,
  );
  const metadataRpcL1 = firstDefined(
    rollupMetadata?.l1?.rpcUrl,
    rollupMetadata?.l1?.rpcUrls,
    l1LayerRecord?.rpc_url as string | undefined,
    l1LayerRecord?.rpcUrls as string | undefined,
    l1LayerRecord?.rpc_urls as string | undefined,
  );
  const metadataRpcL2 = firstDefined(
    rollupMetadata?.l2?.rpcUrl,
    rollupMetadata?.l2?.rpcUrls,
    l2LayerRecord?.rpc_url as string | undefined,
    l2LayerRecord?.rpcUrls as string | undefined,
    l2LayerRecord?.rpc_urls as string | undefined,
  );
  const wallets = {
    sequencer: deriveWalletHighlight("sequencer", collections, rollupMetadata?.wallets),
    aggregator: deriveWalletHighlight("aggregator", collections, rollupMetadata?.wallets),
    explorerL1:
      metadataExplorerL1 ??
      readChainInfoField(["parentExplorerUrl", "parent_explorer_url", "l1ExplorerUrl", "l1_explorer_url"]),
    explorerL2:
      metadataExplorerL2 ?? readChainInfoField(["explorerUrl", "explorer_url", "l2ExplorerUrl", "l2_explorer_url"]),
    rpcL1: metadataRpcL1 ?? readChainInfoField(["parentRpcUrl", "parent_rpc_url", "l1RpcUrl", "l1_rpc_url", "l1Url"]),
    rpcL2: metadataRpcL2 ?? readChainInfoField(["rpcUrl", "rpc_url", "l2RpcUrl", "l2_rpc_url", "url"]),
    collections,
  };
  const smartContracts = extractSmartContracts(blockchainDetails, contractContent);
  const cloudInfra = deriveCloudInfra(overview, blockchainDetails);
  const bridge = deriveBridgeInfo(rollupMetadata);
  const apps = extractAppsConfig(overview, blockchainDetails);
  const genesis = extractGenesisFile(blockchainDetails);
  const l1Info = rollupMetadata?.l1
    ? {
        chainId: rollupMetadata.l1.chainId ? String(rollupMetadata.l1.chainId) : undefined,
        currency: rollupMetadata.l1.symbol,
        sequencerBalance: wallets.sequencer?.balance,
        aggregatorBalance: wallets.aggregator?.balance,
        createdAt: overview?.created_at,
      }
    : undefined;
  return {
    overview,
    blockchainDetails,
    summary,
    supernetSummary,
    nodes: normalizedNodes,
    nodesByType,
    nodeCount,
    rpcNode,
    userInputs,
    rollupMetadata,
    blockHeight,
    health,
    wallets,
    l1Info,
    blockchainConfig: extractBlockchainConfig(rollupMetadata, blockchainDetails),
    smartContracts: {
      ...smartContracts,
      explorerL1: wallets.explorerL1,
      explorerL2: wallets.explorerL2,
    },
    cloudInfra,
    bridge,
    apps,
    genesis,
  };
};

type ProviderProps = {
  serviceId?: string;
  children: ReactNode;
};

const PolygonCdkDashboardProvider = ({ serviceId, children }: ProviderProps) => {
  const [lastUpdated, setLastUpdated] = useState<number | undefined>(undefined);
  const setSuperNetInfo = useSuperNetStore((store) => store.setSuperNetInfo);
  const { supernet } = usePolygonValidiumService();
  const { request: overviewRequest } = supernet.supernetInfo(serviceId);
  const { request: blockchainDetailsRequest } = supernet.blockchainDetails(serviceId);

  const overviewData = (overviewRequest.data?.data as PolygonCdkOverviewData | undefined) ?? null;
  const blockchainDetailsData =
    (blockchainDetailsRequest.data?.data as PolygonCdkBlockchainDetailsData | undefined) ?? null;

  const normalized = useMemo(
    () => normalizeDashboard(overviewData, blockchainDetailsData),
    [overviewData, blockchainDetailsData],
  );

  const overviewPending = Boolean(overviewRequest.isLoading || overviewRequest.isValidating);
  const blockchainPending = Boolean(blockchainDetailsRequest.isLoading || blockchainDetailsRequest.isValidating);
  const isLoading = Boolean(serviceId) && (overviewPending || blockchainPending);

  const errorMessage = useMemo(() => {
    if (!serviceId) return "Missing service id";
    const sourceError = overviewRequest.error ?? blockchainDetailsRequest.error;
    if (!sourceError) return undefined;
    if (typeof sourceError === "string") return sourceError;
    if (sourceError instanceof Error) return sourceError.message;
    return "Unknown error";
  }, [serviceId, overviewRequest.error, blockchainDetailsRequest.error]);

  useEffect(() => {
    if (!serviceId) {
      setSuperNetInfo(false, undefined);
      return;
    }
    if (isLoading) {
      setSuperNetInfo(true, undefined);
      return;
    }
    setSuperNetInfo(false, normalized?.supernetSummary);
  }, [serviceId, isLoading, normalized?.supernetSummary, setSuperNetInfo]);

  useEffect(() => {
    if (!isLoading && (overviewData || blockchainDetailsData)) {
      setLastUpdated(Date.now());
    }
  }, [isLoading, overviewData, blockchainDetailsData]);

  const refresh = useCallback(async () => {
    if (!serviceId) return;
    await Promise.all([
      overviewRequest.mutate ? overviewRequest.mutate() : Promise.resolve(),
      blockchainDetailsRequest.mutate ? blockchainDetailsRequest.mutate() : Promise.resolve(),
    ]);
  }, [serviceId, overviewRequest.mutate, blockchainDetailsRequest.mutate]);

  const value = useMemo<PolygonCdkDashboardContextValue>(
    () => ({
      overview: overviewData,
      blockchainDetails: blockchainDetailsData,
      normalized,
      isLoading,
      error: errorMessage,
      lastUpdated,
      refresh,
    }),
    [overviewData, blockchainDetailsData, normalized, isLoading, errorMessage, lastUpdated, refresh],
  );

  return <PolygonCdkDashboardContext.Provider value={value}>{children}</PolygonCdkDashboardContext.Provider>;
};

const usePolygonCdkDashboard = () => {
  const context = useContext(PolygonCdkDashboardContext);
  if (!context) {
    throw new Error("usePolygonCdkDashboard must be used within PolygonCdkDashboardProvider");
  }
  return context;
};

export type {
  PolygonCdkDashboardData,
  PolygonCdkOverviewData,
  PolygonCdkBlockchainDetailsData,
  PolygonCdkSmartContract,
  WalletCollections,
  WalletHighlight,
};
export { PolygonCdkDashboardProvider, usePolygonCdkDashboard };
