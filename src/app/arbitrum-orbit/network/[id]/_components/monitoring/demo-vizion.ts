"use client";
import {
  ARBITRUM_DEMO_SERVICE_ID,
  ARBITRUM_DEMO_VIZION_HOST_ID,
  ARBITRUM_DEMO_VIZION_TOKEN,
} from "@/constants/arbitrum";
import { getConfig } from "@/config";
import type { HostData } from "@/store/vizionUser";

let hasLoggedEnv = false;

const logDemoEnvState = () => {
  if (hasLoggedEnv) return;
  hasLoggedEnv = true;
  const config = getConfig();
  const baseUrl = config?.url?.external?.vizion?.backend ?? "";
  const tokenLength = ARBITRUM_DEMO_VIZION_TOKEN ? ARBITRUM_DEMO_VIZION_TOKEN.length : 0;
  const hostId = ARBITRUM_DEMO_VIZION_HOST_ID;
  const payload = {
    hasBaseUrl: Boolean(baseUrl),
    tokenLength,
    hostId: hostId || "",
  };
  if (!baseUrl || !tokenLength || !hostId) {
    console.warn("[Arbitrum Demo Vizion] Missing env values.", payload);
    return;
  }
  console.info("[Arbitrum Demo Vizion] Env values loaded.", payload);
};

const isArbitrumDemoNetwork = (networkId?: string) => Boolean(networkId && networkId === ARBITRUM_DEMO_SERVICE_ID);

const getArbitrumDemoHost = (): HostData => {
  logDemoEnvState();
  return {
    nodeName: "Arbitrum Demo",
    hostIds: [ARBITRUM_DEMO_VIZION_HOST_ID],
    primaryHost: ARBITRUM_DEMO_VIZION_HOST_ID,
    networkId: ARBITRUM_DEMO_SERVICE_ID,
  };
};

const getArbitrumDemoVizionToken = () => {
  logDemoEnvState();
  return ARBITRUM_DEMO_VIZION_TOKEN;
};

const getArbitrumDemoVizionUrl = (path: string) => {
  logDemoEnvState();
  const config = getConfig();
  const baseUrl = config?.url?.external?.vizion?.backend ?? "";
  return `${baseUrl}${path}`;
};

export { getArbitrumDemoHost, getArbitrumDemoVizionToken, getArbitrumDemoVizionUrl, isArbitrumDemoNetwork };
