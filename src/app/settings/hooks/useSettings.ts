import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import type { AxiosError } from "axios";
import { useToast } from "@zeeve-platform/ui";
import { changePassword, getUserInfo, listSubscriptions, listInvoices } from "@/services/settings";
import type { ChangePasswordPayload } from "@/services/settings";
import { authAxiosInstance } from "@/utils/auth-axios";
import { withApiBasePath } from "@/constants/api";
import { useUserStore } from "@/store/user";
import { useVisionUserStore } from "@/store/vizionUser";
import useAxios from "@/hooks/use-axios";
import { clearAccessToken } from "@/utils/auth-token";
import { withBasePath } from "@/utils/helpers";

type NotificationPreferenceKey = "marketingUpdates" | "productUpdates";

interface UserInfoResponseData {
  first_name: string;
  last_name: string;
  usercred: string;
  email?: string | null;
  phone_number?: string | null;
  country?: string | null;
  is_google_connected?: boolean | null;
  provider?: string | null;
  image_url?: string | null;
}

interface UserInfoResponse {
  success: boolean;
  data: UserInfoResponseData;
  message?: string;
}

interface NodeSubscriptionRecord {
  id: number | string;
  node_id?: number | string;
  plan_name?: string | null;
  node_name?: string | null;
  node_status?: string | null;
  subscription_status?: string | null;
  subscription_type?: string | null;
  payment_frequency?: string | null;
  next_billing_date?: string | null;
  valid_till?: string | null;
  payment_method?: string | null;
  amount?: number | null;
  prorated_draft_order?: ProratedDraftOrder[];
  payment_link?: string | null;
}

interface RollupSubscriptionRecord {
  id: number | string;
  plan_name?: string | null;
  service_name?: string | null;
  node_name?: string | null;
  node_status?: string | null;
  subscription_type?: string | null;
  service_status?: string | null;
  subscription_status?: string | null;
  payment_frequency?: string | null;
  next_billing_date?: string | null;
  valid_till?: string | null;
  payment_method?: string | null;
  amount?: number | null;
  prorated_draft_order?: ProratedDraftOrder[];
  payment_link?: string | null;
  type_id?: number | string | null;
  region_ids?: number[] | null;
  network_type?: string | null;
  configuration?: Record<string, unknown> | null;
  deployment_token?: string | null;
  is_pending?: boolean | null;
  core_components?: Array<Record<string, unknown>> | null;
  nodes?: Array<Record<string, unknown>> | null;
}

interface ProratedDraftOrder {
  charge_id?: number | string | null;
  session_id?: string | null;
  quantity_increase?: number | string | null;
  stripe_subscription_id?: string | null;
  state?: string | null;
  subscription_id?: number | string | null;
}

interface SubscriptionListResponseData {
  subscriptions: NodeSubscriptionRecord[];
  rollups: RollupSubscriptionRecord[];
  total_subscriptions: number;
  total_rollups: number;
}

interface SubscriptionListResponse {
  success: boolean;
  message?: string;
  data: SubscriptionListResponseData;
}

interface InvoiceRecord {
  invoice_id: number;
  invoice_number: string;
  date: string;
  amount_total: number;
  state: string;
  product: string;
  download_url: string;
}

interface InvoiceListResponse {
  success: boolean;
  data: {
    data: {
      status?: string;
      count?: number;
      invoices: InvoiceRecord[];
    };
  };
}

interface ChangePasswordFormValues extends ChangePasswordPayload {
  confirm_new_password: string;
}

const NOTIFICATION_DEFAULTS: Record<NotificationPreferenceKey, boolean> = {
  marketingUpdates: false,
  productUpdates: false,
};

