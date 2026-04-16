"use client";
import useSWRImmutable from "swr/immutable";
import ROUTES from "@orbit/routes";
import useFetcher from "@orbit/hooks/use-fetcher";
import { getConfig } from "@/config";
import { ArbitrumOrbitServiceError } from "@orbit/services/arbitrum-orbit/types";

interface UserInfoResponseData {
  first_name: string;
  last_name: string;
  usercred: string;
}

interface UserInfoResponse {
  success: boolean;
  data: UserInfoResponseData;
}

/** hook to use api */
const useUserInfoAPI = (isAuthenticated: boolean) => {
  const config = getConfig();

  const url = `${config?.url?.external?.platformOld?.backend}${ROUTES.PLATFORM.API.DASHBOARD}/user-info`;

  const fetcher = useFetcher();

  const request = useSWRImmutable<UserInfoResponse, ArbitrumOrbitServiceError>(isAuthenticated ? url : null, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { UserInfoResponseData, UserInfoResponse };
export default useUserInfoAPI;
