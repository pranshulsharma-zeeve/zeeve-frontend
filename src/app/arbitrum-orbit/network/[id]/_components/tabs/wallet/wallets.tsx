// /* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { CopyButton, IconButton, Tooltip } from "@zeeve-platform/ui";
import { ReactTable, createColumnHelper, ColumnDef, Row } from "@zeeve-platform/ui-common-components";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import { convertNumber, toShortString } from "@/utils/helpers";

type ExplorerURLs = {
  l2: string;
  l3: string;
};

export type CombinedWalletType = {
  name: string;
  address?: string;
  balanceL2?: string | number;
  currencyL2?: string;
  balanceL3?: string | number;
  currencyL3?: string;
  source: string;
  explorerUrl?: string | ExplorerURLs;
};

const WalletTableRowActions = ({ row }: { row: Row<CombinedWalletType> }) => {
  return (
    <div className="flex gap-4 lg:flex-row">
      {typeof row.original.explorerUrl === "string" ? (
        <Tooltip text={`View on ${row.original.source} explorer`} placement={"top-start"}>
          <IconButton
            colorScheme={"primary"}
            variant={"ghost"}
            isDisabled={!row.original.explorerUrl}
            onClick={() => {
              if (typeof row.original.explorerUrl === "string" && row.original.explorerUrl) {
                window.open(row.original.explorerUrl);
              }
            }}
          >
            <IconArrowUpRightFromSquare className="text-xl" />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip text={"View on L2 explorer"} placement={"top-start"}>
            <IconButton
              colorScheme={"primary"}
              variant={"ghost"}
              isDisabled={!row.original.explorerUrl?.l2}
              onClick={() => {
                if (typeof row.original.explorerUrl === "object" && row.original.explorerUrl.l2) {
                  window.open(row.original.explorerUrl.l2);
                }
              }}
            >
              <IconArrowUpRightFromSquare className="text-xl" />
            </IconButton>
          </Tooltip>
          <Tooltip text={"View on L3 explorer"} placement={"top-start"}>
            <IconButton
              colorScheme={"primary"}
              variant={"ghost"}
              isDisabled={!row.original.explorerUrl?.l3}
              onClick={() => {
                if (typeof row.original.explorerUrl === "object" && row.original.explorerUrl.l3) {
                  window.open(row.original.explorerUrl.l3);
                }
              }}
            >
              <IconArrowUpRightFromSquare className="text-xl" />
            </IconButton>
          </Tooltip>
        </>
      )}
    </div>
  );
};

const columnHelper = createColumnHelper<CombinedWalletType>();
// table columns
const walletTableColumns: ColumnDef<CombinedWalletType, any>[] = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("address", {
    header: "Address",
    cell: (info) => {
      const value = info.getValue();
      const normalized = typeof value === "string" ? value.trim() : "";
      const isValid = normalized && normalized !== "-" && normalized.toLowerCase() !== "na";
      if (!isValid) return normalized || "NA";
      return (
        <Tooltip text={normalized} placement="top-start">
          <div className="flex items-center">
            <div className="mr-2">{toShortString(normalized, 7, 7)}</div>
            <CopyButton text={normalized} />
          </div>
        </Tooltip>
      );
    },
  }),
  columnHelper.accessor("source", {
    header: "Relevant For",
    cell: (info) => info.getValue(),
    size: 80,
  }),
];

