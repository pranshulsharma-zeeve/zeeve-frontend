"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import axios, { AxiosError } from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Button, useToast, tx } from "@zeeve-platform/ui";
import { SubscriptionSummaryItem } from "@/services/platform/subscription/summary";
import { listInvoices } from "@/services/settings";
import { toCapitalize } from "@/utils/helpers";
import KeyValuePairRow from "@/components/ui/keyValuePairRow";
import CancelSubscriptionModal from "@/app/settings/components/CancelSubscriptionModal";
import usePlatformService from "@/services/platform/use-platform-service";
import useAxios from "@/hooks/use-axios";
import HTTP_STATUS from "@/constants/http";
import { PlatformServiceError } from "@/services/platform/types";
import useRollupService, { RollupKey } from "@/services/rollups/use-rollup-service";
import buildRollupDeployPayload from "@/services/rollups/build-rollup-deploy-payload";
import { redirectToStripeUrl } from "@/utils/redirects";

interface InvoiceRecord {
  invoice_id: number;
  name: string;
  date: string;
  amount_total: number;
  state: string;
  product: string;
  download_url: string;
  node_id?: string;
  service_id?: string;
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

interface SubscriptionsCardProps {
  subscriptionData: (SubscriptionSummaryItem & { protocolType: string })[] | undefined;
  isLoading: boolean;
}

const FILTERS = [
  { id: "all", label: "All Products" },
  { id: "rollup", label: "Rollups" },
  { id: "nodes", label: "Smart Nodes" },
] as const;

type SubscriptionSummaryWithProrated = SubscriptionSummaryItem & { protocolType: string };

const resolveProtocolType = (item: SubscriptionSummaryItem & { protocolType?: string }) => {
  const rawType = (item.protocolType || item.plan_type || item.subscription_type || "").toString().toLowerCase();

  if (rawType.includes("rollup") || rawType.includes("appchain")) {
    return "rollup";
  }

  if (rawType.includes("public") || rawType.includes("node") || rawType === "rpc" || rawType === "validator") {
    return "public";
  }

  return "unknown";
};

const SubscriptionsCard = ({ subscriptionData, isLoading }: SubscriptionsCardProps) => {
  const router = useRouter();
  const toast = useToast();
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCompletingPaymentId, setIsCompletingPaymentId] = useState<number | string | null>(null);
  const [isCancelingId, setIsCancelingId] = useState<number | string | null>(null);
  const [pendingCancellation, setPendingCancellation] = useState<{ id: number | string; name: string } | null>(null);
  const [isConfirmingCancellation, setIsConfirmingCancellation] = useState(false);
  const { request: retryCheckout, url: retryCheckoutUrl } =
    usePlatformService().subscription.retryCreateCheckoutSession();
  const { request: retryProrated, url: retryProratedUrl } = usePlatformService().subscription.retryProratedCharge();
  const { backendAxiosInstance } = useAxios();
  const { deploy } = useRollupService();

  const { data: invoiceResponse } = useSWR<InvoiceListResponse>("/api/v1/my_invoices", async () => {
    const { data } = await listInvoices();
    return data;
  });

  const invoices = invoiceResponse?.data?.data?.invoices || [];

  const filteredSubscriptions = useMemo(() => {
    if (!subscriptionData) {
      return [];
    }
    if (activeFilter === "all") {
      return subscriptionData;
    }
    if (activeFilter === "nodes") {
      return subscriptionData.filter((item) => resolveProtocolType(item) === "public");
    }
    return subscriptionData.filter((item) => resolveProtocolType(item) === "rollup");
  }, [activeFilter, subscriptionData]);

  const filterCounts = useMemo(() => {
    if (!subscriptionData) {
      return { all: 0, rollup: 0, nodes: 0 };
    }
    return {
      all: subscriptionData.length,
      rollup: subscriptionData.filter((item) => resolveProtocolType(item) === "rollup").length,
      nodes: subscriptionData.filter((item) => resolveProtocolType(item) === "public").length,
    };
  }, [subscriptionData]);

