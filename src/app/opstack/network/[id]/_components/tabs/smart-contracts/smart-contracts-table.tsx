// /* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { CopyButton, Heading, IconButton, Tooltip } from "@zeeve-platform/ui";
import { ColumnDef, ReactTable, Row, createColumnHelper } from "@zeeve-platform/ui-common-components";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import { IconDocument1 } from "@zeeve-platform/icons/document/outline";
import { toShortString } from "@/utils/helpers";
import { normalizeHttpUrl } from "@/utils/rpc-utils";

type SmartContract = { name: string; address: string; explorerUrl?: string };

interface SmartContractsTableProps {
  data: { name: string; list?: Array<SmartContract>; explorerL1Url?: string; explorerL2Url?: string; source: string };
  isLoading: boolean;
}

const SmartContractTableRowActions = ({ row }: { row: Row<SmartContract> }) => {
  return (
    <div className="flex gap-4 lg:flex-row">
      <Tooltip text={"View on explorer"} placement={"top-start"}>
        <IconButton
          colorScheme={"primary"}
          variant={"ghost"}
          isDisabled={!row.original.explorerUrl}
          onClick={() => {
            if (row.original.explorerUrl) {
              window.open(row.original.explorerUrl);
            }
          }}
        >
          <IconArrowUpRightFromSquare className="text-xl" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const columnHelper = createColumnHelper<SmartContract>();

const SmartContractTableColumns: ColumnDef<SmartContract, any>[] = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => (
      <Tooltip text={info.getValue()} placement="top-start">
        <div>{info.getValue()}</div>
      </Tooltip>
    ),
  }),
  columnHelper.accessor("address", {
    header: "Address",
    cell: (info) => (
      <Tooltip text={info.getValue()} placement="top-start">
        <div className="flex items-center">
          <div className="mr-2">{toShortString(info.getValue(), 7, 7)}</div>
          <CopyButton text={info.getValue()} />
        </div>
      </Tooltip>
    ),
  }),
  columnHelper.display({
    header: "Actions",
    cell: ({ row }) => <SmartContractTableRowActions row={row} />,
    size: 50,
  }),
];

const getExplorerURL = (source: string, address?: string, explorerL1Url?: string, explorerL2Url?: string) => {
  const rawEndpoint = source === "L2" ? explorerL2Url : explorerL1Url;
  const endpoint = normalizeHttpUrl(rawEndpoint);
  if (address && endpoint) {
    return `${endpoint.replace(/\/$/, "")}/address/${address}`;
  }
  return "";
};

const SmartContractsTable = ({ data, isLoading }: SmartContractsTableProps) => {
  const [smartContracts, setSmartContracts] = useState<Array<SmartContract>>([]);
  useEffect(() => {
    const tempSmartContracts = data?.list
      ? data.list.map((smartContract) => {
          return {
            ...smartContract,
            explorerUrl: getExplorerURL(data.source, smartContract.address, data.explorerL1Url, data.explorerL2Url),
          };
        })
      : [];
    setSmartContracts(tempSmartContracts);
  }, [data?.explorerL1Url, data?.explorerL2Url, data?.list, data?.source]);

  return (
    <div className="col-span-12 flex flex-col overflow-hidden rounded-lg border border-brand-outline md:col-span-12 lg:col-span-6">
      <div className="mb-1 flex items-center justify-between p-4">
        <Heading as="h4">{data.name}</Heading>
        {/* <div className="flex gap-2">
          <Tooltip text={"Docs to deploy contract"} placement="top-start">
            <IconButton
              colorScheme="primary"
              variant={"ghost"}
              isDisabled={!data}
              isLoading={isLoading}
              onClick={() => {
                if (data) {
                  window.open("https://docs.zeeve.io/rollups/opstack/demo-network/deploying-contract");
                }
              }}
            >
              <IconDocument1 className="text-2xl" />
            </IconButton>
          </Tooltip>
        </div> */}
      </div>
      <div className="m-2">
        <ReactTable
          data={smartContracts}
          columns={SmartContractTableColumns}
          isLoading={isLoading}
          classNames={{
            table: "table-auto lg:table-fixed",
          }}
        />
      </div>
    </div>
  );
};

export default SmartContractsTable;
