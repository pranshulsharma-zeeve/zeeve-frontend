/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { ColumnDef, ReactTable, Row, createColumnHelper } from "@zeeve-platform/ui-common-components";
import Link from "next/link";
import { CopyButton, Heading, IconButton, Tooltip } from "@zeeve-platform/ui";
import { IconInfoSquare } from "@zeeve-platform/icons/essential/outline";
import { useParams } from "next/navigation";
import { IconChart5Square } from "@zeeve-platform/icons/business/outline";
import { formatDate, toCapitalize, toShortString, withBasePath } from "@orbit/utils/helpers";
import NetworkNodeStatus from "@orbit/components/network-node-status";
import { Node } from "@orbit/types/node";
import { useNetworkStore } from "@orbit/store/network";
import useArbitrumOrbitService from "@orbit/services/arbitrum-orbit/use-arbitrum-orbit-service";
import ROUTES from "@orbit/routes";
import { getNetworkName } from "@orbit/utils/network-overview";

const NODE_VALUE: { [key: string]: string } = {
  nitroNode: "nitroNode",
  arbitrumSepolia: "arbitrumSepolia",
  ethereumSepolia: "ethereumSepolia",
  arbitrumDA: "arbitrumDA",
};

const NodeTableRowActions = ({ row }: { row: Row<Node> }) => {
  const { id } = useParams();
  const networkId = id as string;
  const nodeTypeValue = NODE_VALUE[row.original.nodeType];

  const networkInfo = useNetworkStore((state) => state.networkInfo);
  return (
    <div className="flex gap-4 lg:flex-row">
      <Tooltip text="View Details" placement="top-start">
        <Link
          href={withBasePath(
            `${ROUTES.ARBITRUM_ORBIT.PAGE.NETWORK}/${networkId}/nodes/${nodeTypeValue}/${row.original.nodeId}?network=${getNetworkName(networkInfo.data)}`,
          )}
        >
          <IconButton colorScheme="primary" variant={"ghost"} isDisabled={!(nodeTypeValue === "nitroNode")}>
            <IconInfoSquare width={24} height={24} />
          </IconButton>
        </Link>
      </Tooltip>
      <Tooltip text="Analytics" placement="top-start">
        <IconButton colorScheme="primary" variant={"ghost"} isDisabled>
          <IconChart5Square width={24} height={24} />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const columnHelper = createColumnHelper<Node>();

const nodeTableColumns: ColumnDef<Node, any>[] = [
  columnHelper.accessor("nodeId", {
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
  columnHelper.accessor("nodeName", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("nodeType", {
    header: "Type",
    cell: (info) => toCapitalize(info.getValue(), "all"),
  }),
  columnHelper.accessor("nodeStatus", {
    header: "Status",
    cell: (info) => <NetworkNodeStatus status={info.getValue()} />,
  }),
  columnHelper.accessor("nodeCreatedAt", {
    header: "Created On",
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.display({
    header: "Actions",
    cell: (props) => <NodeTableRowActions row={props.row} />,
  }),
];

const NodeTable = () => {
  const params = useParams();
  const networkId = params.id as string;
  const [{ pageIndex, pageSize }, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const {
    request: { data, isLoading },
  } = useArbitrumOrbitService().node.list(networkId, {
    page: pageIndex + 1,
    size: pageSize,
  });

  return (
    <div className="col-span-12 flex flex-col overflow-hidden rounded-lg border border-brand-outline">
      <div className="p-4">
        <Heading as="h4">Nodes ({data?.data.pagination.total || 0})</Heading>
      </div>
      <div className="m-2">
        <ReactTable
          data={data?.data.list ?? []}
          columns={nodeTableColumns}
          isLoading={isLoading}
          pagination={{
            pageCount: data?.data.pagination.total && pageSize ? Math.ceil(data?.data.pagination.total / pageSize) : 0,
            pageIndex: pageIndex,
            pageSize: pageSize,
            pageSizes: [3, 5, 10, 20, 50],
            setPagination: setPagination,
          }}
        />
      </div>
    </div>
  );
};

export default NodeTable;
