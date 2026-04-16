import type { RollupConfig, RollupKey, Status } from "./types";
import { withBasePath } from "@/utils/helpers";
import { getPartnerIconPath } from "@/modules/arbitrum-orbit/constants/partner-icons";

const noop = async () => "unknown" as Status;

export const rollupRegistry: Record<RollupKey, RollupConfig> = {
  "arbitrum-orbit": {
    key: "arbitrum-orbit",
    displayName: "Arbitrum Orbit",
    logo: withBasePath(getPartnerIconPath("arbitrum-orbit")),
    settlementLayerOptions: [{ value: "ethereum", label: "Ethereum" }],
    dataAvailabilityOptions: [
      { value: "ethereum", label: "Ethereum" },
      { value: "celestia", label: "Celestia" },
      { value: "avail", label: "Avail" },
    ],
    coreComponents: [
      { id: "execution", label: "Execution", required: true },
      { id: "bridge", label: "Bridge" },
      { id: "block-explorer", label: "Block Explorer" },
      { id: "oracles", label: "Oracles" },
    ],
    apis: {
      // For now, status check delegates to an inert function. Existing pages/services handle specifics.
      checkStatus: noop,
    },
  },
  opstack: {
    key: "opstack",
    displayName: "OP Stack",
    logo: withBasePath("/assets/images/protocols/optimism-icon.svg"),
    settlementLayerOptions: [{ value: "ethereum", label: "Ethereum" }],
    dataAvailabilityOptions: [
      { value: "ethereum", label: "Ethereum" },
      { value: "eigen", label: "Eigen DA" },
    ],
    coreComponents: [
      { id: "execution", label: "Execution", required: true },
      { id: "bridge", label: "Bridge" },
      { id: "block-explorer", label: "Block Explorer" },
    ],
    apis: { checkStatus: noop },
  },
  "polygon-cdk": {
    key: "polygon-cdk",
    displayName: "Polygon CDK",
    logo: withBasePath("/assets/images/protocols/polygon-icon.svg"),
    settlementLayerOptions: [{ value: "ethereum", label: "Ethereum" }],
    dataAvailabilityOptions: [
      { value: "ethereum", label: "Ethereum" },
      { value: "celestia", label: "Celestia" },
    ],
    coreComponents: [
      { id: "execution", label: "Execution", required: true },
      { id: "bridge", label: "Bridge" },
      { id: "block-explorer", label: "Block Explorer" },
    ],
    apis: { checkStatus: noop },
  },
  zksync: {
    key: "zksync",
    displayName: "zkSync Hyperchains",
    logo: withBasePath("/assets/images/protocols/zksync-era-icon.svg"),
    settlementLayerOptions: [{ value: "ethereum", label: "Ethereum" }],
    dataAvailabilityOptions: [{ value: "ethereum", label: "Ethereum" }],
    coreComponents: [
      { id: "execution", label: "Execution", required: true },
      { id: "bridge", label: "Bridge" },
      { id: "block-explorer", label: "Block Explorer" },
    ],
    apis: { checkStatus: noop },
  },
};

export const getRollupConfig = (key: string | undefined | null): RollupConfig | undefined => {
  if (!key) return undefined;
  const normalized = key.toLowerCase() as RollupKey;
  return rollupRegistry[normalized];
};
