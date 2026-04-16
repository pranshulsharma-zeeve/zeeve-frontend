"use client";
import useSWRImmutable from "swr/immutable";
import useFetcher from "@orbit/hooks/use-fetcher";
import { withApiBasePath } from "@/constants/api";

export type OrbitService = {
  id: number;
  service_id: string;
  chain_id?: string | null;
  name: string;
  status: string;
  // Flattened fields (may be filled from inputs.extras)
  network_type?: string | null; // 'testnet' | 'mainnet' | 'devnet' (legacy)
  is_demo?: boolean;
  created_at?: string | null;
  // Raw inputs as returned by backend
  inputs?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    extras?: {
      is_demo?: boolean;
      /** backend may also send `isdemo` in some cases */
      isdemo?: boolean;
      network_type?: string | null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
  };
  // other fields exist; omitted for brevity
};

export type OrbitServicesResponse = {
  success: boolean;
  data: {
    services: OrbitService[];
  };
  error?: string;
};

const useOrbitRollupServices = (type: string = "arbitrum-orbit") => {
  const url = withApiBasePath(`/rollup/services?type=${encodeURIComponent(type)}`);
  const fetcher = useFetcher();
  const request = useSWRImmutable<OrbitServicesResponse>(url, fetcher, { shouldRetryOnError: false });

  const normalizedServices = (request.data?.data?.services ?? []).map((s) => {
    const extras = s?.inputs?.extras ?? {};
    const isDemo = typeof s.is_demo === "boolean" ? s.is_demo : Boolean(extras.is_demo ?? extras.isdemo);
    const networkType = s.network_type ?? extras.network_type ?? null;
    return { ...s, is_demo: isDemo, network_type: networkType } as OrbitService;
  });

  return { url, request, normalizedServices };
};

export default useOrbitRollupServices;
