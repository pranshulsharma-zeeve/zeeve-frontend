"use client";
import { OPSTACK_DEMO_SERVICE_ID, OPSTACK_DEMO_VIZION_HOST_ID, OPSTACK_DEMO_VIZION_TOKEN } from "@/constants/opstack";
import { getConfig } from "@/config";
import type { HostData } from "@/store/vizionUser";

let hasLoggedEnv = false;

const logDemoEnvState = () => {
  if (hasLoggedEnv) return;
  hasLoggedEnv = true;
  const config = getConfig();
  const baseUrl = config?.url?.external?.vizion?.backend ?? "";
  const tokenLength = OPSTACK_DEMO_VIZION_TOKEN ? OPSTACK_DEMO_VIZION_TOKEN.length : 0;
  const hostId = OPSTACK_DEMO_VIZION_HOST_ID;
  const payload = {
    hasBaseUrl: Boolean(baseUrl),
    tokenLength,
    hostId: hostId || "",
  };
  if (!baseUrl || !tokenLength || !hostId) {
    console.warn("[OP Stack Demo Vizion] Missing env values.", payload);
    return;
  }
  console.info("[OP Stack Demo Vizion] Env values loaded.", payload);
};

const isOpStackDemoNetwork = (networkId?: string) => Boolean(networkId && networkId === OPSTACK_DEMO_SERVICE_ID);

const getOpStackDemoHost = (): HostData => {
  logDemoEnvState();
  return {
    nodeName: "OP Stack Demo",
    hostIds: [OPSTACK_DEMO_VIZION_HOST_ID],
    primaryHost: OPSTACK_DEMO_VIZION_HOST_ID,
    networkId: OPSTACK_DEMO_SERVICE_ID,
  };
};

const getOpStackDemoVizionToken = () => {
  logDemoEnvState();
  return OPSTACK_DEMO_VIZION_TOKEN;
};

const getOpStackDemoVizionUrl = (path: string) => {
  logDemoEnvState();
  const config = getConfig();
  const baseUrl = config?.url?.external?.vizion?.backend ?? "";
  return `${baseUrl}${path}`;
};

export { getOpStackDemoHost, getOpStackDemoVizionToken, getOpStackDemoVizionUrl, isOpStackDemoNetwork };