const useSettings = () => {
  const toast = useToast();
  const resetUser = useUserStore((state) => state.reset);
  const resetVisionUser = useVisionUserStore((state) => state.reset);
  const { backendAxiosInstance, setAuthToken } = useAxios();
  const [notificationPreferences, setNotificationPreferences] = useState<Record<NotificationPreferenceKey, boolean>>({
    ...NOTIFICATION_DEFAULTS,
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSubscriptionRequested, setSubscriptionRequested] = useState(false);
  const [cancelingSubscriptionId, setCancelingSubscriptionId] = useState<number | string | null>(null);
  const [isInvoiceRequested, setInvoiceRequested] = useState(false);

  const {
    data: userInfoResponse,
    error: userInfoError,
    isLoading: isUserInfoLoading,
    mutate: refreshUserInfo,
  } = useSWR<UserInfoResponse, AxiosError>("/api/v1/user-info", async () => {
    const { data } = await getUserInfo();
    return data;
  });

  const {
    data: subscriptionResponse,
    error: subscriptionError,
    isLoading: isSubscriptionLoading,
    mutate: mutateSubscriptionList,
  } = useSWR<SubscriptionListResponse, AxiosError>(
    isSubscriptionRequested ? "/api/v1/subscriptions-list" : null,
    async () => {
      const { data } = await listSubscriptions();
      return data;
    },
  );

  const {
    data: invoiceResponse,
    error: invoiceError,
    isLoading: isInvoiceLoading,
    mutate: mutateInvoiceList,
  } = useSWR<InvoiceListResponse, AxiosError>(isInvoiceRequested ? "/api/v1/my_invoices" : null, async () => {
    const { data } = await listInvoices();
    return data;
  });

  const handleNotificationToggle = useCallback((key: NotificationPreferenceKey) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const resetNotificationPreferences = useCallback(() => {
    setNotificationPreferences({ ...NOTIFICATION_DEFAULTS });
  }, []);

  const handleChangePassword = useCallback(
    async ({ email, current_password, new_password }: ChangePasswordFormValues) => {
      if (!email) {
        toast("Unable to update password", {
          status: "error",
          message: "Missing user email in profile data.",
        });
        return;
      }

      setIsUpdatingPassword(true);
      try {
        await changePassword({
          email,
          current_password,
          new_password,
        });

        toast("Password updated", {
          status: "success",
          message: "Your password has been changed successfully.",
        });

        await refreshUserInfo();

        try {
          await authAxiosInstance.post(withApiBasePath("/logout"));
        } catch (error) {
          console.error("Logout after password change failed", error);
        } finally {
          resetUser();
          resetVisionUser();
          clearAccessToken();
          setAuthToken(null);
          if (typeof window !== "undefined") {
            const loginUrl = new URL(withBasePath("/account/login"), window.location.origin);
            loginUrl.searchParams.set("serviceURL", window.location.href);
            window.open(loginUrl.toString(), "_self");
          }
        }
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        toast("Password change failed", {
          status: "error",
          message: axiosError.response?.data?.message ?? axiosError.message ?? "Please try again later.",
        });
        throw error;
      } finally {
        setIsUpdatingPassword(false);
      }
    },
    [refreshUserInfo, resetUser, resetVisionUser, setAuthToken, toast],
  );

  const userProfile = useMemo(() => {
    if (!userInfoResponse?.data) {
      return undefined;
    }

    const responseData = userInfoResponse.data;
    const email = responseData.email ?? responseData.usercred ?? "";

    return {
      ...responseData,
      email,
    };
  }, [userInfoResponse]);

  const nodeSubscriptions = useMemo(() => subscriptionResponse?.data.subscriptions ?? [], [subscriptionResponse]);
  const rollupSubscriptions = useMemo(() => subscriptionResponse?.data.rollups ?? [], [subscriptionResponse]);
  const subscriptionTotals = useMemo(() => {
    return {
      nodes: subscriptionResponse?.data.total_subscriptions ?? 0,
      rollups: subscriptionResponse?.data.total_rollups ?? 0,
    };
  }, [subscriptionResponse]);

  const invoices = useMemo(() => invoiceResponse?.data.data.invoices ?? [], [invoiceResponse]);

  const requestSubscriptions = useCallback(() => {
    setSubscriptionRequested(true);
  }, []);

  const refreshSubscriptionList = useCallback(async () => {
    setSubscriptionRequested(true);
    await mutateSubscriptionList(undefined, { revalidate: true });
  }, [mutateSubscriptionList]);

  const requestInvoices = useCallback(() => {
    setInvoiceRequested(true);
  }, []);

  const refreshInvoices = useCallback(async () => {
    setInvoiceRequested(true);
    await mutateInvoiceList(undefined, { revalidate: true });
  }, [mutateInvoiceList]);

  const cancelSubscription = useCallback(
    async (id: number | string) => {
      if (!id) {
        return;
      }
      setCancelingSubscriptionId(id);
      setSubscriptionRequested(true);
      try {
        await backendAxiosInstance.post(withApiBasePath(`/subscriptions/${id}/cancel`));
        toast("Subscription cancelled", {
          status: "success",
          message: "Your cancellation request has been submitted successfully.",
        });
        await mutateSubscriptionList(undefined, { revalidate: true });
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        toast("Unable to cancel subscription", {
          status: "error",
          message: axiosError.response?.data?.message ?? axiosError.message ?? "Please try again later.",
        });
        throw error;
      } finally {
        setCancelingSubscriptionId(null);
      }
    },
    [backendAxiosInstance, mutateSubscriptionList, toast],
  );

  return {
    profile: {
      data: userProfile,
      isLoading: isUserInfoLoading,
      error: userInfoError,
      refresh: refreshUserInfo,
    },
    subscriptions: {
      nodes: nodeSubscriptions,
      rollups: rollupSubscriptions,
      totals: subscriptionTotals,
      isLoading: isSubscriptionRequested && isSubscriptionLoading,
      error: subscriptionError,
      refresh: refreshSubscriptionList,
      request: requestSubscriptions,
      hasRequested: isSubscriptionRequested,
      cancel: cancelSubscription,
      cancelingId: cancelingSubscriptionId,
    },
    invoices: {
      items: invoices,
      isLoading: isInvoiceRequested && isInvoiceLoading,
      error: invoiceError,
      refresh: refreshInvoices,
      request: requestInvoices,
      hasRequested: isInvoiceRequested,
    },
    notifications: {
      preferences: notificationPreferences,
      toggle: handleNotificationToggle,
      reset: resetNotificationPreferences,
    },
    password: {
      change: handleChangePassword,
      isUpdating: isUpdatingPassword,
    },
  };
};

export type {
  ChangePasswordFormValues,
  NodeSubscriptionRecord as SettingsNodeSubscription,
  RollupSubscriptionRecord as SettingsRollupSubscription,
  SubscriptionListResponse as SettingsSubscriptionListResponse,
  InvoiceRecord as SettingsInvoiceRecord,
  InvoiceListResponse as SettingsInvoiceListResponse,
  UserInfoResponseData as SettingsUserProfile,
  UserInfoResponse as SettingsUserInfoResponse,
  NotificationPreferenceKey as SettingsNotificationPreferenceKey,
};
export default useSettings;
