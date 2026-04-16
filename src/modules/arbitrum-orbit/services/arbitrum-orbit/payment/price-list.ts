/* eslint-disable prettier/prettier */
import useSWRImmutable from "swr/immutable";
import { ArbitrumOrbitServiceError } from "../types";
import ROUTES from "@orbit/routes";
import useFetcher from "@orbit/hooks/use-fetcher";

interface PriceListResponseData {
  byoc: {
    [cloudName: string]: {
      sandbox: {
        price: number;
        enabled: boolean;
      };
    };
  };
  managed: {
    sandbox: {
      price: number;
      enabled: boolean;
    };
  };
}

interface PriceListResponse {
  success: boolean;
  data: PriceListResponseData;
}

const usePriceListAPI = () => {
  const fetcher = useFetcher();

  const url = ROUTES.ARBITRUM_ORBIT.API.PAYMENTS;
  const request = useSWRImmutable<PriceListResponse, ArbitrumOrbitServiceError>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { PriceListResponseData, PriceListResponse };
export default usePriceListAPI;
