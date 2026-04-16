"use client";

import React, { useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@zeeve-platform/ui";
import {
  ThetaTransaction,
  ThetaTransactionType,
  THETA_TRANSACTION_TYPE_LABELS,
  DEFAULT_THETA_TRANSACTION_TYPES,
} from "@/types/theta-transactions";
import usePlatformService from "@/services/platform/use-platform-service";
import { toShortString } from "@/utils/helpers";
import CopyButton from "@/components/vizion/copy-button";

interface ThetaTransactionTableProps {
  nodeId: string;
  validatorAddress: string;
}

type ParsedTxnRow = {
  type: ThetaTransactionType;
  hash: string;
  block: string;
  age: string;
  from: string;
  to: string;
  value: {
    theta: string;
    tfuel: string;
  };
};

const formatAge = (timestamp?: string) => {
  if (!timestamp) return "-";
  const ms = Number.parseInt(timestamp, 10) * 1000;
  if (Number.isNaN(ms)) return "-";
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const years = Math.floor(days / 365);
  if (years > 0) return `${years} year${years > 1 ? "s" : ""}`;
  const months = Math.floor(days / 30);
  if (months > 0) return `${months} month${months > 1 ? "s" : ""}`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  if (mins > 0) return `${mins} min${mins > 1 ? "s" : ""}`;
  return "Just now";
};

const formatCoins = (coins?: { thetawei?: string; tfuelwei?: string }) => {
  const theta = coins?.thetawei ? Number(coins.thetawei) / 1e18 : 0;
  const tfuel = coins?.tfuelwei ? Number(coins.tfuelwei) / 1e18 : 0;

  return {
    theta: `${theta.toFixed(1)} THETA`,
    tfuel: `${tfuel.toFixed(1)} TFUEL`,
  };
};

const parseTransactionRow = (tx: ThetaTransaction, validatorAddress: string): ParsedTxnRow => {
  const type = tx.type as ThetaTransactionType;
  const hash = tx._id ?? tx.hash;
  const block = tx.block_height ?? "-";
  const age = formatAge(tx.timestamp);

  let from = "";
  let to = "";
  let value = { theta: "0 THETA", tfuel: "0 TFUEL" };

  if (type === 0) {
    const proposer = (tx.data as any)?.proposer;
    const outputs = (tx.data as any)?.outputs || [];
    from = proposer?.address ?? "";
    const matchedOutput = outputs.find((o: any) => o?.address === validatorAddress) || outputs[0];
    to = matchedOutput?.address ?? "";
    value = formatCoins(matchedOutput?.coins);
  } else if (type === 8) {
    const data = tx.data as any;
    from = data?.source?.address ?? "";
    to = data?.holder?.address ?? validatorAddress ?? "";
    value = formatCoins(data?.source?.coins);
  } else if (type === 9) {
    const data = tx.data as any;
    from = data?.holder?.address ?? validatorAddress ?? "";
    to = data?.source?.address ?? "";
    value = formatCoins(data?.source?.coins);
  } else if (type === 2) {
    const data = tx.data as any;
    from = data?.inputs?.[0]?.address || data?.source?.address || "";
    to = data?.outputs?.[0]?.address || "";
    value = formatCoins(data?.outputs?.[0]?.coins);
  }

  return { type, hash, block, age, from, to, value };
};

export default function ThetaTransactionTable({ nodeId, validatorAddress }: ThetaTransactionTableProps) {
  const [activeTypes, setActiveTypes] = useState<string[]>(DEFAULT_THETA_TRANSACTION_TYPES);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(DEFAULT_THETA_TRANSACTION_TYPES);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const hasFilterChanges = JSON.stringify([...selectedTypes].sort()) !== JSON.stringify([...activeTypes].sort());

  const {
    request: { data: transactionsData, isLoading: loading, error: fetchError },
  } = usePlatformService().vizion.thetaTransactions({
    nodeId,
    types: activeTypes,
    pageNumber: currentPage,
    limitNumber: 20,
  });

  const parsedRows = useMemo(() => {
    const txs = transactionsData?.data?.body ?? [];
    return txs.map((tx) => parseTransactionRow(tx, validatorAddress));
  }, [transactionsData?.data?.body, validatorAddress]);

  const totalPages = transactionsData?.data?.totalPageNumber ?? 1;
  const error = fetchError ? "Failed to load transactions" : null;

  const columns: ColumnDef<ParsedTxnRow>[] = [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type as ThetaTransactionType;
        return (
          <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
            {THETA_TRANSACTION_TYPE_LABELS[type] || `Type ${type}`}
          </span>
        );
      },
    },
    {
      accessorKey: "hash",
      header: "Txn Hash",
      cell: ({ row }) => {
        const hash = row.original.hash;
        return hash ? (
          <Tooltip text={hash} placement="top-start">
            <div className="flex items-center gap-2 text-sm font-normal text-[#09122D]">
              <span>{toShortString(hash, 10, 6)}</span>
              <CopyButton text={hash} />
            </div>
          </Tooltip>
        ) : (
          <span className="text-sm font-normal text-[#09122D]"></span>
        );
      },
    },
    {
      accessorKey: "block",
      header: "Block",
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.block}</span>,
    },
    {
      accessorKey: "age",
      header: "Age",
      cell: ({ row }) => <span className="text-sm text-gray-700">{row.original.age}</span>,
    },
    {
      accessorKey: "from",
      header: "From",
      cell: ({ row }) => {
        const addr = row.original.from;
        return addr ? (
          <Tooltip text={addr} placement="top-start">
            <div className="flex items-center gap-2 text-sm font-normal text-[#09122D]">
              <span>{toShortString(addr, 10, 6)}</span>
              <CopyButton text={addr} />
            </div>
          </Tooltip>
        ) : (
          <span className="text-sm font-normal text-[#09122D]"></span>
        );
      },
    },
    {
      accessorKey: "to",
      header: "To",
      cell: ({ row }) => {
        const addr = row.original.to;
        return addr ? (
          <Tooltip text={addr} placement="top-start">
            <div className="flex items-center gap-2 text-sm font-normal text-[#09122D]">
              <span>{toShortString(addr, 10, 6)}</span>
              <CopyButton text={addr} />
            </div>
          </Tooltip>
        ) : (
          <span className="text-sm font-normal text-[#09122D]"></span>
        );
      },
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => (
        <div className="flex flex-col font-mono text-sm leading-tight text-[#09122D]">
          <span>{row.original.value.theta}</span>
          <span>{row.original.value.tfuel}</span>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: parsedRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleTypeFilterChange = (type: string) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        const next = prev.filter((t) => t !== type);
        return next.length ? next : prev;
      }
      return [...prev, type];
    });
  };

  const handleSelectAllTypes = () => {
    setSelectedTypes(["0", "2", "8", "9"]);
  };

  const handleClearAllTypes = () => {
    setSelectedTypes(["0", "2", "8", "9"]);
  };

  const handleApplyFilters = () => {
    setActiveTypes(selectedTypes);
    setCurrentPage(1);
    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <h3 className="text-lg font-semibold text-gray-900">Transactions</h3>
        </div>

        <div className="flex justify-end border-b border-gray-200 bg-white px-6 py-3">
          <div className="flex items-center gap-2">
            {hasFilterChanges && (
              <button
                onClick={handleApplyFilters}
                className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-white transition-colors hover:bg-blue-700"
                title="Apply filter changes"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="text-sm">Reload</span>
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-1.5 transition-colors hover:bg-gray-50"
              >
                <svg className="size-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">Type</span>
                <svg
                  className={`size-4 text-gray-600 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 z-10 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="space-y-3 p-4">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <span className="text-sm font-semibold text-gray-900">Transaction Types</span>
                      <button onClick={() => setIsDropdownOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {["0", "2", "8", "9"].map((type) => (
                        <label
                          key={type}
                          className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => handleTypeFilterChange(type)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {THETA_TRANSACTION_TYPE_LABELS[Number(type) as ThetaTransactionType]}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="flex gap-2 border-t border-gray-200 pt-2">
                      <button
                        onClick={handleSelectAllTypes}
                        className="flex-1 rounded bg-blue-50 px-3 py-1.5 text-xs text-blue-700 hover:bg-blue-100"
                      >
                        Select All
                      </button>
                      <button
                        onClick={handleClearAllTypes}
                        className="flex-1 rounded bg-gray-100 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-200"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="size-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                      No transactions found for the selected filters.
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="whitespace-nowrap px-6 py-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
