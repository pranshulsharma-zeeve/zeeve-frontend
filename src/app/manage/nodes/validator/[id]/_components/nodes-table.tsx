"use client";
import Image from "next/image";
import Link from "next/link";
import { Button, CopyButton, Heading, IconButton, Tooltip, useToast } from "@zeeve-platform/ui";
import { IconMonitor } from "@zeeve-platform/icons/electronic/outline";
import { ColumnDef, ReactTable, Row, createColumnHelper } from "@zeeve-platform/ui-common-components";
import { ComponentPropsWithoutRef, Dispatch, SetStateAction, useState } from "react";
import { format } from "date-fns";
import axios, { AxiosError } from "axios";
import { capitalizeFirstLetter, toCapitalize, toShortString, withBasePath } from "@/utils/helpers";
import Status from "@/components/status/status";
import { NodeListResponse, NetworkListResponseData } from "@/services/platform/network/list";
import { formatDateWithoutTime } from "@/utils/date";
import { useConfigStore } from "@/store/config";
import ROUTES from "@/routes";
import { PROTOCOL_MAPPING } from "@/constants/protocol";
import { emailArr, networkProtocolIdArr } from "@/constants/solana-emails";
import { useUserStore } from "@/store/user";
import type { NodeNetworkStates } from "@/types/node";
import usePlatformService from "@/services/platform/use-platform-service";
import HTTP_STATUS from "@/constants/http";
import { PlatformServiceError } from "@/services/platform/types";
import { redirectToStripeUrl } from "@/utils/redirects";

const normalizeStatus = (status: string | null | undefined): NodeNetworkStates => {
  const normalized = status?.toLowerCase?.() ?? "";
  const explicitMap: Record<string, NodeNetworkStates> = {
    in_progress: "provisioning",
    draft: "payment pending",
  };
  if (explicitMap[normalized]) {
    return explicitMap[normalized];
  }
  const allowed: NodeNetworkStates[] = [
    "requested",
    "payment pending",
    "provisioning",
    "ready",
    "deleting",
    "deleted",
    "failed",
    "updating",
    "success",
    "retry",
    "closed",
    "suspended",
    "User Input Required",
    "syncing",
  ];
  return allowed.find((state) => state.toLowerCase() === normalized) ?? "requested";
};

interface NodeTableProps extends ComponentPropsWithoutRef<"div"> {
  isLoading: boolean;
  pageSize: number;
  pageIndex: number;
  setPagination: Dispatch<SetStateAction<{ pageIndex: number; pageSize: number }>>;
  data: NodeListResponse | undefined;
}

