// /* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { CopyButton, IconButton, Tooltip } from "@zeeve-platform/ui";
import { ReactTable, createColumnHelper, ColumnDef, Row } from "@zeeve-platform/ui-common-components";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import { convertNumber, toShortString } from "@/utils/helpers";

type ExplorerURLs = {
  settlement: string;
  rollup: string;
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

const WalletTableRowActions = ({
  row,
  settlementLayerLabel,
  rollupLayerLabel,
}: {
  row: Row<CombinedWalletType>;
  settlementLayerLabel: string;
  rollupLayerLabel: string;
}) => {
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
          <Tooltip text={`View on ${settlementLayerLabel} explorer`} placement={"top-start"}>
            <IconButton
              colorScheme={"primary"}
              variant={"ghost"}
              isDisabled={!row.original.explorerUrl?.settlement}
              onClick={() => {
                if (typeof row.original.explorerUrl === "object" && row.original.explorerUrl.settlement) {
                  window.open(row.original.explorerUrl.settlement);
                }
              }}
            >
              <IconArrowUpRightFromSquare className="text-xl" />
            </IconButton>
          </Tooltip>
          <Tooltip text={`View on ${rollupLayerLabel} explorer`} placement={"top-start"}>
            <IconButton
              colorScheme={"primary"}
              variant={"ghost"}
              isDisabled={!row.original.explorerUrl?.rollup}
              onClick={() => {
                if (typeof row.original.explorerUrl === "object" && row.original.explorerUrl.rollup) {
                  window.open(row.original.explorerUrl.rollup);
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
    size: 80,
  }),
  columnHelper.accessor("address", {
    header: "Address",
    cell: (info) => {
      const value = info.getValue();
      const normalized = typeof value === "string" ? value.trim() : "";
      const isValid = normalized && normalized !== "-" && normalized.toLowerCase() !== "na";
      if (!isValid) return normalized || "NA";
      return (
        <div className="flex gap-x-2">
          <Tooltip text={normalized} placement="top-start">
            <div>{toShortString(normalized, 7, 7)}</div>
          </Tooltip>
          <CopyButton text={normalized} />
        </div>
      );
    },
  }),
  columnHelper.accessor("source", {
    header: "Relevant For",
    cell: (info) => info.getValue(),
    size: 80,
  }),
];

const getBalanceColumns = (
  settlementLayerLabel: string,
  rollupLayerLabel: string,
  isBalanceLoading: boolean = false,
) => [
  columnHelper.accessor("balanceL2", {
    header: `${settlementLayerLabel} Balance`,
    cell: (info) => {
      const source = info.row.original.source ?? "";
      if (!source.includes(settlementLayerLabel)) return "-";
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
    size: 80,
  }),
  columnHelper.accessor("balanceL3", {
    header: `${rollupLayerLabel} Balance`,
    cell: (info) => {
      const source = info.row.original.source ?? "";
      if (!source.includes(rollupLayerLabel)) return "-";
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
    size: 80,
  }),
];

interface WalletsProps {
  data: { list: Array<CombinedWalletType>; explorerSettlementUrl?: string; explorerRollupUrl?: string };
  isLoading: boolean;
  isBalanceLoading?: boolean;
  showAddressColumn?: boolean;
  showRelevantForColumn?: boolean;
  showActionsColumn?: boolean;
  showBalanceColumns?: boolean;
  showBorder?: boolean;
  settlementLayerLabel?: string;
  rollupLayerLabel?: string;
}

const getExplorerURL = (
  source: string,
  address: string | undefined,
  settlementLayerLabel: string,
  rollupLayerLabel: string,
  explorerSettlementUrl?: string,
  explorerRollupUrl?: string,
) => {
  const buildUrl = (base?: string) => {
    if (!base || !address) return "";
    const normalizedBase = base.startsWith("http") ? base : `https://${base}`;
    return `${normalizedBase.replace(/\/$/, "")}/address/${address}`;
  };
  if (source === `${settlementLayerLabel} & ${rollupLayerLabel}`) {
    return {
      settlement: buildUrl(explorerSettlementUrl),
      rollup: buildUrl(explorerRollupUrl),
    };
  }
  const endpoint = source === settlementLayerLabel ? explorerSettlementUrl : explorerRollupUrl;
  return buildUrl(endpoint);
};

const Wallets = ({
  data,
  isLoading,
  isBalanceLoading = false,
  showAddressColumn = true,
  showRelevantForColumn = true,
  showActionsColumn = true,
  showBalanceColumns = true,
  showBorder = true,
  settlementLayerLabel = "L2",
  rollupLayerLabel = "L3",
}: WalletsProps) => {
  const [wallets, setWallets] = useState<Array<CombinedWalletType>>([]);

  useEffect(() => {
    const tempWallets = data?.list
      ? data.list.map((wallet) => {
          return {
            ...wallet,
            explorerUrl: getExplorerURL(
              wallet.source,
              wallet.address,
              settlementLayerLabel,
              rollupLayerLabel,
              data.explorerSettlementUrl,
              data.explorerRollupUrl,
            ),
          };
        })
      : [];
    setWallets(tempWallets);
  }, [data?.explorerRollupUrl, data?.explorerSettlementUrl, data?.list, rollupLayerLabel, settlementLayerLabel]);

  const baseColumns = [
    walletTableColumns[0],
    ...(showAddressColumn ? [walletTableColumns[1]] : []),
    ...(showRelevantForColumn ? [walletTableColumns[2]] : []),
  ];

  const columns = [
    ...baseColumns,
    ...(showBalanceColumns ? getBalanceColumns(settlementLayerLabel, rollupLayerLabel, isBalanceLoading) : []),
    ...(showActionsColumn
      ? [
          columnHelper.display({
            header: "Actions",
            cell: ({ row }) => (
              <WalletTableRowActions
                row={row}
                settlementLayerLabel={settlementLayerLabel}
                rollupLayerLabel={rollupLayerLabel}
              />
            ),
            size: 60,
          }),
        ]
      : []),
  ] as ColumnDef<CombinedWalletType, any>[];

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-lg ${showBorder ? "border border-brand-outline" : ""} xl:col-span-5 2xl:col-span-5`}
    >
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
