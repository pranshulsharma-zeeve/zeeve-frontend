"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ColumnDef, ReactTable, createColumnHelper } from "@zeeve-platform/ui-common-components";
import { CopyButton, Heading, Tooltip } from "@zeeve-platform/ui";
import { useZkSyncDashboard } from "../dashboard-context";
import NodeCard from "./node-card";
import { NodeNetworkStates, NodeType } from "@/types/node";
import ListHeaderFilter, { ListHeaderFilterProps } from "@/components/vizion/filter";
import Status from "@/components/status";
import { formatDate, toShortString } from "@/utils/helpers";
import { normalizeHttpUrl } from "@/utils/rpc-utils";
import ViewGridIcon from "@/components/icons/view-grid";
import ViewListIcon from "@/components/icons/view-list";
import { useZksyncStore } from "@/store/zksync";

type Node = {
  id: string;
  name: string;
  status?: NodeNetworkStates;
  createdAt?: Date;
  endpoint?: string;
  nodeType: NodeType;
  description?: string;
};

type ViewMode = "grid" | "list";

const NODE_TYPE_LABELS: Record<string, string> = {
  all: "All Services",
  // zkevm: "ZkEVM Nodes",
  rpc: "RPC Node",
  prover: "Prover Node",
  zksync: "ZkSync Node",
  // dac: "DAC Nodes",
};

const columnHelper = createColumnHelper<Node>();

const Nodes = () => {
  const { id } = useParams();
  const networkId = id as string;
  const superNetInfo = useZksyncStore((state) => state.zksyncInfo);
  const [selectedNodeType, setSelectedNodeType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const { normalized, isLoading } = useZkSyncDashboard();
  const nodeMap = normalized?.nodesByType ?? {};

  // Prepare all nodes with their types
  const allNodes: Node[] = useMemo(() => {
    if (!nodeMap) return [];
    const nodes: Node[] = [];
    (Object.entries(nodeMap) as Array<[string, any]>).forEach(([type, list]) => {
      const typedList = Array.isArray(list)
        ? (list as Array<{
            id: string;
            name: string;
            status?: NodeNetworkStates;
            createdAt?: Date;
            endpoint?: string;
            description?: string;
            metadata?: Record<string, unknown>;
          }>)
        : [];
      typedList.forEach((node) => {
        nodes.push({
          id: node.id,
          name: node.name,
          status: node.status,
          createdAt: node.createdAt,
          endpoint: node.endpoint,
          nodeType: type as NodeType,
          description: node?.metadata?.description as string,
        });
      });
    });
    return nodes;
  }, [nodeMap]);

  // Filter nodes based on selected type
  const filteredNodes =
    selectedNodeType === "all" ? allNodes : allNodes.filter((node) => node.nodeType === selectedNodeType);

  const networkName = superNetInfo.data?.name ?? "";

  const listViewColumns: ColumnDef<Node, any>[] = useMemo(
    () => [
      // columnHelper.accessor("id", {
      //   header: "ID",
      //   cell: (info) => (
      //     <Tooltip text={info.getValue()} placement="top-start">
      //       <div className="flex items-center">
      //         <div className="mr-2">{toShortString(info.getValue())}</div>
      //         <CopyButton text={info.getValue()} />
      //       </div>
      //     </Tooltip>
      //   ),
      // }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue() ?? "NA",
      }),
      columnHelper.accessor("nodeType", {
        header: "Type",
        cell: (info) => NODE_TYPE_LABELS[info.getValue()] ?? info.getValue(),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <Status status={info.getValue()} />,
      }),
      columnHelper.accessor("endpoint", {
        header: "Endpoint",
        cell: (info) => {
          const value = info.getValue();
          const nodeType = info.row.original.nodeType;
          const displayValue = nodeType === "rpc" ? normalizeHttpUrl(value) : value;
          if (!value) {
            return "NA";
          }

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
      columnHelper.accessor("createdAt", {
        header: "Created On",
        cell: (info) => formatDate(info.getValue()),
      }),
      // columnHelper.display({
      //   id: "actions",
      //   header: "Actions",
      //   cell: (props) => (
      //     <Link
      //       className="font-semibold text-brand-primary"
      //       href={`/zksync/network/${networkId}/nodes/${props.row.original.nodeType}/${props.row.original.id}?network=${networkName}`}
      //     >
      //       View Details
      //     </Link>
      //   ),
      // }),
    ],
    [networkId, networkName],
  );

  const filterItems: ListHeaderFilterProps["items"] = Object.entries(NODE_TYPE_LABELS).map(([key, label]) => ({
    title: label,
    colour: selectedNodeType === key ? "#09122D" : "#6B7280",
    selected: selectedNodeType === key,
    onClick: () => setSelectedNodeType(key),
  }));

  return (
    <div className="flex flex-col gap-3 lg:gap-6">
      {/* <DemoSupernetInfo /> */}

      {/* Filter Dropdown */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-xl font-semibold">{NODE_TYPE_LABELS[selectedNodeType]}</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ListHeaderFilter filterText="Filter" items={filterItems} />
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
      </div>

      {/* Node Cards Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-lg">Loading nodes...</p>
        </div>
      ) : filteredNodes.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-lg">No nodes available</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {filteredNodes.map((node) => (
            <NodeCard
              key={node.id}
              nodeId={node.id}
              networkId={networkId}
              nodeName={node.name}
              nodeType={node.nodeType}
              nodeStatus={node.status}
              nodeCreatedAt={node.createdAt}
              endpoint={node.endpoint}
              description={node?.description}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-brand-outline bg-white p-4">
          <ReactTable data={filteredNodes} columns={listViewColumns} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default Nodes;