const getBalanceColumns = (isBalanceLoading: boolean = false) => [
  columnHelper.accessor("balanceL2", {
    header: "L2 Balance",
    cell: (info) => {
      const source = info.row.original.source ?? "";
      if (!source.includes("L2")) return "-";
      const value = info.row.original.balanceL2;
      const currency = info.row.original.currencyL2 ?? "ETH";
      const isEmpty = value === undefined || value === null || value === "";
      if (isEmpty && isBalanceLoading) {
        return <div className="h-5 w-20 animate-pulse rounded bg-gray-300" />;
      }
      if (isEmpty) return "Not Enough Data";
      const numValue = typeof value === "number" ? value : parseFloat(String(value));
      const displayValue = numValue < 0.00001 ? "0" : convertNumber(value);
      return (
        <Tooltip text={`${info.row.original.balanceL2} ${currency}`} placement="top-start">
          <div>
            {displayValue} {currency}
          </div>
        </Tooltip>
      );
    },
  }),
  columnHelper.accessor("balanceL3", {
    header: "L3 Balance",
    cell: (info) => {
      const source = info.row.original.source ?? "";
      if (!source.includes("L3")) return "-";
      const value = info.row.original.balanceL3;
      const currency = info.row.original.currencyL3 ?? "ETH";
      const isEmpty = value === undefined || value === null || value === "";
      if (isEmpty && isBalanceLoading) {
        return <div className="h-5 w-20 animate-pulse rounded bg-gray-300" />;
      }
      if (isEmpty) return "Not Enough Data";
      const numValue = typeof value === "number" ? value : parseFloat(String(value));
      const displayValue = numValue < 0.00001 ? "0" : convertNumber(value);
      return (
        <Tooltip text={`${info.row.original.balanceL3} ${currency}`} placement="top-start">
          <div>
            {displayValue} {currency}
          </div>
        </Tooltip>
      );
    },
  }),
];

interface WalletsProps {
  data: { list: Array<CombinedWalletType>; explorerL2Url?: string; explorerL3Url?: string };
  isLoading: boolean;
  isBalanceLoading?: boolean;
  showRelevantForColumn?: boolean;
  showActionsColumn?: boolean;
  showBalanceColumns?: boolean;
  showBorder?: boolean;
}

const getExplorerURL = (source: string, address?: string, explorerL2Url?: string, explorerL3Url?: string) => {
  const buildUrl = (base?: string) => {
    if (!base || !address) return "";
    const normalizedBase = base.startsWith("http") ? base : `https://${base}`;
    return `${normalizedBase.replace(/\/$/, "")}/address/${address}`;
  };
  if (source === "L2 & L3") {
    return {
      l2: buildUrl(explorerL2Url),
      l3: buildUrl(explorerL3Url),
    };
  }
  const endpoint = source === "L2" ? explorerL2Url : explorerL3Url;
  return buildUrl(endpoint);
};

const Wallets = ({
  data,
  isLoading,
  isBalanceLoading = false,
  showRelevantForColumn = true,
  showActionsColumn = true,
  showBalanceColumns = true,
  showBorder = true,
}: WalletsProps) => {
  const [wallets, setWallets] = useState<Array<CombinedWalletType>>([]);

  useEffect(() => {
    const tempWallets = data?.list
      ? data.list.map((wallet) => {
          return {
            ...wallet,
            explorerUrl: getExplorerURL(wallet.source, wallet.address, data.explorerL2Url, data.explorerL3Url),
          };
        })
      : [];
    setWallets(tempWallets);
  }, [data?.explorerL2Url, data?.explorerL3Url, data?.list]);

  const baseColumns = [
    walletTableColumns[0],
    walletTableColumns[1],
    ...(showRelevantForColumn ? [walletTableColumns[2]] : []),
  ];

  const columns = [
    ...baseColumns,
    ...(showBalanceColumns ? getBalanceColumns(isBalanceLoading) : []),
    ...(showActionsColumn
      ? [
          columnHelper.display({
            header: "Actions",
            cell: ({ row }) => <WalletTableRowActions row={row} />,
            size: 60,
          }),
        ]
      : []),
  ] as ColumnDef<CombinedWalletType, any>[];

  return (
    <div className={`flex flex-col overflow-hidden rounded-lg ${showBorder ? "border border-brand-outline" : ""} xl:col-span-5 2xl:col-span-5`}>
      <div className="m-2">
        <ReactTable
          data={wallets}
          columns={columns}
          isLoading={isLoading}
          classNames={{
            table: "table-auto lg:table-fixed",
          }}
        />
      </div>
    </div>
  );
};

export default Wallets;
