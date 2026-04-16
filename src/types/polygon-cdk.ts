"use client";
import { NodeNetworkStates, NodeType } from "@/types/node";

type PolygonRollupUserInputs = Record<string, unknown>;

type PolygonRollupNode = {
  id?: number | string;
  nodid?: string;
  name?: string;
  node_type?: string;
  status?: NodeNetworkStates | string;
  endpoint_url?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
};

type PolygonRollupOverview = {
  service_id?: number;
  service_name?: string;
  user_inputs?: PolygonRollupUserInputs;
  nodes?: PolygonRollupNode[];
  rollup_metadata?: Record<string, unknown>;
};

type PolygonRollupNodeSummary = {
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

type PolygonRollupNodeCount = {
  total?: number;
} & Partial<Record<NodeType, number>>;

type PolygonBlockchainArtifact = {
  name?: string;
  is_json?: boolean;
  content?: unknown;
};

type PolygonBlockchainDetails = {
  service_id?: number;
  service_name?: string;
  user_inputs?: PolygonRollupUserInputs;
  artifacts?: PolygonBlockchainArtifact[];
};

export type {
  PolygonBlockchainArtifact,
  PolygonBlockchainDetails,
  PolygonRollupNode,
  PolygonRollupNodeCount,
  PolygonRollupNodeSummary,
  PolygonRollupOverview,
  PolygonRollupUserInputs,
};
