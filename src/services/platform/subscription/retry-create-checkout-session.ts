import { AxiosResponse } from "axios";
import useAxios from "@/hooks/use-axios";
import { withApiBasePath } from "@/constants/api";

interface RetryCheckoutSessionPayload {
  subscription_id?: number | string;
  charge_id?: number;
}

interface RetryCheckoutSessionData {
  checkout_url?: string;
  session_id?: string;
}

interface RetryCheckoutSessionResponse {
  success: boolean;
  data?: RetryCheckoutSessionData;
  message?: string;
}

const useRetryCreateCheckoutSessionAPI = () => {
  const { backendAxiosInstance } = useAxios();
  const url = withApiBasePath("/retry_create_checkout_session");

  const request = async (
    _url: string,
    payload: RetryCheckoutSessionPayload,
  ): Promise<AxiosResponse<RetryCheckoutSessionResponse>> => {
    return backendAxiosInstance.post<RetryCheckoutSessionResponse>(url, payload);
  };

  return { url, request };
};

export type { RetryCheckoutSessionPayload, RetryCheckoutSessionResponse };
export default useRetryCreateCheckoutSessionAPI;
