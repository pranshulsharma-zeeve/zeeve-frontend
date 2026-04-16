import useSWRImmutable from "swr/immutable";
import useFetcher from "@/hooks/use-fetcher";
import ROUTES from "@/routes";
interface SubscriptionSummaryItem {
  id: number | string;
  node_id?: number | string | null;
  node_name?: string | null;
  plan_name?: string | null;
  plan_type?: string | null;
  node_status?: string | null;
  subscription_status?: string | null;
  next_billing_date?: string | null;
  subscription_type?: string | null;
  amount?: number | null;
  payment_frequency?: string | null;
  prorated_draft_order?: Array<{ charge_id?: number | string | null }>;
  payment_link?: string | null;
  type_id?: number | string | null;
  region_ids?: number[] | null;
  network_type?: string | null;
  configuration?: Record<string, unknown> | null;
  deployment_token?: string | null;
  is_pending?: boolean | null;
  core_components?: Array<Record<string, unknown>> | null;
  nodes?: Array<Record<string, unknown>> | null;
  logo: string;
  node_count?: number;
  endpoint?: string;
  validator_id?: string;
  explorer_url?: string;
}

type SubscriptionSummaryResponse = {
  success: boolean;
  data: {
    subscriptions: SubscriptionSummaryItem[];
    rollups: SubscriptionSummaryItem[];
    total_subscriptions: number;
    total_rollups: number;
  };
};

const useSubscriptionSummaryAPI = () => {
  /** api url */
  const url = `${ROUTES.PLATFORM.API.SUMMARY}`;

  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<SubscriptionSummaryResponse>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { SubscriptionSummaryResponse, SubscriptionSummaryItem };
export default useSubscriptionSummaryAPI;
