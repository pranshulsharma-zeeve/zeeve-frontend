import { AxiosResponse } from "axios";
import useAxios from "@/hooks/use-axios";
import { withApiBasePath } from "@/constants/api";

interface RetryProratedChargePayload {
  charge_id: number;
}

interface RetryProratedChargeData {
  checkout_url?: string;
  session_id?: string;
}

interface RetryProratedChargeResponse {
  success: boolean;
  data?: RetryProratedChargeData;
  message?: string;
}

const useRetryProratedChargeAPI = () => {
  const { backendAxiosInstance } = useAxios();
  const url = withApiBasePath("/retry_prorated_charge");

  const request = async (
    _url: string,
    payload: RetryProratedChargePayload,
  ): Promise<AxiosResponse<RetryProratedChargeResponse>> => {
    return backendAxiosInstance.post<RetryProratedChargeResponse>(url, payload);
  };

  return { url, request };
};

export type { RetryProratedChargePayload, RetryProratedChargeResponse };
export default useRetryProratedChargeAPI;
