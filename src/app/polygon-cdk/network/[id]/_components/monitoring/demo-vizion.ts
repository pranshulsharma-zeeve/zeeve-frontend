"use client";
import { getConfig } from "@/config";
import type { HostData } from "@/store/vizionUser";
import {
  POLYGON_CDK_DEMO_SERVICE_ID,
  POLYGON_CDK_DEMO_VIZION_HOST_ID,
  POLYGON_CDK_DEMO_VIZION_TOKEN,
} from "@/constants/polygon-cdk";

let hasLoggedEnv = false;

const logDemoEnvState = () => {
  if (hasLoggedEnv) return;
  hasLoggedEnv = true;
  const config = getConfig();
  const baseUrl = config?.url?.external?.vizion?.backend ?? "";
  const tokenLength = POLYGON_CDK_DEMO_VIZION_TOKEN ? POLYGON_CDK_DEMO_VIZION_TOKEN.length : 0;
  const hostId = POLYGON_CDK_DEMO_VIZION_HOST_ID;
  const payload = {
    hasBaseUrl: Boolean(baseUrl),
    tokenLength,
    hostId: hostId || "",
  };
  if (!baseUrl || !tokenLength || !hostId) {
    console.warn("[Polygon CDK Demo Vizion] Missing env values.", payload);
    return;
  }
  console.info("[Polygon CDK Demo Vizion] Env values loaded.", payload);
};

const isPolygonCdkDemoNetwork = (networkId?: string) =>
  Boolean(networkId && POLYGON_CDK_DEMO_SERVICE_ID && networkId === POLYGON_CDK_DEMO_SERVICE_ID);

const getPolygonCdkDemoHost = (): HostData => {
  logDemoEnvState();
  return {
    nodeName: "Polygon CDK Demo",
    hostIds: [POLYGON_CDK_DEMO_VIZION_HOST_ID],
    primaryHost: POLYGON_CDK_DEMO_VIZION_HOST_ID,
    networkId: POLYGON_CDK_DEMO_SERVICE_ID,
    RPC: [POLYGON_CDK_DEMO_VIZION_HOST_ID],
    Bridge: [POLYGON_CDK_DEMO_VIZION_HOST_ID],
    Explorer: [POLYGON_CDK_DEMO_VIZION_HOST_ID],
    Prover: [POLYGON_CDK_DEMO_VIZION_HOST_ID],
    Backup: [POLYGON_CDK_DEMO_VIZION_HOST_ID],
    Core: [POLYGON_CDK_DEMO_VIZION_HOST_ID],
  };
};

const getPolygonCdkDemoVizionToken = () => {
  logDemoEnvState();
  return POLYGON_CDK_DEMO_VIZION_TOKEN;
};

const getPolygonCdkDemoVizionUrl = (path: string) => {
  logDemoEnvState();
  const config = getConfig();
  const baseUrl = config?.url?.external?.vizion?.backend ?? "";
  return `${baseUrl}${path}`;
};

export { getPolygonCdkDemoHost, getPolygonCdkDemoVizionToken, getPolygonCdkDemoVizionUrl, isPolygonCdkDemoNetwork };
