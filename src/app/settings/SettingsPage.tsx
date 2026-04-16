"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import {
  Button,
  DropdownMenu,
  DropdownMenuButton,
  DropdownMenuItem,
  DropdownMenuList,
  Heading,
  useToast,
  useToggle,
  tx,
  Z4Navigation,
} from "@zeeve-platform/ui";
import { IconCard1, IconReceipt3 } from "@zeeve-platform/icons/money/outline";
import { IconUser } from "@zeeve-platform/icons/user/outline";
import Tabs from "./components/Tabs";
import ProfileTabContent from "./components/ProfileTabContent";
import { NodeSubscriptionCard, RollupSubscriptionCard } from "./components/SubscriptionCard";
import PasswordModal from "./components/PasswordModal";
import BillingTab from "./components/BillingTab";
import useSettings, { type SettingsRollupSubscription } from "./hooks/useSettings";
import CancelSubscriptionModal from "./components/CancelSubscriptionModal";
import DeleteAccountModal from "./components/DeleteAccountModal";
import ZeeveLoader from "@/components/shared/ZeeveLoader";
import IconFilter from "@/components/icons/icon-filter";
import IconCheckMark from "@/components/icons/icon-check-mark";
import ROUTES from "@/routes";
import { requestAccountDeletionTicket } from "@/services/settings";
import usePlatformService from "@/services/platform/use-platform-service";
import HTTP_STATUS from "@/constants/http";
import { PlatformServiceError } from "@/services/platform/types";
import useRollupService, { RollupKey } from "@/services/rollups/use-rollup-service";
import buildRollupDeployPayload from "@/services/rollups/build-rollup-deploy-payload";
import { redirectToStripeUrl } from "@/utils/redirects";

type SubscriptionStatusFilter = "all" | "active" | "cancelled" | "suspended" | "pending_payment";

const STATUS_FILTER_META: Record<SubscriptionStatusFilter, { label: string; dotClass: string }> = {
  active: { label: "Active", dotClass: "bg-[#16A34A]" },
  cancelled: { label: "Cancelled", dotClass: "bg-[#F87171]" },
  suspended: { label: "Suspended", dotClass: "bg-[#FACC15]" },
  pending_payment: { label: "Payment Pending", dotClass: "bg-[#F97316]" },
  all: { label: "All Statuses", dotClass: "bg-[#CBD5F5]" },
};

const mapStatusToFilterBucket = (
  value?: string | null,
  nodeStatus?: string | null,
  paymentLink?: string | null,
): Exclude<SubscriptionStatusFilter, "all"> | null => {
  const nodeNormalized = nodeStatus?.trim().toLowerCase() ?? "";
  if (nodeNormalized.includes("cancellation_requested") || nodeNormalized.includes("cancellation requested")) {
    return "cancelled";
  }
  if (nodeNormalized === "draft") {
    return "pending_payment";
  }

  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  if (
    normalized.includes("pending_payment") ||
    normalized.includes("pending payment") ||
    normalized.includes("payment pending")
  ) {
    return "pending_payment";
  }
  if (paymentLink && normalized.includes("suspend")) {
    return "pending_payment";
  }

  if (
    normalized.includes("suspend") ||
    normalized.includes("pause") ||
    normalized.includes("inactive") ||
    normalized.includes("hold") ||
    normalized.includes("halt") ||
    normalized.includes("disable") ||
    normalized === "false"
  ) {
    return "suspended";
  }

  if (normalized.includes("cancel") || normalized.includes("terminate") || normalized.includes("ended")) {
    return "cancelled";
  }

  if (normalized.includes("active") || normalized.includes("success") || normalized === "true") {
    return "active";
  }

  return null;
};

const isPaymentPending = (status?: string | null, nodeStatus?: string | null, paymentLink?: string | null) => {
  const normalizedNode = `${nodeStatus ?? ""}`.toLowerCase();
  if (normalizedNode === "draft") {
    return true;
  }

  const normalizedStatus = `${status ?? ""}`.toLowerCase();
  return (
    (paymentLink ? normalizedStatus.includes("suspend") : false) ||
    normalizedStatus.includes("pending_payment") ||
    normalizedStatus.includes("pending payment") ||
    normalizedStatus.includes("payment pending")
  );
};

