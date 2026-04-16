import { AxiosResponse } from "axios";
import useAxios from "@/hooks/use-axios";
import { SubscriptionNodeType } from "@/types/protocol";
import { withApiBasePath } from "@/constants/api";

type CheckoutDuration = "monthly" | "quarterly" | "yearly";

type AutomaticUpdatePreference = "auto" | "manual";

interface CreateCheckoutSessionRequest {
  duration: CheckoutDuration;
  plan_type: string;
  protocol_id: string;
  subscription_type: SubscriptionNodeType;
  automatic_update: AutomaticUpdatePreference;
  server_location_id: string;
  network_selection: string;
  autopay_enabled?: boolean;
  quantity?: number;
  visionUserId: string;
  password?: string;
}

interface CreateCheckoutSessionData {
  checkout_url: string;
  session_id: string;
  subscription_id: number;
  amount: number;
  currency: string;
  status: string;
}

interface CreateCheckoutResponse {
  success: boolean;
  data: CreateCheckoutSessionData;
  message: string;
}

/** hook to use create checkout session API */
const useNodeCreateAPI = () => {
  const { backendAxiosInstance } = useAxios();
  const url = withApiBasePath("/create_checkout_session");

  const request = async (
    _url: string,
    payload: CreateCheckoutSessionRequest,
  ): Promise<AxiosResponse<CreateCheckoutResponse>> => {
    return backendAxiosInstance.post<CreateCheckoutResponse>(url, payload);
  };

  return { url, request };
};

export default useNodeCreateAPI;
export type { CreateCheckoutSessionRequest };
