"use client";
import { ZKSYNC_DEMO_SERVICE_ID, ZKSYNC_DEMO_VIZION_HOST_ID, ZKSYNC_DEMO_VIZION_TOKEN } from "@/constants/zksync";
import { getConfig } from "@/config";
import type { HostData } from "@/store/vizionUser";

let hasLoggedEnv = false;

const logDemoEnvState = () => {
  if (hasLoggedEnv) return;
  hasLoggedEnv = true;
  const config = getConfig();
  const baseUrl = config?.url?.external?.vizion?.backend ?? "";
  const tokenLength = ZKSYNC_DEMO_VIZION_TOKEN ? ZKSYNC_DEMO_VIZION_TOKEN.length : 0;
  const hostId = ZKSYNC_DEMO_VIZION_HOST_ID;
  const payload = {
    hasBaseUrl: Boolean(baseUrl),
    tokenLength,
    hostId: hostId || "",
  };
  if (!baseUrl || !tokenLength || !hostId) {
    console.warn("[ZkSync Demo Vizion] Missing env values.", payload);
    return;
  }
  console.info("[ZkSync Demo Vizion] Env values loaded.", payload);
};

const isZkSyncDemoNetwork = (networkId?: string) => Boolean(networkId && networkId === ZKSYNC_DEMO_SERVICE_ID);

const getZkSyncDemoHost = (): HostData => {
  logDemoEnvState();
  return {
    nodeName: "zkSync Demo",
    hostIds: [ZKSYNC_DEMO_VIZION_HOST_ID],
    primaryHost: ZKSYNC_DEMO_VIZION_HOST_ID,
    networkId: ZKSYNC_DEMO_SERVICE_ID,
    RPC: [ZKSYNC_DEMO_VIZION_HOST_ID],
    Bridge: [ZKSYNC_DEMO_VIZION_HOST_ID],
    Explorer: [ZKSYNC_DEMO_VIZION_HOST_ID],
    Prover: [ZKSYNC_DEMO_VIZION_HOST_ID],
    Backup: [ZKSYNC_DEMO_VIZION_HOST_ID],
    Core: [ZKSYNC_DEMO_VIZION_HOST_ID],
  };
};

const getZkSyncDemoVizionToken = () => {
  logDemoEnvState();
  return ZKSYNC_DEMO_VIZION_TOKEN;
};

const getZkSyncDemoVizionUrl = (path: string) => {
  logDemoEnvState();
  const config = getConfig();
  const baseUrl = config?.url?.external?.vizion?.backend ?? "";
  return `${baseUrl}${path}`;
};

export { getZkSyncDemoHost, getZkSyncDemoVizionToken, getZkSyncDemoVizionUrl, isZkSyncDemoNetwork };
