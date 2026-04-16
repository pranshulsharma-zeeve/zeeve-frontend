// /* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import {
  CopyButton,
  IconButton,
  Tooltip,
  DropdownMenu,
  DropdownMenuButton,
  DropdownMenuItem,
  DropdownMenuList,
  useToggle,
} from "@zeeve-platform/ui";
import { ReactTable, createColumnHelper, ColumnDef, Row } from "@zeeve-platform/ui-common-components";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import { convertNumber, toShortString } from "@/utils/helpers";
import { isHexAddress } from "@/rollups/helper";

type ExplorerURLs = {
  l1: string;
  l2: string;
};

export type CombinedWalletType = {
  name: string;
  address?: string;
  balanceL1?: string | number;
  currencyL1?: string;
  balanceL2?: string | number;
  currencyL2?: string;
  source: string;
  explorerUrl?: string | ExplorerURLs;
};

const WalletTableRowActions = ({ row }: { row: Row<CombinedWalletType> }) => {
  const { isOpen, handleToggle, handleClose } = useToggle();

  // Single explorer URL case
  if (typeof row.original.explorerUrl === "string") {
    return (
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
    );
  }

  // Dual explorer URLs case (L1 & L2)
  return (
    <DropdownMenu isOpen={isOpen} placement="bottom-end" onClose={handleClose}>
      <DropdownMenuButton
        as={IconButton}
        onClick={handleToggle}
        colorScheme={"primary"}
        variant={"ghost"}
        isDisabled={!row.original.explorerUrl?.l1 && !row.original.explorerUrl?.l2}
      >
        <IconArrowUpRightFromSquare className="text-xl" />
      </DropdownMenuButton>
      <DropdownMenuList>
        <DropdownMenuItem
          isDisabled={!row.original.explorerUrl?.l1}
          onClick={() => {
            if (typeof row.original.explorerUrl === "object" && row.original.explorerUrl.l1) {
              window.open(row.original.explorerUrl.l1);
              handleClose();
            }
          }}
        >
          L1 Explorer
        </DropdownMenuItem>
        <DropdownMenuItem
          isDisabled={!row.original.explorerUrl?.l2}
          onClick={() => {
            if (typeof row.original.explorerUrl === "object" && row.original.explorerUrl.l2) {
              window.open(row.original.explorerUrl.l2);
              handleClose();
            }
          }}
        >
          L2 Explorer
        </DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
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
      const address = info.getValue();
      const isValidAddress = address && isHexAddress(address);
      if (!isValidAddress) return "NA";
      return (
        <Tooltip text={address} placement="top-start">
          <div className="flex items-center">
            <div className="mr-2">{toShortString(address, 7, 7)}</div>
            <CopyButton text={address} />
          </div>
        </Tooltip>
      );
    },
  }),
  columnHelper.accessor("source", {
    header: "Relevant For",
    cell: (info) => info.getValue(),
  }),
];

const getBalanceColumns = (isBalanceLoading: boolean = false) => [
  columnHelper.accessor("balanceL1", {
    header: "L1 Balance",
    cell: (info) => {
      const source = info.row.original.source ?? "";
      if (!source.includes("L1")) return "-";
      const value = info.row.original.balanceL1;
      const isEmpty = value === undefined || value === null || value === "";
      if (isEmpty && isBalanceLoading) {
        return <div className="h-5 w-20 animate-pulse rounded bg-gray-300" />;
      }
      if (isEmpty) return "Not Enough Data";
      return (
        <Tooltip text={`${info.row.original.balanceL1} ${info.row.original.currencyL1}`} placement="top-start">
          <div>
            {convertNumber(info.row.original.balanceL1)} {info.row.original.currencyL1}
          </div>
        </Tooltip>
      );
    },
  }),
  columnHelper.accessor("balanceL2", {
    header: "L2 Balance",
    cell: (info) => {
      const source = info.row.original.source ?? "";
      if (!source.includes("L2")) return "-";
      const value = info.row.original.balanceL2;
      const isEmpty = value === undefined || value === null || value === "";
      if (isEmpty && isBalanceLoading) {
        return <div className="h-5 w-20 animate-pulse rounded bg-gray-300" />;
      }
      if (isEmpty) return "Not Enough Data";
      return (
        <Tooltip text={`${info.row.original.balanceL2} ${info.row.original.currencyL2}`} placement="top-start">
          <div>
            {convertNumber(info.row.original.balanceL2)} {info.row.original.currencyL2}
          </div>
        </Tooltip>
      );
    },
  }),
];

interface WalletsProps {
  data: { list: Array<CombinedWalletType>; explorerL1Url?: string; explorerL2Url?: string };
  isLoading: boolean;
  isBalanceLoading?: boolean;
}
const getExplorerURL = (source: string, address?: string, explorerL1Url?: string, explorerL2Url?: string) => {
  const buildUrl = (base?: string) => {
    if (!base || !address) return "";
    const normalizedBase = base.startsWith("http") ? base : `https://${base}`;
    return `${normalizedBase.replace(/\/$/, "")}/address/${address}`;
  };
  if (source === "L1 & L2") {
    return {
      l1: buildUrl(explorerL1Url),
      l2: buildUrl(explorerL2Url),
    };
  }
  const endpoint = source === "L1" ? explorerL1Url : explorerL2Url;
  return buildUrl(endpoint);
};

const Wallets = ({ data, isLoading, isBalanceLoading = false }: WalletsProps) => {
  const [wallets, setWallets] = useState<Array<CombinedWalletType>>([]);
  useEffect(() => {
    const tempWallets = data?.list
      ? data.list.map((wallet) => {
          return {
            ...wallet,
            explorerUrl: getExplorerURL(wallet.source, wallet.address, data.explorerL1Url, data.explorerL2Url),
          };
        })
      : [];
    setWallets(tempWallets);
  }, [data?.explorerL1Url, data?.explorerL2Url, data?.list]);

  const columns = [
    ...walletTableColumns,
    ...getBalanceColumns(isBalanceLoading),
    columnHelper.display({
      header: "Actions",
      cell: ({ row }) => <WalletTableRowActions row={row} />,
      size: 50,
    }),
  ] as ColumnDef<CombinedWalletType, any>[];

  return (
    <div className="col-span-12 flex flex-col overflow-hidden rounded-lg border border-brand-outline">
      {/* <div className="p-4">
        <Heading as="h4">Wallets</Heading>
      </div> */}
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
