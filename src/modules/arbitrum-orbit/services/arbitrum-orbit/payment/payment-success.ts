/* eslint-disable prettier/prettier */
import useSWRImmutable from "swr/immutable";
import { ArbitrumOrbitServiceError } from "../types";
import ROUTES from "@orbit/routes";
import useFetcher from "@orbit/hooks/use-fetcher";

interface PaymentSuccess {
  redirectionUrl: string;
  message: string;
  networkId: string;
}

interface PaymentSuccessResponse {
  success: boolean;
  data: PaymentSuccess;
}

const usePaymentSuccessAPI = (networkId: string) => {
  const fetcher = useFetcher();

  const url = `${ROUTES.ARBITRUM_ORBIT.API.NETWORKS}/payment-success/${networkId}`;
  const request = useSWRImmutable<PaymentSuccessResponse, ArbitrumOrbitServiceError>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { PaymentSuccessResponse, PaymentSuccess };
export default usePaymentSuccessAPI;
