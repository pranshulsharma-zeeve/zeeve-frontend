"use client";
import useSWRImmutable from "swr/immutable";
import useFetcher from "@/hooks/use-fetcher";
import { withApiBasePath } from "@/constants/api";

export type RollupServiceItem = {
  id: number;
  service_id: string;
  chain_id?: string | null;
  name: string;
  status: string;
  network_type?: string | null;
  is_demo?: boolean;
  created_at?: string | null;
  inputs?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    extras?: {
      is_demo?: boolean;
      isdemo?: boolean;
      network_type?: string | null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
  };
};

export type RollupServicesListResponse = {
  success: boolean;
  data: { services: RollupServiceItem[] };
  error?: string;
};

const useRollupServicesByType = (type: string) => {
  const url = withApiBasePath(`/rollup/services?type=${encodeURIComponent(type)}`);
  const fetcher = useFetcher();
  const request = useSWRImmutable<RollupServicesListResponse>(url, fetcher, { shouldRetryOnError: false });

  const normalizedServices = (request.data?.data?.services ?? []).map((s) => {
    const extras = s?.inputs?.extras ?? {};
    const isDemo = typeof s.is_demo === "boolean" ? s.is_demo : Boolean(extras.is_demo ?? extras.isdemo);
    const networkTypeRaw = s.network_type ?? extras.network_type ?? null;
    const networkType =
      typeof networkTypeRaw === "string" ? networkTypeRaw.trim().toLowerCase() : (networkTypeRaw ?? null);
    return { ...s, is_demo: isDemo, network_type: networkType } as RollupServiceItem;
  });

  return { url, request, normalizedServices };
};

export default useRollupServicesByType;
