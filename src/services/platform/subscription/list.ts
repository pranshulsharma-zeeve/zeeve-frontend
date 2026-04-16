import useSWRImmutable from "swr/immutable";
import useFetcher from "@/hooks/use-fetcher";
import ROUTES from "@/routes";
import { SubscriptionNodeType } from "@/types/protocol";

interface SubscriptionRecord {
  node_name?: string | false;
  agent_id?: string | false;
  agent_online?: "online" | "offline" | false | null;
  custom_dashboard_url?: string | false;
  protocol_name: string;
  status: string;
  subscription_status?: string | null;
  next_billing_date: string | false;
  created_on: string;
  ready_at: string | false;
  network_type: string | false;
  endpoint: string | false;
  is_layer_zero: boolean;
  api_key: string | false;
  protocol_id: string | false;
  protocol_logo: string | false;
  node_id: string | false;
  subscription_id?: number | string | null;
  prorated_draft_order?: ProratedDraftOrder[];
  plan_type: string | null;
  node_type: SubscriptionNodeType;
}

interface ProratedDraftOrder {
  charge_id?: number | string | null;
  session_id?: string | null;
  quantity_increase?: number | string | null;
  stripe_subscription_id?: string | null;
  state?: string | null;
  subscription_id?: number | string | null;
}

interface SubscriptionPagination {
  page: number;
  size: number;
  total: number;
}

interface SubscriptionListData {
  list: SubscriptionRecord[];
  pagination: SubscriptionPagination;
}

interface SubscriptionListResponse {
  success: boolean;
  data: SubscriptionListData;
  message?: string;
}

const NODE_TYPE_PARAM: Record<"full" | "validator" | "archive", SubscriptionNodeType> = {
  full: "rpc",
  validator: "validator",
  archive: "archive",
};

const useSubscriptionListAPI = (nodeType: "validator" | "full" | "archive", page: number = 1, size: number = 5) => {
  const url = `${ROUTES.PLATFORM.API.NODE_SUBSCRIPTION_LIST}?node_type=${NODE_TYPE_PARAM[nodeType]}&page=${page}&size=${size}`;

  const fetcher = useFetcher();

  const request = useSWRImmutable<SubscriptionListResponse>(url, (key: string) => fetcher(key), {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { SubscriptionListResponse, SubscriptionListData, SubscriptionRecord, SubscriptionPagination };
export default useSubscriptionListAPI;
