/**
 * Helper utilities for validator dashboard
 * Token formatting/conversion and protocol detection.
 */

// Token conversion helpers
const YOCTO_NEAR_FACTOR = BigInt("1000000000000000000000000");

export const convertYoctoNearToNumber = (value?: string | number): number | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  try {
    const raw = typeof value === "string" ? value.trim() : Math.trunc(value).toString();

    if (!raw) {
      return undefined;
    }

    const normalized = raw.includes(".") ? raw.split(".")[0] : raw;
    const big = BigInt(normalized || "0");
    const whole = Number(big / YOCTO_NEAR_FACTOR);
    const remainder = Number(big % YOCTO_NEAR_FACTOR);

    return whole + remainder / 1e24;
  } catch {
    return undefined;
  }
};

// Formatting helpers
export const formatTokenValue = (value: string | number | undefined, tokenSymbol: string): string => {
  if (value === undefined || value === null) {
    return `N/A ${tokenSymbol}`;
  }

  const numeric = typeof value === "string" ? Number.parseFloat(value) : value;

  if (Number.isFinite(numeric)) {
    // Truncate to 2 decimal places without rounding
    const truncated = Math.floor(numeric * 100) / 100;
    return `${truncated.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${tokenSymbol}`;
  }

  return `${value} ${tokenSymbol}`;
};

export const formatPercent = (value?: number): string => {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return "N/A";
  }

  // Truncate to 2 decimal places without rounding
  const truncated = Math.floor(value * 100) / 100;
  return `${truncated.toFixed(2)}%`;
};

export const formatPlainNumber = (value?: number): string => {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return "N/A";
  }

  return value.toLocaleString("en-US");
};

// Protocol helpers
export type ProtocolType =
  | "near"
  | "cosmos"
  | "coreum"
  | "avalanche"
  | "subsquid"
  | "injective"
  | "skale"
  | "flow"
  | "energyweb"
  | "theta"
  | "solana"
  | "xdc"
  | "other";

export const normalizeProtocol = (protocolName: string): string => {
  return protocolName.trim().toLowerCase();
};

export const getProtocolType = (protocolName: string): ProtocolType => {
  const normalized = normalizeProtocol(protocolName);

  if (normalized === "near") return "near";
  if (normalized === "cosmos") return "cosmos";
  if (normalized === "coreum") return "coreum";
  if (normalized === "avalanche") return "avalanche";
  if (normalized === "flow") return "flow";
  if (normalized === "subsquid") return "subsquid";
  if (normalized === "injective") return "injective";
  if (normalized === "skale") return "skale";
  if (normalized === "flow") return "flow";
  if (normalized === "energyweb" || normalized === "ewx") return "energyweb";
  if (normalized === "theta") return "theta";
  if (normalized === "solana") return "solana";
  if (normalized === "xdc") return "xdc";

  return "other";
};

export const isNearProtocol = (protocolName: string): boolean => {
  return getProtocolType(protocolName) === "near";
};

export const isCoreumProtocol = (protocolName: string): boolean => {
  return getProtocolType(protocolName) === "coreum";
};

export const isAvalancheProtocol = (protocolName: string): boolean => {
  return getProtocolType(protocolName) === "avalanche";
};

export const isFlowProtocol = (protocolName: string): boolean => {
  return getProtocolType(protocolName) === "flow";
};

export const isSubsquidProtocol = (protocolName: string): boolean => {
  return getProtocolType(protocolName) === "subsquid";
};

export const isInjectiveProtocol = (protocolName: string): boolean => {
  return getProtocolType(protocolName) === "injective";
};

export const isSkaleProtocol = (protocolName: string): boolean => {
  return getProtocolType(protocolName) === "skale";
};

export const isEnergyWebProtocol = (protocolName: string): boolean => {
  return getProtocolType(protocolName) === "energyweb";
};

export const isThetaProtocol = (protocolName: string): boolean => {
  return getProtocolType(protocolName) === "theta";
};

export const isSolanaProtocol = (protocolName: string): boolean => {
  return getProtocolType(protocolName) === "solana";}
export const isXdcProtocol = (protocolName: string): boolean => {
  return getProtocolType(protocolName) === "xdc";
};
// Utility functions for safe number parsing
export const safeParseNumber = (value?: string | number): number => {
  if (value === undefined || value === null) {
    return 0;
  }

  const numeric = typeof value === "number" ? value : Number.parseFloat(String(value));
  return Number.isFinite(numeric) ? numeric : 0;
};

export const normalizeAndParseToken = (raw?: string | number, protocolName?: string): number => {
  if (raw === undefined || raw === null) {
    return 0;
  }

  // Apply NEAR-specific conversion if needed
  if (protocolName && isNearProtocol(protocolName)) {
    const converted = convertYoctoNearToNumber(raw);
    if (converted !== undefined) {
      return converted;
    }
  }

  return safeParseNumber(raw);
};

// Protocol feature configuration
export interface ProtocolChartConfig {
  showStakeDistribution: boolean;
  showPerformance: boolean;
  showRewards: boolean;
  showStakeDelegators: boolean;
  showValidationCountdown: boolean;
  showValidatorDetails: boolean;
  showRestakeInfo: boolean;
}

