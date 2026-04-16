import React, { useState, useMemo } from "react";
import EmptyState from "@/modules/reports/components/empty-state";

interface Column {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
}

interface PaginatedComparisonTableProps<T> {
  data: T[];
  columns: Column[];
  renderRow: (item: T) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
}

const PaginatedComparisonTable = <T,>({
  data,
  columns,
  renderRow,
  emptyTitle = "No data",
  emptyDescription = "Data will appear once available.",
  pageSize = 10,
}: PaginatedComparisonTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show ellipsis for large page counts
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50">
              <tr className="border-b border-slate-200">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600 ${
                      column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : "text-left"
                    }`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.map((item, index) => (
                <tr key={index} className="transition-colors hover:bg-slate-50/50">
                  {renderRow(item)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm font-medium text-slate-600">
            Showing <span className="font-semibold text-slate-900">{(currentPage - 1) * pageSize + 1}</span> to{" "}
            <span className="font-semibold text-slate-900">{Math.min(currentPage * pageSize, data.length)}</span> of{" "}
            <span className="font-semibold text-slate-900">{data.length}</span> results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="group rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:shadow disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-300 disabled:hover:shadow-sm"
            >
              <span className="flex items-center gap-1.5">
                <svg
                  className="size-4 transition-transform group-hover:-translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </span>
            </button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) =>
                typeof page === "number" ? (
                  <button
                    key={`page-${page}`}
                    onClick={() => handlePageClick(page)}
                    className={`min-w-10 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                      currentPage === page
                        ? "bg-brand-primary text-white shadow-md shadow-brand-primary/30 ring-2 ring-brand-primary/20"
                        : "border border-slate-300 bg-white text-slate-700 shadow-sm hover:border-slate-400 hover:bg-slate-50 hover:shadow"
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={`ellipsis-${index}`} className="px-2 text-sm font-medium text-slate-400">
                    {page}
                  </span>
                ),
              )}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="group rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:shadow disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-300 disabled:hover:shadow-sm"
            >
              <span className="flex items-center gap-1.5">
                Next
                <svg
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginatedComparisonTable;
