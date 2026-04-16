/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { ColumnDef, ReactTable, Row, createColumnHelper } from "@zeeve-platform/ui-common-components";
import Link from "next/link";
import { Badge, CopyButton, Heading, IconButton, Tooltip, tx } from "@zeeve-platform/ui";
import { IconInfoSquare } from "@zeeve-platform/icons/essential/outline";
// import { IconChart5Square } from "@zeeve-platform/icons/business/outline";
import { useParams } from "next/navigation";
import { formatDate, toShortString } from "@/utils/helpers";
import Status from "@/components/status";
// import FlagState from "@/components/flag-state";
import { NodeNetworkStates, NodeType } from "@/types/node";
import { useZksyncStore } from "@/store/zksync";
// import { useModalStore } from "@/store/modal";

type Node = {
  id: string;
  name: string;
  status: NodeNetworkStates;
  createdAt: Date;
  endpoint?: string;
  nodeType: NodeType;
  health?: {
    healthStatus?: boolean;
    numOfFiringAlerts?: number;
  };
  rpcAccess?: { http?: { enabled: boolean; endpoint: string }; ws?: { enabled: boolean; endpoint: string } };
};

const NODE_HEADING: Record<string, string> = {
  zkevm: "ZkEVM Nodes",
  prover: "Prover Nodes",
  dac: "DAC Nodes",
  rpc: "RPC Nodes",
};

const NodeTableRowActions = ({ row }: { row: Row<Node> }) => {
  const { id } = useParams();
  const networkId = id as string;
  const superNetInfo = useZksyncStore((state) => state.zksyncInfo);
  // const { openModal } = useModalStore();
  return (
    <div className="flex gap-4 lg:flex-row">
      <Tooltip text="View Details" placement="top-start">
        <Link
          href={`/zksync/network/${networkId}/nodes/${row.original.nodeType}/${row.original.id}?network=${superNetInfo.data?.name}`}
        >
          <IconButton colorScheme="primary" variant={"ghost"}>
            <IconInfoSquare width={24} height={24} />
          </IconButton>
        </Link>
      </Tooltip>
      {/* <Tooltip text="Analytics" placement="top-start">
                <IconButton colorScheme="primary" variant={"ghost"}>
                    <IconChart5Square width={24} height={24} />
                </IconButton>
            </Tooltip> */}
    </div>
  );
};

const columnHelper = createColumnHelper<Node>();

const nodeTableColumns: ColumnDef<Node, any>[] = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => (
      <Tooltip text={info.getValue()} placement="top-start">
        <div className="flex items-center">
          <div className="mr-2">{toShortString(info.getValue())}</div>
          <CopyButton text={info.getValue()} />
        </div>
      </Tooltip>
    ),
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <Status status={info.getValue()} />,
  }),
  columnHelper.accessor("health", {
    header: "Health",
    cell: (info) => {
      const health = info.row.original.health;
      return (
        <>
          {typeof health?.healthStatus === "boolean" ? (
            <div className="flex items-center justify-start">
              <div
                className={tx(
                  "mr-2 rounded-md p-1 px-6 text-center text-xs font-bold",
                  {
                    "bg-brand-green": health.healthStatus,
                  },
                  {
                    "bg-brand-red": !health.healthStatus,
                  },
                  {
                    "text-brand-light": info.getValue(),
                  },
                )}
              >
                {health.healthStatus ? "HEALTHY" : "UNHEALTHY"}
              </div>
              {health?.numOfFiringAlerts && !health.healthStatus ? (
                <Tooltip
                  text={`${health?.numOfFiringAlerts} ${
                    health.numOfFiringAlerts > 1 ? "alerts are" : "alert is"
                  } firing in your network`}
                  placement={"top-start"}
                >
                  <Badge className="animate-pulse" colorScheme={"red"} variant={"outline"}>
                    {health?.numOfFiringAlerts}
                  </Badge>
                </Tooltip>
              ) : null}
            </div>
          ) : (
            "NA"
          )}
        </>
      );
    },
  }),
  // columnHelper.accessor("rpcAccess.http.enabled", {
  //     header: "HTTPS",
  //     cell: (info) => <FlagState flag={info.getValue()} />,
  // }),
  // columnHelper.accessor("rpcAccess.ws.enabled", {
  //     header: "WSS",
  //     cell: (info) => <FlagState flag={info.getValue()} />,
  // }),
  columnHelper.accessor("createdAt", {
    header: "Created On",
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.display({
    header: "Actions",
    cell: (props) => <NodeTableRowActions row={props.row} />,
  }),
];

const NodeTable = ({ isLoading, data }: { isLoading: boolean; data: { nodeType: NodeType; list?: Array<Node> } }) => {
  return (
    <div className="flex flex-col gap-2 overflow-hidden p-4 lg:gap-4">
      <Heading as="h5">{NODE_HEADING[data.nodeType] ?? "Nodes"}</Heading>
      <div>
        <ReactTable
          data={data.list ?? []}
          columns={nodeTableColumns}
          isLoading={isLoading}
          status={{
            noData: data.nodeType === "dac" || data.nodeType === "prover" ? "Unavailable in testnet." : "",
          }}
        />
      </div>
    </div>
  );
};

export default NodeTable;