export interface ProtocolFieldsConfig {
  fields: Array<{ key: string; label: string }>;
}

export type ProtocolFeatureMap = {
  [key in ProtocolType]: {
    charts: ProtocolChartConfig;
    supportsPerformanceData: boolean;
    supportsRewardsData: boolean;
    supportsStakeData: boolean;
  };
};

export const PROTOCOL_FEATURE_MAP: ProtocolFeatureMap = {
  cosmos: {
    charts: {
      showStakeDistribution: false,
      showPerformance: true,
      showRewards: true,
      showStakeDelegators: true,
      showValidationCountdown: false,
      showValidatorDetails: false,
      showRestakeInfo: false,
    },
    supportsPerformanceData: true,
    supportsRewardsData: true,
    supportsStakeData: true,
  },
  coreum: {
    charts: {
      showStakeDistribution: true,
      showPerformance: true,
      showRewards: true,
      showStakeDelegators: true,
      showValidationCountdown: false,
      showValidatorDetails: true,
      showRestakeInfo: true,
    },
    supportsPerformanceData: true,
    supportsRewardsData: true,
    supportsStakeData: true,
  },
  avalanche: {
    charts: {
      showStakeDistribution: true,
      showPerformance: false,
      showRewards: true,
      showStakeDelegators: true,
      showValidationCountdown: true,
      showValidatorDetails: false,
      showRestakeInfo: false,
    },
    supportsPerformanceData: false,
    supportsRewardsData: true,
    supportsStakeData: true,
  },
  flow: {
    charts: {
      showStakeDistribution: true,
      showPerformance: false,
      showRewards: true,
      showStakeDelegators: true,
      showValidationCountdown: false,
      showValidatorDetails: false,
      showRestakeInfo: false,
    },
    supportsPerformanceData: false,
    supportsRewardsData: true,
    supportsStakeData: true,
  },
  near: {
    charts: {
      showStakeDistribution: false,
      showPerformance: true,
      showRewards: false,
      showStakeDelegators: true,
      showValidationCountdown: false,
      showValidatorDetails: false,
      showRestakeInfo: false,
    },
    supportsPerformanceData: true,
    supportsRewardsData: true,
    supportsStakeData: true,
  },
  subsquid: {
    charts: {
      showStakeDistribution: true,
      showPerformance: false,
      showRewards: true,
      showStakeDelegators: true,
      showValidationCountdown: false,
      showValidatorDetails: true,
      showRestakeInfo: false,
    },
    supportsPerformanceData: false,
    supportsRewardsData: true,
    supportsStakeData: true,
  },
  injective: {
    charts: {
      showStakeDistribution: true,
      showPerformance: true,
      showRewards: true,
      showStakeDelegators: true,
      showValidationCountdown: false,
      showValidatorDetails: false,
      showRestakeInfo: false,
    },
    supportsPerformanceData: true,
    supportsRewardsData: true,
    supportsStakeData: true,
  },
  skale: {
    charts: {
      showStakeDistribution: true,
      showPerformance: false,
      showRewards: true,
      showStakeDelegators: true,
      showValidationCountdown: false,
      showValidatorDetails: false,
      showRestakeInfo: false,
    },
    supportsPerformanceData: true,
    supportsRewardsData: true,
    supportsStakeData: true,
  },
  energyweb: {
    charts: {
      showStakeDistribution: true,
      showPerformance: false,
      showRewards: true,
      showStakeDelegators: true,
      showValidationCountdown: false,
      showValidatorDetails: false,
      showRestakeInfo: true,
    },
    supportsPerformanceData: false,
    supportsRewardsData: true,
    supportsStakeData: true,
  },
  theta: {
    charts: {
      showStakeDistribution: false,
      showPerformance: false,
      showRewards: false,
      showStakeDelegators: false,
      showValidationCountdown: false,
      showValidatorDetails: false,
      showRestakeInfo: false,
    },
    supportsPerformanceData: false,
    supportsRewardsData: false,
    supportsStakeData: false,
  },
  solana: {
    charts: {
      showStakeDistribution: false,
      showPerformance: false,
      showRewards: true,
      showStakeDelegators: true,
      showValidationCountdown: false,
      showValidatorDetails: false,
      showRestakeInfo: false,
    },
    supportsPerformanceData: false,
    supportsRewardsData: true,
    supportsStakeData: true,
  },
  xdc: {
    charts: {
      showStakeDistribution: false,
      showPerformance: false,
      showRewards: false,
      showStakeDelegators: false,
      showValidationCountdown: false,
      showValidatorDetails: false,
      showRestakeInfo: false,
    },
    supportsPerformanceData: false,
    supportsRewardsData: false,
    supportsStakeData: false,
  },
  other: {
    charts: {
      showStakeDistribution: false,
      showPerformance: false,
      showRewards: false,
      showStakeDelegators: false,
      showValidationCountdown: false,
      showValidatorDetails: false,
      showRestakeInfo: false,
    },
    supportsPerformanceData: false,
    supportsRewardsData: false,
    supportsStakeData: false,
  },
};
