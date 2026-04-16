"use client";
import type { NodeNetworkStates, NodeType } from "@/types/node";

// Shared helper utilities for rollup dashboard contexts (Polygon CDK, ZkSync, etc.)

const BLOCK_HEIGHT_KEYS = [
  "block_height",
  "blockHeight",
  "block_number",
  "blockNumber",
  "l2_block_number",
  "l2BlockNumber",
];

const ensureRecord = (value: unknown): Record<string, unknown> | undefined => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return undefined;
};

const firstDefined = <T>(...values: Array<T | undefined | null>): T | undefined => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      return value as T;
    }
  }
  return undefined;
};

const parseBoolean = (value?: unknown): boolean | undefined => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(normalized)) return true;
    if (["false", "0", "no", "n"].includes(normalized)) return false;
  }
  return undefined;
};

const normalizeUrl = (value?: string): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const toNumber = (value?: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return undefined;
};

const normalizeStatus = (status?: string): NodeNetworkStates | undefined => {
  if (!status) return undefined;
  const normalized = status.toLowerCase();
  if (["running", "ready", "active", "success"].includes(normalized)) return "ready";
  if (["deploying", "provisioning"].includes(normalized)) return "provisioning";
  if (["failed", "error"].includes(normalized)) return "failed";
  if (["deleting", "deleted"].includes(normalized)) return "deleted";
  return normalized as NodeNetworkStates;
};

const resolveNodeType = (nodeType?: string): NodeType => {
  const normalized = (nodeType ?? "").toLowerCase();
  if (normalized.includes("zkevm")) return "zkevm";
  if (normalized.includes("zksync")) return "zksync";
  if (normalized.includes("prover")) return "prover";
  if (normalized.includes("dac")) return "dac";
  if (normalized.includes("validator")) return "validator";
  if (normalized.includes("sentry")) return "sentry";
  if (normalized.includes("full")) return "full";
  if (normalized.includes("archive")) return "archive";
  return "rpc";
};

const sanitizeEndpointHost = (endpoint?: string | boolean | null) => {
  if (!endpoint || typeof endpoint !== "string") return undefined;
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
  const httpEndpoint = host.startsWith("http") ? host : `https://${host}`;
  const wsEndpoint = host.startsWith("ws") ? host : `wss://${host}`;
  return {
    http: { enabled: true, endpoint: httpEndpoint },
    ws: { enabled: true, endpoint: wsEndpoint },
  };
};

const deriveBlockHeightFromNode = (node?: { metadata?: unknown }) => {
  if (!node) return undefined;
  const metadata = ensureRecord(node.metadata);
  if (metadata) {
    for (const key of BLOCK_HEIGHT_KEYS) {
      const value = metadata[key];
      const parsed = toNumber(value);
      if (parsed !== undefined) return parsed;
    }
    const metrics = ensureRecord((metadata as Record<string, unknown>).metrics);
    if (metrics) {
      for (const key of BLOCK_HEIGHT_KEYS) {
        const value = metrics[key];
        const parsed = toNumber(value);
        if (parsed !== undefined) return parsed;
      }
    }
  }
  return undefined;
};

const isHexAddress = (value?: unknown): value is string =>
  typeof value === "string" && /^0x[a-fA-F0-9]{40}$/i.test(value);

const humanizeKey = (raw?: string) => {
  if (!raw) return undefined;
  return raw
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export {
  BLOCK_HEIGHT_KEYS,
  ensureRecord,
  firstDefined,
  parseBoolean,
  normalizeUrl,
  toNumber,
  normalizeStatus,
  resolveNodeType,
  sanitizeEndpointHost,
  buildRpcAccess,
  deriveBlockHeightFromNode,
  isHexAddress,
  humanizeKey,
};
