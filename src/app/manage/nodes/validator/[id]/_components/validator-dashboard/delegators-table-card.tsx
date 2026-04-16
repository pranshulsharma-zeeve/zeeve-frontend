"use client";

import { useMemo, useState } from "react";
import { Card, Skeleton } from "@zeeve-platform/ui";

interface DelegatorRow {
  address: string;
  amount: number;
  denom: string;
  pctOfValidator: number;
}

type SortKey = "amount" | "pct";

interface DelegatorsTableCardProps {
  rows: DelegatorRow[];
  isLoading?: boolean;
}

const DelegatorsTableCard = ({ rows, isLoading = false }: DelegatorsTableCardProps) => {
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "amount",
    direction: "desc",
  });
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const diff = sort.key === "amount" ? a.amount - b.amount : a.pctOfValidator - b.pctOfValidator;
      return sort.direction === "asc" ? diff : -diff;
    });
    return copy;
  }, [rows, sort]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, page]);

  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key ? { key, direction: prev.direction === "asc" ? "desc" : "asc" } : { key, direction: "desc" },
    );
    setPage(1); // Reset to first page on sort
  };

  return (
    <Card className="flex flex-col gap-3 rounded-2xl border border-[#F0F0F0] bg-[#F8FAFC] p-4 shadow-md">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-xl font-medium text-[#09122D]">Delegators</h3>
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => toggleSort("amount")}
            className={`rounded-md border px-3 py-1 transition ${
              sort.key === "amount"
                ? "border-[#b4b2c9] font-semibold text-[#7D809C]"
                : "border-[#E4E6F3] text-[#7D809C]"
            }`}
          >
            Amount {sort.key === "amount" ? (sort.direction === "asc" ? "↑" : "↓") : ""}
          </button>
          <button
            type="button"
            onClick={() => toggleSort("pct")}
            className={`rounded-md border px-3 py-1 transition ${
              sort.key === "pct" ? "border-[#b4b2c9] font-semibold text-[#7D809C]" : "border-[#E4E6F3] text-[#7D809C]"
            }`}
          >
            % of Validator {sort.key === "pct" ? (sort.direction === "asc" ? "↑" : "↓") : ""}
          </button>
        </div>
      </div>

      {isLoading ? (
        <Skeleton role="status" as="div" className="h-60 w-full rounded-lg bg-gray-200" />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-[#09122D]">
              <thead>
                <tr className="border-b border-[#ECEFF5] text-xs uppercase text-[#7D809C]">
                  <th className="px-3 py-2 font-medium">Delegator</th>
                  <th className="px-3 py-2 font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Denom</th>
                  <th className="px-3 py-2 font-medium">% of Validator</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row) => (
                  <tr key={row.address} className="border-b border-[#F5F6FB] last:border-0">
                    <td className="px-3 py-2 font-mono text-xs lg:text-sm">{row.address}</td>
                    <td className="px-3 py-2">{row.amount.toLocaleString("en-US")}</td>
                    <td className="px-3 py-2 uppercase">{row.denom}</td>
                    <td className="px-3 py-2">{row.pctOfValidator.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              className="rounded-md border bg-[#fefaf3] px-3 py-1 text-xs text-black  disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="text-xs">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className="rounded-md border bg-[#fefaf3] px-3 py-1 text-xs text-black  disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </Card>
  );
};

export type { DelegatorRow };
export default DelegatorsTableCard;