const resolveRollupKey = (subscription: SettingsRollupSubscription): RollupKey | null => {
  const source = `${
    subscription.subscription_type ?? subscription.plan_name ?? subscription.service_name ?? ""
  }`.toLowerCase();
  if (!source) return null;
  if (source.includes("arbitrum")) return "arbitrum-orbit";
  if (source.includes("optimism") || source.includes("op stack") || source.includes("opstack")) return "opstack";
  if (source.includes("polygon") || source.includes("cdk")) return "polygon-cdk";
  if (source.includes("zksync") || source.includes("zk sync") || source.includes("hyperchain")) return "zksync";
  return null;
};

const SettingsPage = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<"profile" | "subscriptions" | "billing">("profile");
  const [subscriptionFilter, setSubscriptionFilter] = useState<"all" | "nodes" | "rollups">("all");
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatusFilter>("active");
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSubmittingDeletion, setIsSubmittingDeletion] = useState(false);
  const [pendingCancellation, setPendingCancellation] = useState<{
    id: number | string;
    name: string;
  } | null>(null);
  const [isConfirmingCancellation, setIsConfirmingCancellation] = useState(false);
  const [isCompletingPaymentId, setIsCompletingPaymentId] = useState<number | string | null>(null);

  const { profile, subscriptions, notifications, password, invoices } = useSettings();
  const { request: requestSubscriptions, hasRequested: hasRequestedSubscriptions, cancel, cancelingId } = subscriptions;
  const { request: requestInvoices, hasRequested: hasRequestedInvoices } = invoices;
  const router = useRouter();
  const { request: retryCheckout, url: retryCheckoutUrl } =
    usePlatformService().subscription.retryCreateCheckoutSession();
  const { request: retryProrated, url: retryProratedUrl } = usePlatformService().subscription.retryProratedCharge();
  const { deploy } = useRollupService();
  const {
    isOpen: isStatusDropdownOpen,
    handleToggle: toggleStatusDropdown,
    handleClose: closeStatusDropdown,
  } = useToggle();
  const handleStripeRedirect = useCallback(
    (url: string) => {
      if (redirectToStripeUrl(url)) {
        return true;
      }
      toast("", {
        status: "error",
        message: "Invalid payment link. Please contact support.",
      });
      return false;
    },
    [toast],
  );
  const hasActiveSubscription = useMemo(() => {
    const nodeActive = subscriptions.nodes.some(
      (subscription) =>
        mapStatusToFilterBucket(
          subscription.subscription_status,
          subscription.node_status,
          subscription.payment_link,
        ) === "active",
    );
    if (nodeActive) {
      return true;
    }
    return subscriptions.rollups.some(
      (subscription) =>
        mapStatusToFilterBucket(
          subscription.subscription_status,
          subscription.node_status,
          subscription.payment_link,
        ) === "active",
    );
  }, [subscriptions.nodes, subscriptions.rollups]);

  const profileFirstName = profile.data?.first_name?.trim() ?? "";
  const profileLastName = profile.data?.last_name?.trim() ?? "";
  const profileFullName = useMemo(() => {
    const parts = [profileFirstName, profileLastName].filter(Boolean);
    if (!parts.length) {
      return undefined;
    }
    return parts.join(" ");
  }, [profileFirstName, profileLastName]);

  const profileEmail = profile.data?.email ?? "";

  const handleCompletePayment = useCallback(
    async (subscription: {
      id: number | string;
      subscription_status?: string | null;
      node_status?: string | null;
      prorated_draft_order?: Array<{ charge_id?: number | string | null }>;
      payment_link?: string | null;
    }) => {
      const normalizedStatus = String(subscription.subscription_status ?? "").toLowerCase();
      if (subscription.payment_link && normalizedStatus.includes("suspend")) {
        handleStripeRedirect(subscription.payment_link);
        return;
      }
      if (!isPaymentPending(subscription.subscription_status, subscription.node_status, subscription.payment_link)) {
        return;
      }

      const proratedOrders = Array.isArray(subscription.prorated_draft_order) ? subscription.prorated_draft_order : [];
      const chargeId = proratedOrders
        .map((order) => {
          const value = order?.charge_id;
          return typeof value === "number" ? value : typeof value === "string" ? Number(value) : null;
        })
        .find((value): value is number => typeof value === "number" && Number.isFinite(value) && value > 0);

      const hasProratedDraft = proratedOrders.length > 0;
      if (hasProratedDraft && !chargeId) {
        toast("", {
          status: "error",
          message: "Unable to initiate payment. Please contact support.",
        });
        return;
      }

      setIsCompletingPaymentId(subscription.id);
      try {
        const response = hasProratedDraft
          ? await retryProrated(retryProratedUrl, { charge_id: chargeId as number })
          : await retryCheckout(retryCheckoutUrl, { subscription_id: subscription.id });

        if (response.status === HTTP_STATUS.OK && response.data.success) {
          const checkoutUrl =
            response.data.data?.checkout_url ||
            (response.data as { checkout_url?: string })?.checkout_url ||
            (response.data.data as { url?: string })?.url ||
            (response.data.data as { checkoutUrl?: string })?.checkoutUrl;
          if (checkoutUrl) {
            if (handleStripeRedirect(checkoutUrl)) {
              return;
            }
            return;
          }
        }

        toast("", {
          status: "error",
          message: response.data.message || "Unable to create checkout session.",
        });
      } catch (error) {
        const err = error as AxiosError<PlatformServiceError & { error?: string; detail?: string }>;
        const message = axios.isAxiosError(error)
          ? err.response?.data?.message ||
            err.response?.data?.error ||
            err.response?.data?.detail ||
            err.message ||
            "An unexpected error occurred"
          : "An unexpected error occurred";
        toast("", {
          status: "error",
          message,
        });
      } finally {
        setIsCompletingPaymentId(null);
      }
    },
    [handleStripeRedirect, retryCheckout, retryCheckoutUrl, retryProrated, retryProratedUrl, toast],
  );
  const handleCompleteRollupPayment = useCallback(
    async (subscription: SettingsRollupSubscription) => {
      const normalizedStatus = String(subscription.subscription_status ?? "").toLowerCase();
      if (subscription.payment_link && normalizedStatus.includes("suspend")) {
        handleStripeRedirect(subscription.payment_link);
        return;
      }
      if (!isPaymentPending(subscription.subscription_status, subscription.node_status, subscription.payment_link)) {
        return;
      }

      const payload = buildRollupDeployPayload({
        name: subscription.node_name,
        type_id: subscription.type_id,
        region_ids: subscription.region_ids,
        network_type: subscription.network_type,
        configuration: subscription.configuration ?? undefined,
        core_components: subscription.core_components ?? undefined,
        nodes: subscription.nodes ?? undefined,
      });

      if (!payload) {
        toast("", { status: "error", message: "Unable to initiate payment. Please contact support." });
        return;
      }

      if (subscription.deployment_token) {
        payload.deployment_token = subscription.deployment_token;
      }

      if (subscription.is_pending !== undefined && subscription.is_pending !== null) {
        payload.is_pending = subscription.is_pending;
      }

      setIsCompletingPaymentId(subscription.id);
      try {
        const response = (await deploy().request(payload)) as {
          checkout_url?: string;
          redirectionUrl?: string;
          data?: {
            checkout_url?: string;
            redirectionUrl?: string;
            service?: { service_id?: string };
            id?: string;
          };
          message?: string;
          service?: { service_id?: string };
          id?: string;
        };
        const checkoutUrl = response.data?.checkout_url ?? response.checkout_url ?? undefined;
        const redirectionUrl = response.data?.redirectionUrl ?? response.redirectionUrl ?? undefined;
        const serviceId =
          response.data?.service?.service_id ?? response.service?.service_id ?? response.data?.id ?? response.id;

        if (checkoutUrl) {
          if (handleStripeRedirect(checkoutUrl)) {
            return;
          }
          return;
        }

        if (redirectionUrl) {
          if (redirectionUrl.startsWith("http")) {
            if (handleStripeRedirect(redirectionUrl)) {
              return;
            }
          } else {
            router.push(redirectionUrl);
          }
          return;
        }

        if (serviceId) {
          const key = resolveRollupKey(subscription);
          if (key) {
            if (key === "arbitrum-orbit") {
              router.push(`/arbitrum-orbit/network/${serviceId}`);
              return;
            }
            router.push(`/rollups/${key}/network/${serviceId}`);
            return;
          }
        }

        toast("", { status: "error", message: response.message || "Unable to create checkout session." });
      } catch (error) {
        const err = error as AxiosError<{ message?: string; error?: string; detail?: string }>;
        const message = axios.isAxiosError(error)
          ? err.response?.data?.message ||
            err.response?.data?.error ||
            err.response?.data?.detail ||
            err.message ||
            "An unexpected error occurred"
          : "An unexpected error occurred";
        toast("", { status: "error", message });
      } finally {
        setIsCompletingPaymentId(null);
      }
    },
    [deploy, handleStripeRedirect, router, toast],
  );
  const profileUserId = profile.data?.usercred ?? null;
  const profilePhoneNumber = profile.data?.phone_number ?? null;

  const handleOpenPasswordModal = useCallback(() => setPasswordModalOpen(true), []);
  const handleClosePasswordModal = useCallback(() => setPasswordModalOpen(false), []);

  const handleDeleteAccount = useCallback(() => {
    if (hasActiveSubscription) {
      toast("Delete account", {
        status: "warning",
        message: "Account deletion is disabled while subscriptions remain active.",
      });
      return;
    }

    if (!profileEmail) {
      toast("Delete account", {
        status: "error",
        message: "We could not determine your account email. Please refresh the page and try again.",
      });
      return;
    }

    setDeleteModalOpen(true);
  }, [hasActiveSubscription, profileEmail, toast]);

  const handleCloseDeleteModal = useCallback(() => {
    if (isSubmittingDeletion) {
      return;
    }
    setDeleteModalOpen(false);
  }, [isSubmittingDeletion]);

  const handleConfirmDeleteAccount = useCallback(async () => {
    if (!profileEmail) {
      toast("Delete account", {
        status: "error",
        message: "Unable to submit the request without a valid email address.",
      });
      return;
    }
    try {
      setIsSubmittingDeletion(true);
      await requestAccountDeletionTicket({
        userEmail: profileEmail,
        userId: profileUserId ?? profileEmail,
        userName: profileFullName ?? profileEmail,
        phoneNumber: profilePhoneNumber,
        additionalContext: "User confirmed account deletion via the settings page.",
      });
      toast("Request submitted", {
        status: "success",
        message: "We created a support ticket. Our team will reach out shortly to finish deleting your account.",
      });
      setDeleteModalOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again later.";
      toast("Unable to submit request", {
        status: "error",
        message,
      });
    } finally {
      setIsSubmittingDeletion(false);
    }
  }, [profileEmail, profileFullName, profilePhoneNumber, profileUserId, toast]);

  const handleSaveNotifications = useCallback(() => {
    toast("Preferences updated", {
      status: "success",
      message: "Notification preferences saved. Wire this action to the backend when ready.",
    });
  }, [toast]);

  const handleOpenCancelModal = useCallback(
    (id: number | string | null | undefined, name: string) => {
      if (!id) {
        toast("Unable to cancel subscription", {
          status: "error",
          message: "Missing node id for this subscription. Please contact support.",
        });
        return;
      }
      setPendingCancellation({ id, name });
    },
    [toast],
  );

  const handleCloseCancelModal = useCallback(() => {
    if (isConfirmingCancellation) {
      return;
    }
    setPendingCancellation(null);
  }, [isConfirmingCancellation]);

  const handleConfirmCancellation = useCallback(async () => {
    if (!pendingCancellation) {
      return;
    }
    try {
      setIsConfirmingCancellation(true);
      await cancel(pendingCancellation.id);
      setPendingCancellation(null);
      if (typeof window !== "undefined") {
        window.location.reload();
        return;
      }
      router.refresh();
    } catch {
      // error toast handled inside hook
    } finally {
      setIsConfirmingCancellation(false);
    }
  }, [cancel, pendingCancellation, router]);

  const activeCancellationInFlight = pendingCancellation ? cancelingId === pendingCancellation.id : false;

  useEffect(() => {
    if (activeTab === "profile" && !hasRequestedSubscriptions) {
      requestSubscriptions();
    }
  }, [activeTab, hasRequestedSubscriptions, requestSubscriptions]);

  useEffect(() => {
    if (activeTab === "billing" && !hasRequestedInvoices) {
      requestInvoices();
    }
  }, [activeTab, hasRequestedInvoices, requestInvoices]);

  const typeFilteredNodes = useMemo(() => {
    if (subscriptionFilter === "rollups") {
      return [];
    }
    return subscriptions.nodes;
  }, [subscriptionFilter, subscriptions.nodes]);

  const typeFilteredRollups = useMemo(() => {
    if (subscriptionFilter === "nodes") {
      return [];
    }
    return subscriptions.rollups;
  }, [subscriptionFilter, subscriptions.rollups]);

  const statusCounts = useMemo(() => {
    const initialCounts: Record<Exclude<SubscriptionStatusFilter, "all">, number> = {
      active: 0,
      cancelled: 0,
      suspended: 0,
      pending_payment: 0,
    };

    return typeFilteredNodes.concat(typeFilteredRollups).reduce((acc, item) => {
      const bucket = mapStatusToFilterBucket(item.subscription_status, item.node_status, item.payment_link);
      if (bucket) {
        acc[bucket] += 1;
      }
      return acc;
    }, initialCounts);
  }, [typeFilteredNodes, typeFilteredRollups]);

  const filteredNodes = useMemo(() => {
    if (statusFilter === "all") {
      return typeFilteredNodes;
    }

    return typeFilteredNodes.filter(
      (subscription) =>
        mapStatusToFilterBucket(
          subscription.subscription_status,
          subscription.node_status,
          subscription.payment_link,
        ) === statusFilter,
    );
  }, [statusFilter, typeFilteredNodes]);

  const filteredRollups = useMemo(() => {
    if (statusFilter === "all") {
      return typeFilteredRollups;
    }

    return typeFilteredRollups.filter(
      (subscription) =>
        mapStatusToFilterBucket(
          subscription.subscription_status,
          subscription.node_status,
          subscription.payment_link,
        ) === statusFilter,
    );
  }, [statusFilter, typeFilteredRollups]);

  const noFilteredData = filteredNodes.length === 0 && filteredRollups.length === 0;
  const filterTabs: Array<{ id: "all" | "nodes" | "rollups"; label: string; count: number }> = [
    { id: "all", label: "All Products", count: subscriptions.totals.nodes + subscriptions.totals.rollups },
    { id: "nodes", label: "Smart Nodes", count: subscriptions.totals.nodes },
    { id: "rollups", label: "Rollups", count: subscriptions.totals.rollups },
  ];

  const typeFilteredTotalCount = typeFilteredNodes.length + typeFilteredRollups.length;

  const statusOptions = useMemo(
    () => [
      {
        id: "active" as const,
        label: `${STATUS_FILTER_META.active.label} (${statusCounts.active})`,
        dotClass: STATUS_FILTER_META.active.dotClass,
      },
      {
        id: "pending_payment" as const,
        label: `${STATUS_FILTER_META.pending_payment.label} (${statusCounts.pending_payment})`,
        dotClass: STATUS_FILTER_META.pending_payment.dotClass,
      },
      {
        id: "suspended" as const,
        label: `${STATUS_FILTER_META.suspended.label} (${statusCounts.suspended})`,
        dotClass: STATUS_FILTER_META.suspended.dotClass,
      },
      {
        id: "cancelled" as const,
        label: `${STATUS_FILTER_META.cancelled.label} (${statusCounts.cancelled})`,
        dotClass: STATUS_FILTER_META.cancelled.dotClass,
      },
      {
        id: "all" as const,
        label: `${STATUS_FILTER_META.all.label} (${typeFilteredTotalCount})`,
        dotClass: STATUS_FILTER_META.all.dotClass,
      },
    ],
    [
      statusCounts.active,
      statusCounts.pending_payment,
      statusCounts.cancelled,
      statusCounts.suspended,
      typeFilteredTotalCount,
    ],
  );

  const selectedStatusOption = useMemo(() => {
    return statusOptions.find((option) => option.id === statusFilter) ?? statusOptions[0];
  }, [statusFilter, statusOptions]);

  const currentStatusMeta = STATUS_FILTER_META[selectedStatusOption?.id ?? "active"];

  const subscriptionsContent = (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="Subscription filters" className="flex flex-wrap items-center gap-3">
          {filterTabs.map((tab) => {
            const isActive = subscriptionFilter === tab.id;
            return (
              <Button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSubscriptionFilter(tab.id)}
                variant="ghost"
                className={tx(
                  "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  isActive
                    ? "bg-gradient-to-r from-brand-primary via-brand-primary to-brand-primary text-white focus-visible:ring-[#9CA3FF]"
                    : "border border-[#D7DAF5] bg-white text-slate-600 hover:border-[#B9BEEF] hover:text-brand-primary focus-visible:ring-[#D7DAF5]",
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={tx(
                    "rounded-full px-2 py-0.5 text-xs font-semibold transition",
                    isActive ? "bg-white/25 text-white" : "bg-[#EEF2FF] text-brand-primary",
                  )}
                >
                  {tab.count}
                </span>
              </Button>
            );
          })}
        </div>

        <DropdownMenu isOpen={isStatusDropdownOpen} onClose={closeStatusDropdown} placement="bottom-end">
          <DropdownMenuButton
            as={Button}
            type="button"
            variant="ghost"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#4C46E5] px-4 py-2 text-sm font-semibold text-[#4C46E5] shadow-[0_6px_16px_rgba(76,70,229,0.12)] transition hover:bg-[#EFF1FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7CCF6]"
            onClick={toggleStatusDropdown}
            aria-label="Filter by subscription status"
          >
            <IconFilter className="size-4" />
            <span className={tx("h-2 w-2 rounded-full", currentStatusMeta.dotClass)} />
            <span>{selectedStatusOption?.label ?? STATUS_FILTER_META.active.label}</span>
          </DropdownMenuButton>

          <DropdownMenuList className="min-w-[220px] rounded-xl border border-[#D7DAF5] bg-white p-1 shadow-[0_18px_40px_rgba(15,23,42,0.15)]">
            {statusOptions.map((option) => {
              const isSelected = statusFilter === option.id;
              return (
                <DropdownMenuItem
                  key={option.id}
                  className={tx(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600",
                    isSelected ? "bg-[#EFF1FF] text-brand-primary" : "hover:bg-[#EFF1FF] hover:text-brand-primary",
                  )}
                  onClick={() => {
                    setStatusFilter(option.id);
                    closeStatusDropdown();
                  }}
                >
                  <span className={tx("h-2 w-2 rounded-full", option.dotClass)} />
                  <span className="flex-1">{option.label}</span>
                  {isSelected ? <IconCheckMark className="size-4 text-brand-primary" /> : null}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuList>
        </DropdownMenu>
      </div>
      {statusCounts.pending_payment > 0 && statusFilter !== "pending_payment" ? (
        <div className="w-fit text-sm font-semibold text-[#DC2626]">
          One or more nodes have pending payments.{" "}
          <button
            type="button"
            onClick={() => setStatusFilter("pending_payment")}
            className="font-semibold text-[#2563EB] underline underline-offset-2"
          >
            Click here
          </button>{" "}
          to check.
        </div>
      ) : null}

      {!subscriptions.hasRequested || subscriptions.isLoading ? (
        <div className="flex items-center justify-center rounded-3xl border border-[#E5E7EB]/80 bg-white p-12 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
          <ZeeveLoader label="Loading subscriptions..." />
        </div>
      ) : subscriptions.error ? (
        <div className="space-y-4 rounded-3xl border border-[#FECACA] bg-[#FEF2F2] p-8 text-sm text-[#B91C1C] shadow-[0_18px_36px_rgba(248,113,113,0.16)]">
          <p>We were unable to load your subscriptions. Please try again later.</p>
          <Button
            onClick={() => subscriptions.refresh?.()}
            className="w-max rounded-lg border border-white bg-white px-4 py-2 text-sm font-semibold text-[#B91C1C] shadow-[0_8px_20px_rgba(248,113,113,0.25)] transition hover:bg-[#FEE2E2]"
          >
            Retry
          </Button>
        </div>
      ) : noFilteredData ? (
        <div className="rounded-3xl border border-dashed border-[#CBD5F5] bg-white p-12 text-center text-sm text-[#6B7280] shadow-[0_20px_40px_rgba(15,23,42,0.04)]">
          No subscriptions match the selected filters.
        </div>
      ) : (
        <div className="space-y-8">
          {filteredNodes.length ? (
            <div className="space-y-3">
              <Heading as="h3" className="text-lg font-semibold text-slate-900">
                Smart Node Subscriptions ({filteredNodes.length})
              </Heading>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {filteredNodes.map((subscription, index) => {
                  const statusBucket = mapStatusToFilterBucket(subscription.subscription_status);
                  const canCancel = statusBucket !== "cancelled" && statusBucket !== "suspended";
                  const draftStatus = `${subscription.node_status ?? ""}`.toLowerCase();
                  const cancellationRequested =
                    draftStatus.includes("cancellation_requested") || draftStatus.includes("cancellation requested");
                  const needsPayment = isPaymentPending(
                    subscription.subscription_status,
                    subscription.node_status,
                    subscription.payment_link,
                  );
                  return (
                    <NodeSubscriptionCard
                      key={`${subscription.id}-${index}`}
                      subscription={subscription}
                      onCompletePayment={needsPayment ? (target) => handleCompletePayment(target) : undefined}
                      isCompletingPayment={needsPayment && isCompletingPaymentId === subscription.id}
                      onCancel={
                        !needsPayment && canCancel && !cancellationRequested
                          ? (target) =>
                              handleOpenCancelModal(
                                target.node_id,
                                target.plan_name ?? target.node_name ?? `Subscription ${target.id}`,
                              )
                          : undefined
                      }
                      isCanceling={
                        !needsPayment && canCancel && !cancellationRequested && cancelingId === subscription.id
                      }
                    />
                  );
                })}
              </div>
            </div>
          ) : null}

          {filteredRollups.length ? (
            <div className="space-y-3">
              <Heading as="h3" className="text-lg font-semibold text-slate-900">
                Rollup Subscriptions ({filteredRollups.length})
              </Heading>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {filteredRollups.map((subscription, index) => {
                  const statusBucket = mapStatusToFilterBucket(subscription.subscription_status);
                  const canCancel = statusBucket !== "cancelled" && statusBucket !== "suspended";
                  const draftStatus = `${subscription.node_status ?? ""}`.toLowerCase();
                  const cancellationRequested =
                    draftStatus.includes("cancellation_requested") || draftStatus.includes("cancellation requested");
                  const needsPayment = isPaymentPending(
                    subscription.subscription_status,
                    subscription.node_status,
                    subscription.payment_link,
                  );
                  return (
                    <RollupSubscriptionCard
                      key={`${subscription.id}-${index}`}
                      subscription={subscription}
                      onCompletePayment={needsPayment ? (target) => handleCompleteRollupPayment(target) : undefined}
                      isCompletingPayment={needsPayment && isCompletingPaymentId === subscription.id}
                      onCancel={
                        !needsPayment && canCancel && !cancellationRequested
                          ? (target) =>
                              handleOpenCancelModal(
                                target.id,
                                target.plan_name ?? target.service_name ?? `Subscription ${target.id}`,
                              )
                          : undefined
                      }
                      isCanceling={
                        !needsPayment && canCancel && !cancellationRequested && cancelingId === subscription.id
                      }
                    />
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );

  return (
    <main className="-mx-4 -mt-6 min-h-screen sm:-mx-6 lg:-mx-10 lg:-mt-8">
      <div className="flex w-full flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 sm:pt-8 md:px-10 md:pb-20 xl:px-14">
        <div className="space-y-3">
          <Heading as="h1" className="text-3xl font-semibold text-[#0B1220] sm:text-[34px]">
            My Account
          </Heading>
          <Z4Navigation
            breadcrumb={{
              items: [
                { href: ROUTES.PLATFORM.PAGE.DASHBOARD, label: "Dashboard", isActive: false, as: Link },
                { href: "", label: "Settings", isActive: true, as: Link },
              ],
            }}
          />
          <p className="text-sm font-medium text-[#4B5365]">
            Manage your profile and subscriptions from a single workspace.
          </p>
        </div>

        <div className="rounded-[28px] border border-[#E2E5F5] bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,0.15)] sm:px-6 sm:py-5">
          <Tabs
            items={[
              { id: "profile", label: "My Profile", icon: <IconUser className="text-[#A0A0A0]" /> },
              { id: "subscriptions", label: "Subscriptions", icon: <IconCard1 className="text-[#A0A0A0]" /> },
              { id: "billing", label: "Billing", icon: <IconReceipt3 className="text-[#A0A0A0]" /> },
            ]}
            className="text-xs md:text-sm"
            activeId={activeTab}
            onChange={(id) => setActiveTab(id as typeof activeTab)}
          />
        </div>

        {activeTab === "profile" ? (
          <ProfileTabContent
            profile={{
              data: profile.data,
              isLoading: profile.isLoading,
              error: profile.error,
              refresh: profile.refresh,
            }}
            onOpenPasswordModal={handleOpenPasswordModal}
            onDeleteAccount={handleDeleteAccount}
            notifications={{
              preferences: notifications.preferences,
              onToggle: notifications.toggle,
              onReset: notifications.reset,
            }}
            onSaveNotifications={handleSaveNotifications}
            isDeleteDisabled={hasActiveSubscription}
          />
        ) : activeTab === "subscriptions" ? (
          <section className="rounded-[28px] border border-[#E2E5F5] bg-white p-6 shadow-[0_18px_36px_rgba(15,23,42,0.15)]">
            {subscriptionsContent}
          </section>
        ) : (
          <BillingTab invoices={invoices} />
        )}

        <PasswordModal
          isOpen={isPasswordModalOpen}
          onClose={handleClosePasswordModal}
          email={profile.data?.email}
          onSubmit={password.change}
          isSubmitting={password.isUpdating}
        />
        <CancelSubscriptionModal
          isOpen={Boolean(pendingCancellation)}
          subscriptionName={pendingCancellation?.name}
          onCancel={handleCloseCancelModal}
          onConfirm={handleConfirmCancellation}
          isProcessing={isConfirmingCancellation || activeCancellationInFlight}
        />
        <DeleteAccountModal
          isOpen={isDeleteModalOpen}
          onCancel={handleCloseDeleteModal}
          onConfirm={handleConfirmDeleteAccount}
          isProcessing={isSubmittingDeletion}
          userName={profileFullName ?? profile.data?.email ?? null}
          userEmail={profileEmail || profile.data?.usercred || undefined}
        />
      </div>
    </main>
  );
};

export default SettingsPage;
