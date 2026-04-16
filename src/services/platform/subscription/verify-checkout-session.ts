import { AxiosResponse } from "axios";
import useAxios from "@/hooks/use-axios";
import { withApiBasePath } from "@/constants/api";

interface VerifyCheckoutSessionRequest {
  session_id: string;
}

interface VerifyCheckoutSessionResponseData {
  status: string;
  subscription_id: number;
  session_id: string;
  message: string;
}

interface VerifyCheckoutSessionResponse {
  success: boolean;
  message?: string;
  data?: VerifyCheckoutSessionResponseData;
}

const useVerifyCheckoutSessionAPI = () => {
  const { backendAxiosInstance } = useAxios();
  const url = withApiBasePath("/verify_checkout_session");

  const request = async (
    _url: string,
    payload: VerifyCheckoutSessionRequest,
  ): Promise<AxiosResponse<VerifyCheckoutSessionResponse>> => {
    const response = await backendAxiosInstance.post<VerifyCheckoutSessionResponse>(url, payload, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return response;
  };

  return { url, request };
};

export default useVerifyCheckoutSessionAPI;
export type { VerifyCheckoutSessionRequest, VerifyCheckoutSessionResponse, VerifyCheckoutSessionResponseData };
