"use client";
import useSWRImmutable from "swr/immutable";
import { ArbitrumOrbitServiceError } from "../types";
import { SupportedRollupType, useResolvedRollupType } from "./rollup-type";
import useFetcher from "@orbit/hooks/use-fetcher";
import ROUTES from "@orbit/routes";

type TrialInfoResponse = {
  status: "not-started" | "ongoing" | "ended" | "purchase_initiated" | "purchased";
  trialDays?: number; // if not trial enabled (first time)
  start?: Date | null; // if trial is enabled
  end?: Date | null; // if trial is enabled
};

type TrialInfoResponseePayload = {
  success: boolean;
  data: TrialInfoResponse;
};

const useTrialInfo = (rollupType?: SupportedRollupType) => {
  /** api url */
  const resolvedRollupType = useResolvedRollupType(rollupType);
  const params = new URLSearchParams();

  params.set("type", resolvedRollupType);

  const url = `${ROUTES.ARBITRUM_ORBIT.API.PAYMENTS}/trial-info?${params.toString()}`;

  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<TrialInfoResponseePayload, ArbitrumOrbitServiceError>(url, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 5000,
  });

  return {
    rollupType: resolvedRollupType,
    url,
    request,
  };
};

export type { TrialInfoResponseePayload, TrialInfoResponse };
export default useTrialInfo;
