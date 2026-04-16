"use client";
import { usePathname } from "next/navigation";

type SupportedRollupType = "arbitrum-orbit" | "opstack";

const DEFAULT_ROLLUP_TYPE: SupportedRollupType = "arbitrum-orbit";

const normalizeRollupType = (rollupType?: string | null): SupportedRollupType | undefined => {
  if (rollupType === "arbitrum-orbit" || rollupType === "opstack") {
    return rollupType;
  }

  return undefined;
};

const resolveRollupTypeFromPathname = (pathname?: string | null): SupportedRollupType | undefined => {
  if (!pathname) {
    return undefined;
  }

  if (pathname.startsWith("/opstack")) {
    return "opstack";
  }

  if (pathname.startsWith("/arbitrum-orbit")) {
    return "arbitrum-orbit";
  }

  return undefined;
};

const useResolvedRollupType = (rollupType?: SupportedRollupType) => {
  const pathname = usePathname();

  return normalizeRollupType(rollupType) ?? resolveRollupTypeFromPathname(pathname) ?? DEFAULT_ROLLUP_TYPE;
};

export type { SupportedRollupType };
export { DEFAULT_ROLLUP_TYPE, normalizeRollupType, resolveRollupTypeFromPathname, useResolvedRollupType };
