"use client";
import Image from "next/image";
import Link from "next/link";
import { Button, CopyButton, Heading, IconButton, Tooltip, useToast } from "@zeeve-platform/ui";
import { IconMonitor } from "@zeeve-platform/icons/electronic/outline";
import { ColumnDef, ReactTable, Row, createColumnHelper } from "@zeeve-platform/ui-common-components";
import { ComponentPropsWithoutRef, Dispatch, SetStateAction, useMemo, useState } from "react";
import { format } from "date-fns";
import axios, { AxiosError } from "axios";
import { capitalizeFirstLetter, toCapitalize, toShortString, withBasePath } from "@/utils/helpers";
import Status from "@/components/status/status";
import { formatDateWithoutTime } from "@/utils/date";
import { NodeListResponse, NetworkListResponseData } from "@/services/platform/network/list";
import { useConfigStore } from "@/store/config";
import ROUTES from "@/routes";
import { PROTOCOL_MAPPING } from "@/constants/protocol";
import { emailArr, networkProtocolIdArr } from "@/constants/solana-emails";
import { useUserStore } from "@/store/user";
import type { NodeNetworkStates } from "@/types/node";
import SearchInput from "@/components/ui/search-input";
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
  const { isLoading, pageSize, data, pageIndex, setPagination } = props;
  const [searchTerm, setSearchTerm] = useState("");

  const columnHelper = createColumnHelper<NetworkListResponseData>();

  const filteredData = useMemo(() => {
    if (!data?.data?.list) return [];

    const search = searchTerm.toLowerCase();

    return data.data.list.filter((row) => {
      const isNew = row.ready_at
        ? (new Date().getTime() - new Date(row.ready_at).getTime()) / (1000 * 60 * 60 * 24) <= 7
        : false;

      const nodeName = typeof row.node_name === "string" ? row.node_name.toLowerCase() : "";
      const endpoint = typeof row.endpoint === "string" ? row.endpoint.toLowerCase() : "";
      const networkType = typeof row.network_type === "string" ? row.network_type.toLowerCase() : "";
      // Check if the search term matches the endpoint directly or within a URL pattern
      const endpointMatches =
        endpoint &&
        (`https://${endpoint}/`.includes(search) ||
          `wss://${endpoint}/`.includes(search) ||
          search.includes(`https://${endpoint}/`) ||
          search.includes(`wss://${endpoint}/`));

      return (
        row.protocol_name?.toLowerCase().includes(search) ||
        row.status?.toLowerCase().includes(search) ||
        networkType.includes(search) ||
        nodeName.includes(search) ||
        endpointMatches ||
        (["0-layer", "0 layer", "0layer", "layer zero", "layerzero"].includes(search) && row.is_layer_zero === true) ||
        (search === "new" && isNew)
      );
    });
  }, [searchTerm, data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodeTableColumn: ColumnDef<NetworkListResponseData, any>[] = [
    columnHelper.accessor("protocol_name", {
      header: "Protocol",
      size: 140, // Increased size for better visibility of icon and name
      cell: (info) => {
        const name = info.getValue() || "";
        const protocolId = typeof info.row.original.protocol_id === "string" ? info.row.original.protocol_id : "";
        const logo =
          (typeof info.row.original.protocol_logo === "string" && info.row.original.protocol_logo.length > 0
            ? info.row.original.protocol_logo
            : withBasePath(`/assets/images/protocols/${PROTOCOL_MAPPING[protocolId]?.icon}`)) ??
          withBasePath("/assets/images/protocols/default.svg");
        const isLayerZero = info.row.original.is_layer_zero === true;

        return (
          <div className="flex flex-row items-center gap-2">
            <Image src={logo} alt={`${name || "Protocol"} Icon`} width={30} height={30} unoptimized />
            <div className="flex items-center gap-2 leading-4">
              {capitalizeFirstLetter(name)}
              {isLayerZero && (
                <span
                  className="ml-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 px-2 py-1 text-xs font-semibold text-white shadow-md"
                  style={{
                    background: "linear-gradient(to bottom right, #EF4444, #F97316)",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  LayerZero
                </span>
              )}
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("node_name", {
      header: "Node Name",
      size: 130, // Adjusted size
      cell: (info) => {
        const value = info.getValue() || "";
        const shortString = toShortString(value);
        const readyAt = info.row.original.ready_at;
        const isNew = readyAt
          ? (new Date().getTime() - new Date(readyAt).getTime()) / (1000 * 60 * 60 * 24) <= 7
          : false;
        return (
          <div className="flex items-center gap-1">
            {value.length > shortString.length ? (
              <>
                <Tooltip text={value} placement="top-start">
                  <div className="mr-2 max-w-[120px] truncate">{shortString}</div>
                </Tooltip>
                <CopyButton text={value} />
              </>
            ) : (
              value || "NA"
            )}
            {isNew && (
              <span
                className="ml-2 animate-pulse rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-md"
                style={{
                  background: "linear-gradient(to bottom right, #3B82F6, #9333EA)",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  animation: "shine 2s infinite",
                }}
              >
                New
              </span>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("network_type", {
      header: "Network Type",
      size: 110, // Adjusted size
      cell: (info) => {
        const value = info.getValue();
        return value ? capitalizeFirstLetter(value) : "NA";
      },
    }),
    columnHelper.accessor("status", {
      header: "Node Status",
      size: 130, // Adjusted size
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
      size: 100, // Adjusted size
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
      size: 120, // Adjusted size
      cell: (info) => {
        const rawDate = info.getValue();
        if (!rawDate || rawDate === false) return "NA";
        const date = new Date(rawDate as string);
        return !isNaN(date.getTime()) ? format(date, "dd MMM yyyy") : "NA";
      },
    }),
    columnHelper.accessor("created_on", {
      header: "Created On",
      size: 120, // Adjusted size
      cell: (info) => {
        const value = info.getValue();
        if (!value) return "NA";
        const date = new Date(value);
        return isNaN(date.getTime()) ? "NA" : formatDateWithoutTime(date);
      },
    }),
    columnHelper.accessor("endpoint", {
      header: "Endpoint",
      size: 140, // Adjusted size
      cell: (info) => {
        const value = info.getValue();
        const apiKey = info.row.original.api_key;
        const endpoint = apiKey && apiKey !== "" ? `https://${value}/${apiKey}/rpc` : value;
        return value ? (
          <div className="flex items-center gap-2">
            <Tooltip text={endpoint} placement="top-start">
              <div className="max-w-[140px] truncate">{endpoint}</div>
            </Tooltip>
            <CopyButton text={endpoint} />
          </div>
        ) : (
          "NA"
        );
      },
    }),
    columnHelper.display({
      header: "Actions",
      size: 140, // Reduced size to shift space to other columns
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

    const manageDisabled =
      !nodeId ||
      status !== "ready" ||
      (networkProtocolIdArr.includes(protocolId) && emailArr.includes(user?.usercred ?? ""));

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
          <Tooltip
            text={status === "provisioning" ? `Node is in ${status} status` : "Manage your node"}
            placement={"top-start"}
          >
            <Link
              href={{
                pathname: `${ROUTES.PLATFORM.PAGE.MANAGE_ARCHIVE_NODES}/${nodeId}`,
                query: {
                  protocolId,
                  planType: planType || "NA",
                  nextbilling: row.original.next_billing_date || "NA",
                  node: encodeURIComponent(JSON.stringify(row.original)),
                },
              }}
            >
              <Button
                size={"small"}
                className={actionButtonClass}
                isDisabled={manageDisabled}
                onClick={() => {
                  localStorage.setItem("from", "archivenode");
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
            <Link href={`${analyticsFrontendUrl}${ROUTES.ANALYTICS.PAGE.DASHBOARD}/${agentId}`}>
              <IconButton
                colorScheme="primary"
                variant={"ghost"}
                isDisabled={status !== "ready" || !agentId || Boolean(planType)}
              >
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
      <div className="flex flex-col items-center justify-between gap-2 lg:flex-row">
        <Heading as="h4">Archive Nodes ({filteredData?.length ?? "Loading..."})</Heading>
        <div className="sticky top-0 rounded-lg shadow-md">
          <SearchInput
            autoComplete="off"
            searchValue={searchTerm}
            placeholder="Search by Name / Protocol..."
            className="h-14 w-[310px] rounded-lg border border-brand-outline px-3 py-2 focus:border-brand-mainnet focus:ring-0 lg:w-96"
            onClearButtonClick={() => setSearchTerm("")}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ReactTable
        data={filteredData ?? []}
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
          pageCount: pageSize ? Math.ceil((filteredData?.length ?? 0) / pageSize) : 0,
          pageIndex,
          pageSize,
          setPagination,
        }}
      />
    </div>
  );
};

export { NodesTable };
export default NodesTable;
