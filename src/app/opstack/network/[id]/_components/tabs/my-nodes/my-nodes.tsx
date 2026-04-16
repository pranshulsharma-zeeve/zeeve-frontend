"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ColumnDef, NodeNetworkStates, ReactTable, createColumnHelper } from "@zeeve-platform/ui-common-components";
import { CopyButton, Heading, Skeleton, Tooltip } from "@zeeve-platform/ui";
import DemoNetworkInfo from "../demo-network-info";
import NoDataAvailable from "../../no-data-available";
import NodeCard from "./node-card";
import useOpStackService from "@orbit/services/arbitrum-orbit/use-arbitrum-orbit-service";
import Status from "@/components/status";
import { formatDate, toShortString } from "@/utils/helpers";
import { normalizeHttpUrl } from "@/utils/rpc-utils";
import ViewGridIcon from "@/components/icons/view-grid";
import ViewListIcon from "@/components/icons/view-list";

type Node = {
  id: number;
  nodid: string;
  name: string;
  node_type: string;
  status: NodeNetworkStates | string;
  endpoint_url: string;
  created_at: string;
};

type ViewMode = "grid" | "list";

const NODE_TYPE_LABELS: Record<string, string> = {
  sequencer: "SEQUENCER",
  das: "DAS",
  rpc: "RPC",
  validator: "VALIDATOR",
};

const columnHelper = createColumnHelper<Node>();

const MyNodes = () => {
  const params = useParams();
  const networkId = params.id as string;
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const {
    request: { data, isLoading },
  } = useOpStackService().network.overview(networkId);

  const nodeList = (data?.data?.nodes ?? []) as Node[];

  const listViewColumns: ColumnDef<Node, any>[] = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue() ?? "NA",
    }),
    columnHelper.accessor("node_type", {
      header: "Type",
      cell: (info) => NODE_TYPE_LABELS[info.getValue() ?? ""] ?? info.getValue() ?? "NA",
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => <Status status={info.getValue()} />,
    }),
    columnHelper.accessor("endpoint_url", {
      header: "Endpoint",
      cell: (info) => {
        const value = info.getValue();
        if (!value) {
          return "NA";
        }
        const displayValue = normalizeHttpUrl(value);
        return (
          <Tooltip text={displayValue ?? value} placement="top-start">
            <div className="flex items-center">
              <div className="mr-2">{toShortString(displayValue ?? value)}</div>
              <CopyButton text={displayValue ?? value} />
            </div>
          </Tooltip>
        );
      },
    }),
    columnHelper.accessor("created_at", {
      header: "Created On",
      cell: (info) => formatDate(info.getValue()),
    }),
  ];

  return (
    <div className="flex flex-col gap-3 lg:gap-6">
      <DemoNetworkInfo />

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <Heading as="h4">Nodes</Heading>
        <button
          type="button"
          onClick={() => setViewMode((prev) => (prev === "list" ? "grid" : "list"))}
          aria-label={viewMode === "list" ? "Switch to grid view" : "Switch to list view"}
          title={viewMode === "list" ? "Switch to grid view" : "Switch to list view"}
          className="flex items-center gap-2 rounded-md border border-brand-outline px-3 py-1 text-sm font-medium text-brand-dark transition hover:bg-brand-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <span className="sr-only">{viewMode === "list" ? "List view active" : "Grid view active"}</span>
          <span className="text-brand-primary" aria-hidden>
            {viewMode === "list" ? <ViewListIcon /> : <ViewGridIcon />}
          </span>
        </button>
      </div>

      {/* Node Grid View */}
      {isLoading ? (
        <div className="grid grid-cols-12 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} role="status" as="div" className="col-span-4 m-2 h-56 rounded-lg p-4 shadow-md" />
          ))}
        </div>
      ) : nodeList.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-12 gap-6">
            {nodeList.map((node) => (
              <NodeCard key={node.nodid} node={node} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-brand-outline bg-white p-4">
            <ReactTable data={nodeList} columns={listViewColumns} isLoading={isLoading} />
          </div>
        )
      ) : (
        <NoDataAvailable />
      )}
    </div>
  );
};

export default MyNodes;
