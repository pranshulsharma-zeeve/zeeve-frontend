"use client";
import useSWRImmutable from "swr/immutable";
import type { RollupKey } from "./use-rollup-service";
import useFetcher from "@/hooks/use-fetcher";
import { withApiBasePath } from "@/constants/api";

type ComingSoonIndicator = {
  comming_soon?: boolean;
  coming_soon?: boolean;
  comingSoon?: boolean;
};

type RawConfigOption = {
  id?: string | number;
  name?: string;
  active?: boolean;
  logo_url?: string;
} & ComingSoonIndicator;

type RawConfigType = {
  id?: string | number;
  name?: string;
  settlement_layer?: RawConfigOption[];
  data_availability?: RawConfigOption[];
  // allow unknowns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

type RawConfigResponse = {
  success: boolean;
  data?: {
    types?: RawConfigType[];
  };
  error?: string;
};

export interface RollupConfigurationOptions {
  // standardised options for generic deploy form
  settlementLayers: Array<{ value: string; label: string }>;
  dataAvailabilityLayers: Array<{ value: string; label: string }>;
}

const isComingSoon = (option?: ComingSoonIndicator) =>
  Boolean(option?.comming_soon ?? option?.coming_soon ?? option?.comingSoon);

const useRollupConfiguration = (rollupKey: RollupKey) => {
  const url = withApiBasePath(`/rollup/configuration?type=${encodeURIComponent(rollupKey)}`);
  const request = useSWRImmutable<RawConfigResponse>(url, useFetcher(), {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60_000,
  });

  const rawType =
    (request.data?.data?.types ?? []).find((t) => {
      const nm = String(t?.name ?? "").toLowerCase();
      return nm === String(rollupKey).toLowerCase();
    }) ?? (request.data?.data?.types ?? [])[0];

  const options: RollupConfigurationOptions = {
    settlementLayers: Array.isArray(rawType?.settlement_layer)
      ? rawType!
          .settlement_layer!.filter((sl) => sl?.active !== false)
          .map((sl) => ({ value: String(sl?.name ?? sl?.id ?? ""), label: String(sl?.name ?? "") }))
      : [],
    dataAvailabilityLayers: Array.isArray(rawType?.data_availability)
      ? rawType!
          .data_availability!.filter((da) => da?.active !== false && !isComingSoon(da))
          .map((da) => ({ value: String(da?.name ?? da?.id ?? ""), label: String(da?.name ?? "") }))
      : [],
  };

  return { url, request, options };
};

export default useRollupConfiguration;

export type {
  ComingSoonIndicator as RollupComingSoonIndicator,
  RawConfigOption as RollupConfigOption,
  RawConfigType as RollupConfigType,
};
