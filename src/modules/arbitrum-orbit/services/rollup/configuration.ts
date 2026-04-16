"use client";
import useSWRImmutable from "swr/immutable";
import useFetcher from "@orbit/hooks/use-fetcher";
import { withApiBasePath } from "@/constants/api";

export type OrbitConfigurationResponse = {
  success: boolean;
  data: Record<string, unknown>;
  error?: string;
};

const useOrbitRollupConfiguration = (type: string = "arbitrum-orbit") => {
  const url = withApiBasePath(`/rollup/configuration?type=${encodeURIComponent(type)}`);
  const fetcher = useFetcher();
  const request = useSWRImmutable<OrbitConfigurationResponse>(url, fetcher, { shouldRetryOnError: false });
  return { url, request };
};

export default useOrbitRollupConfiguration;