const NodesTable = (props: NodeTableProps) => {
  const { isLoading, data, pageIndex, pageSize, setPagination } = props;
  const columnHelper = createColumnHelper<NetworkListResponseData>();

  const nodeTableColumn: ColumnDef<NetworkListResponseData, any>[] = [
    columnHelper.accessor("protocol_name", {
      header: "Protocol",
      size: 140,
      cell: (info) => {
        const name = info.getValue() || "";
        const protocolId = typeof info.row.original.protocol_id === "string" ? info.row.original.protocol_id : "";
        const logo =
          (typeof info.row.original.protocol_logo === "string" && info.row.original.protocol_logo.length > 0
            ? info.row.original.protocol_logo
            : withBasePath(`/assets/images/protocols/${PROTOCOL_MAPPING[protocolId]?.icon}`)) ??
          withBasePath("/assets/images/protocols/default.svg");

        return (
          <div className="flex flex-row items-center gap-2">
            <Image src={logo} alt={`${name || "Protocol"} Icon`} width={30} height={30} unoptimized />
            <div className="text-sm leading-4">{capitalizeFirstLetter(name)}</div>
          </div>
        );
      },
    }),
    columnHelper.accessor("node_name", {
      header: "Node Name",
      size: 130,
      cell: (info) => {
        const value = info.getValue() || "";
        const shortValue = toShortString(value);
        return (
          <div className="flex items-center">
            {value.length > shortValue.length ? (
              <>
                <Tooltip text={value} placement="top-start">
                  <div className="mr-2 max-w-[120px] truncate">{shortValue}</div>
                </Tooltip>
                <CopyButton text={value} />
              </>
            ) : (
              value || "NA"
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("network_type", {
      header: "Network Type",
      size: 110,
      cell: (info) => {
        const value = info.getValue();
        return value ? capitalizeFirstLetter(value) : "NA";
      },
    }),
    columnHelper.accessor("status", {
      header: "Node Status",
      size: 130,
      cell: (info) => {
        const rawStatus = info.getValue();
        const isDraft = typeof rawStatus === "string" && rawStatus.toLowerCase() === "draft";
        return (
          <Status
            status={normalizeStatus(rawStatus)}
            statusText={isDraft ? "PAYMENT PENDING" : undefined}
            toolTipText={isDraft ? "Payment is pending for this node." : undefined}
            size="compact"
          />
        );
      },
    }),
    columnHelper.accessor("plan_type", {
      header: "Plan",
      size: 100,
      cell: (info) => {
        const raw = info.getValue();
        if (!raw) return "NA";
        if (raw === "advance_finalised_view") return "Advance (Finalised View)";
        if (raw === "enterprise_finalised_view") return "Enterprise (Finalised View)";
        return toCapitalize(String(raw));
      },
    }),
    columnHelper.accessor("next_billing_date", {
      header: "Next Billing Date",
      size: 120,
      cell: (info) => {
        const rawDate = info.getValue();
        if (!rawDate || rawDate === false) return "NA";
        const date = new Date(rawDate as string);
        return isNaN(date.getTime()) ? "NA" : format(date, "dd MMM yyyy");
      },
    }),
    columnHelper.accessor("created_on", {
      header: "Created On",
      size: 120,
      cell: (info) => {
        const value = info.getValue();
        if (!value) return "NA";
        const date = new Date(value);
        return isNaN(date.getTime()) ? "NA" : formatDateWithoutTime(date);
      },
    }),
    columnHelper.display({
      header: "Actions",
      size: 140,
      cell: (props) => <NodeRowActions row={props.row} />,
    }),
  ];

  const NodeRowActions = ({ row }: { row: Row<NetworkListResponseData> }) => {
    const config = useConfigStore((state) => state.config);
    const analyticsFrontendUrl = config?.url?.external?.analytics?.frontend ?? "";
    const user = useUserStore((state) => state.user);
    const toast = useToast();
    const [isRetrying, setIsRetrying] = useState(false);
    const handleStripeRedirect = (url: string) => {
      if (redirectToStripeUrl(url)) {
        return true;
      }
      toast("", { status: "error", message: "Invalid payment link. Please contact support." });
      return false;
    };
    const { request, url } = usePlatformService().subscription.retryCreateCheckoutSession();
    const { request: requestProrated, url: proratedUrl } = usePlatformService().subscription.retryProratedCharge();

    const nodeId = typeof row.original.node_id === "string" ? row.original.node_id : "";
    const protocolId = typeof row.original.protocol_id === "string" ? row.original.protocol_id : "";
    const planType = row.original.plan_type ?? "";
    const status = normalizeStatus(row.original.status);
    const agentId = typeof row.original.agent_id === "string" ? row.original.agent_id : "";
    const rawStatus = typeof row.original.status === "string" ? row.original.status.toLowerCase() : "";
    const isDraft = rawStatus === "draft";
    const subscriptionId =
      typeof row.original.subscription_id === "number"
        ? row.original.subscription_id
        : typeof row.original.subscription_id === "string"
          ? Number(row.original.subscription_id)
          : null;
    const normalizedSubscriptionId =
      typeof subscriptionId === "number" && Number.isFinite(subscriptionId) && subscriptionId > 0
        ? subscriptionId
        : null;
    const proratedOrders = Array.isArray(row.original.prorated_draft_order) ? row.original.prorated_draft_order : [];
    const chargeId = proratedOrders
      .map((order) => {
        const value = order?.charge_id;
        return typeof value === "number" ? value : typeof value === "string" ? Number(value) : null;
      })
      .find((value): value is number => typeof value === "number" && Number.isFinite(value) && value > 0);
    const hasProratedDraft = isDraft && proratedOrders.length > 0;
    const retryPayload = normalizedSubscriptionId ? { subscription_id: normalizedSubscriptionId } : null;

    const isReady = status === "ready";
    const manageDisabled =
      !nodeId || !isReady || (networkProtocolIdArr.includes(protocolId) && emailArr.includes(user?.usercred ?? ""));

    const handleRetryPayment = async () => {
      if (hasProratedDraft && !chargeId) {
        toast("", {
          status: "error",
          message: "Unable to initiate payment. Please contact support.",
        });
        return;
      }

      if (!hasProratedDraft && !retryPayload) {
        toast("", {
          status: "error",
          message: "Unable to initiate payment. Please contact support.",
        });
        return;
      }

      try {
        setIsRetrying(true);
        const response = hasProratedDraft
          ? await requestProrated(proratedUrl, { charge_id: chargeId as number })
          : await request(url, retryPayload as { subscription_id: number });
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
        const err = error as AxiosError<PlatformServiceError & { error?: string }>;
        const message = axios.isAxiosError(error)
          ? err.response?.data?.message ||
            err.response?.data?.error ||
            (err.response?.data as { detail?: string })?.detail ||
            err.message ||
            "An unexpected error occurred"
          : "An unexpected error occurred";
        toast("", {
          status: "error",
          message,
        });
      } finally {
        setIsRetrying(false);
      }
    };

    const actionButtonClass = "h-7 w-[140px] px-3 text-[12px] whitespace-nowrap";

    return (
      <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap lg:gap-3">
        {isDraft ? (
          <Tooltip text="Complete payment to activate your subscription" placement={"top-start"}>
            <Button
              size={"small"}
              isDisabled={!retryPayload}
              isLoading={isRetrying}
              className={actionButtonClass}
              onClick={handleRetryPayment}
            >
              Complete Payment
            </Button>
          </Tooltip>
        ) : (
          <Tooltip text={!isReady ? "Node is in provisioning state" : "Manage your node"} placement={"top-start"}>
            <Link
              href={`${ROUTES.PLATFORM.PAGE.MANAGE_VALIDATOR_NODES}/${nodeId}?protocolId=${protocolId}&planType=${planType}&node=${encodeURIComponent(
                JSON.stringify(row.original),
              )}`}
            >
              <Button
                size={"small"}
                className={actionButtonClass}
                isDisabled={manageDisabled}
                onClick={() => {
                  localStorage.setItem("from", "validatornode");
                }}
              >
                {planType ? "Manage" : "View Details"}
              </Button>
            </Link>
          </Tooltip>
        )}
        {!planType && (
          <Tooltip
            text={status === "ready" ? "Monitor Node" : "Monitoring is available in ready state"}
            placement={"top-start"}
          >
            <Link href={`${analyticsFrontendUrl}${ROUTES.ANALYTICS.PAGE.DASHBOARD}/${agentId}`} target={"_blank"}>
              <IconButton colorScheme="primary" variant={"ghost"} isDisabled={status !== "ready" || !agentId}>
                <IconMonitor className="text-xl" />
              </IconButton>
            </Link>
          </Tooltip>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 overflow-hidden lg:gap-6">
      <Heading as="h4">Validator Nodes ({data?.data?.pagination?.total ?? "Loading..."}) </Heading>
      <ReactTable
        data={data?.data?.list ?? []}
        columns={nodeTableColumn}
        isLoading={isLoading}
        classNames={{
          table: "table-fixed w-full text-[11px] sm:text-xs lg:text-sm",
          thead: {
            th: "px-2 py-2 text-[11px] sm:text-xs lg:text-sm",
          },
          tbody: {
            td: "px-2 py-2 align-middle",
          },
        }}
        pagination={{
          pageSizes: [5, 10, 20, 50, 100],
          pageCount: pageSize ? Math.ceil((data?.data?.pagination?.total ?? 0) / pageSize) : 0,
          pageSize,
          pageIndex,
          setPagination,
        }}
      />
    </div>
  );
};

export { NodesTable };
export default NodesTable;