  useEffect(() => {
    setActiveSlide(0);
  }, [activeFilter, filteredSubscriptions.length]);

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

  const handleCancel = useCallback(
    async (id: number | string): Promise<boolean> => {
      if (!id) return false;
      setIsCancelingId(id);
      try {
        await backendAxiosInstance.post(`/api/v1/subscriptions/${id}/cancel`);
        toast("Subscription cancelled", {
          status: "success",
          message: "Your cancellation request has been submitted successfully.",
        });
        return true;
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        toast("Unable to cancel subscription", {
          status: "error",
          message: err.response?.data?.message ?? err.message ?? "Please try again later.",
        });
        return false;
      } finally {
        setIsCancelingId(null);
      }
    },
    [backendAxiosInstance, toast],
  );

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
    setIsConfirmingCancellation(true);
    const didCancel = await handleCancel(pendingCancellation.id);
    if (didCancel) {
      setPendingCancellation(null);
      router.refresh();
    }
    setIsConfirmingCancellation(false);
  }, [handleCancel, pendingCancellation, router]);

  const handleCompleteNodePayment = async (subscription: SubscriptionSummaryWithProrated) => {
    const rawStatus = `${subscription.node_status ?? ""}`.toLowerCase();
    const isDraft = rawStatus === "draft";
    const normalizedStatus = String(subscription.subscription_status ?? "").toLowerCase();
    const hasPaymentLink = Boolean(subscription.payment_link);
    const isSuspendedWithPaymentLink = hasPaymentLink && normalizedStatus.includes("suspend");
    const isPendingPayment =
      normalizedStatus.includes("pending_payment") ||
      normalizedStatus.includes("pending payment") ||
      normalizedStatus === "pending" ||
      isSuspendedWithPaymentLink;

    if (isSuspendedWithPaymentLink && subscription.payment_link) {
      handleStripeRedirect(subscription.payment_link);
      return;
    }
    if (!isDraft && !isPendingPayment) {
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
  };

  const resolveRollupKey = (subscription: SubscriptionSummaryWithProrated): RollupKey | null => {
    const source = `${subscription.subscription_type ?? subscription.plan_name ?? ""}`.toLowerCase();
    if (!source) return null;
    if (source.includes("arbitrum")) return "arbitrum-orbit";
    if (source.includes("optimism") || source.includes("op stack") || source.includes("opstack")) return "opstack";
    if (source.includes("polygon") || source.includes("cdk")) return "polygon-cdk";
    if (source.includes("zksync") || source.includes("zk sync") || source.includes("hyperchain")) return "zksync";
    return null;
  };

  const handleCompleteRollupPayment = async (subscription: SubscriptionSummaryWithProrated) => {
    const normalizedStatus = String(subscription.subscription_status ?? "").toLowerCase();
    if (subscription.payment_link && normalizedStatus.includes("suspend")) {
      handleStripeRedirect(subscription.payment_link);
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

    if (subscription.is_pending !== undefined) {
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
  };

  const filterButtonBaseClass =
    "inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006CFF]/40";
  const getFilterButtonClasses = (isActive: boolean) =>
    tx(
      filterButtonBaseClass,
      isActive
        ? "border-[#006CFF] bg-[#006CFF] text-white shadow-[0_6px_14px_rgba(0,108,255,0.3)]"
        : "text-[#0E2B6E] hover:border-[#006CFF] hover:text-[#006CFF] dark:border-white/20 dark:bg-white/5 dark:text-slate-200 dark:hover:border-[#8AB4FF] dark:hover:text-white",
    );
  const getFilterBadgeClasses = (isActive: boolean) =>
    tx(
      "rounded-full px-2 py-0.5 text-xs font-semibold",
      isActive ? "bg-white/95 text-[#006CFF]" : "bg-[#EEF2FF] text-[#006CFF] dark:bg-white/10 dark:text-white",
    );

  return (
    <div className="relative z-0 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#0E2B6E] dark:text-white">Subscriptions</p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/settings")}
          className="text-xs font-semibold text-[#2F66FF] transition-colors hover:text-[#1D4FD6] dark:text-[#8AB4FF] dark:hover:text-white"
        >
          View all
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className={getFilterButtonClasses(activeFilter === filter.id)}
          >
            <span>{filter.label}</span>
            <span className={getFilterBadgeClasses(activeFilter === filter.id)}>{filterCounts[filter.id]}</span>
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`subscription-skeleton-${index}`}
              className="h-32 animate-pulse rounded-2xl bg-slate-200/80 dark:bg-[var(--skeleton-dark)]"
            />
          ))}
        </div>
      ) : filteredSubscriptions.length ? (
        <div className="relative z-0 mt-6">
          <Swiper
            key={activeFilter}
            className="subscriptions-swiper"
            slidesPerView={1}
            spaceBetween={16}
            pagination={{ clickable: true, dynamicBullets: true, dynamicMainBullets: 5 }}
            modules={[Pagination]}
            breakpoints={{
              640: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 16 },
            }}
            onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
          >
            {filteredSubscriptions.map((item, index) => (
              <SwiperSlide key={item.id}>
                <SubscriptionCard
                  item={item}
                  isFirst={index === activeSlide}
                  invoices={invoices}
                  isCanceling={isCancelingId === (resolveProtocolType(item) === "rollup" ? item.id : item.node_id)}
                  isCompletingPayment={isCompletingPaymentId === item.id}
                  onCancel={(target) =>
                    handleOpenCancelModal(
                      resolveProtocolType(target) === "rollup" ? target.id : target.node_id,
                      target.plan_name ?? target.node_name ?? `Subscription ${target.id}`,
                    )
                  }
                  onCompletePayment={(target) =>
                    resolveProtocolType(target) === "rollup"
                      ? handleCompleteRollupPayment(target)
                      : handleCompleteNodePayment(target)
                  }
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200/70 p-6 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-300">
          You do not have any active subscriptions yet.
        </div>
      )}
      <CancelSubscriptionModal
        isOpen={Boolean(pendingCancellation)}
        subscriptionName={pendingCancellation?.name}
        onCancel={handleCloseCancelModal}
        onConfirm={handleConfirmCancellation}
        isProcessing={
          isConfirmingCancellation || (pendingCancellation ? isCancelingId === pendingCancellation.id : false)
        }
      />
    </div>
  );
};

