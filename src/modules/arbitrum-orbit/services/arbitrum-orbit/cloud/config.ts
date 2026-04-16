"use client";
import useSWRImmutable from "swr/immutable";
import { ArbitrumOrbitServiceError } from "../types";
import ROUTES from "@orbit/routes";
import useFetcher from "@orbit/hooks/use-fetcher";

interface CloudConfigResponseData {
  byoc: {
    enabled: boolean;
    clouds: Array<{
      name: string;
      abbreviation: string;
      id: string;
      enabled: boolean;
    }>;
  };
  managedCloud: {
    name: string;
    abbreviation: string;
    id: string;
    enabled: boolean;
  };
}
interface CloudConfigResponse {
  success: boolean;
  data: CloudConfigResponseData;
}

/** hook to use cloud config api */
const useCloudConfigAPI = () => {
  const fetcher = useFetcher();

  const url = `${ROUTES.ARBITRUM_ORBIT.API.CLOUDS}/config`;
  const request = useSWRImmutable<CloudConfigResponse, ArbitrumOrbitServiceError>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { CloudConfigResponseData, CloudConfigResponse };
export default useCloudConfigAPI;