const SubscriptionCard = ({
  item,
  isFirst,
  invoices,
  onCancel,
  onCompletePayment,
  isCanceling,
  isCompletingPayment,
}: {
  item: SubscriptionSummaryWithProrated;
  isFirst?: boolean;
  invoices: InvoiceRecord[];
  onCancel: (item: SubscriptionSummaryWithProrated) => void;
  onCompletePayment: (item: SubscriptionSummaryWithProrated) => void;
  isCanceling?: boolean;
  isCompletingPayment?: boolean;
}) => {
  const protocolType = resolveProtocolType(item);
  const protocolTypeName = protocolType === "public" ? "SMART NODES" : protocolType === "rollup" ? "ROLLUPS" : "NODES";
  const rawStatus = `${item.node_status ?? ""}`.toLowerCase();
  const normalizedStatus = String(item.subscription_status ?? "").toLowerCase();
  const normalizedNodeStatus = String(item.node_status ?? "").toLowerCase();
  const isDraft = rawStatus === "draft";
  const hasPaymentLink = Boolean(item.payment_link);
  const isSuspendedWithPaymentLink = hasPaymentLink && normalizedStatus.includes("suspend");
  const isCancellationRequested =
    normalizedStatus.includes("cancellation_requested") ||
    normalizedStatus.includes("cancellation requested") ||
    normalizedNodeStatus.includes("cancellation_requested") ||
    normalizedNodeStatus.includes("cancellation requested");
  const isCancelled = normalizedStatus.includes("cancelled") || normalizedStatus.includes("canceled");
  const isPendingPayment =
    isDraft ||
    isSuspendedWithPaymentLink ||
    normalizedStatus.includes("pending_payment") ||
    normalizedStatus.includes("pending payment") ||
    normalizedStatus === "pending";
  let statusText = toCapitalize(String(item.subscription_status ?? "NA"));
  if (isCancellationRequested) {
    statusText = "Cancellation Requested";
  }
  if (isPendingPayment) {
    statusText = "Payment Pending";
  }

  let statusClass = "bg-brand-tomato text-white";
  if (isPendingPayment) {
    statusClass = "bg-brand-yellow text-[#3F3F00]";
  } else if (isCancellationRequested) {
    statusClass = "bg-brand-tomato text-white";
  } else if (String(item.subscription_status).toLowerCase() === "active") {
    statusClass = "bg-brand-green text-white";
  }

  const canCancel = !isDraft && !isCancelled && !isCancellationRequested && !isPendingPayment;
  const invoice = invoices.find((inv) => String(inv?.node_id ?? inv?.service_id ?? "") === String(item?.node_id ?? ""));
  const hasReceipt = Boolean(invoice?.download_url);

  const handleReceiptClick = () => {
    if (invoice?.download_url) {
      window.open(invoice.download_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className="h-full rounded-2xl p-px"
      style={
        isFirst
          ? {
              background:
                "linear-gradient(#FFFFFF99, #FFFFFF99) padding-box, linear-gradient(102.16deg, rgba(255, 255, 255, 0) -16.55%, #006CFF 45.14%, rgba(255, 255, 255, 0) 111.77%) border-box",
              border: "1px solid transparent",
              boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.1)",
            }
          : {
              backgroundColor: "#FFFFFF99",
              boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.1)",
            }
      }
    >
      <div className="flex h-full flex-col gap-4 rounded-2xl bg-white/90 p-4 backdrop-blur-sm dark:bg-[var(--surface-2-dark)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-row items-center gap-2">
            <Image
              src={item.logo}
              alt={`${item.plan_name} logo`}
              width={24}
              height={24}
              unoptimized
              className="shrink-0"
            />
            <p className="truncate text-base font-bold text-[#0E2B6E] dark:text-white">{item.plan_name}</p>
          </div>
          <span
            className={`inline-flex whitespace-nowrap rounded-md px-2 py-1 text-xs font-normal uppercase ${statusClass}`}
          >
            {statusText}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="w-fit rounded-md bg-[#E6EEFF] px-2 py-1 text-xs font-normal tracking-[0.18em] text-[#365C8F] dark:bg-white/10 dark:text-[#8AB4FF]">
            {protocolTypeName}
          </div>
          <div className="flex items-center gap-2">
            {isPendingPayment ? (
              <Button
                size="small"
                variant="ghost"
                className="h-8 px-4 text-xs font-semibold"
                isLoading={isCompletingPayment}
                isDisabled={isCompletingPayment}
                onClick={() => onCompletePayment(item)}
              >
                Complete Payment
              </Button>
            ) : canCancel ? (
              <Button
                size="small"
                variant="ghost"
                className="h-8 px-3 text-xs font-semibold text-[#EB5757] hover:bg-red-50 hover:text-[#EB5757] dark:hover:bg-red-950/20"
                isLoading={isCanceling}
                isDisabled={isCanceling}
                onClick={() => onCancel(item)}
              >
                Cancel Subscription
              </Button>
            ) : null}
            {/* <button
              type="button"
              onClick={handleReceiptClick}
              disabled={!hasReceipt}
              className={`text-xs font-medium underline transition-colors ${
                hasReceipt
                  ? "text-[#2F66FF] hover:text-[#1D4FD6] dark:text-[#8AB4FF] dark:hover:text-white"
                  : "cursor-not-allowed text-slate-300 dark:text-slate-600"
              }`}
            >
              Receipt
            </button> */}
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <KeyValuePairRow
            title={protocolType === "rollup" ? "Rollup Name" : "Node Name"}
            value={item.node_name ?? "NA"}
            isLoading={false}
          />
          <KeyValuePairRow title="Expiring On" value={item.next_billing_date ?? "NA"} isLoading={false} />
          <KeyValuePairRow title="Amount" value={`$ ${item.amount ?? "NA"}`} isLoading={false} />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsCard;
