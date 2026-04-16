"use client";
import React from "react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface ResourceTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T | ((row: T, index: number) => string);
  empty?: React.ReactNode;
}

function getKey<T>(row: T, index: number, keyField?: keyof T | ((row: T, index: number) => string)) {
  if (!keyField) return String(index);
  if (typeof keyField === "function") return keyField(row, index);
  const value = (row as any)[keyField];
  return value != null ? String(value) : String(index);
}

function ResourceTable<T>({ columns, data, keyField, empty }: ResourceTableProps<T>) {
  if (!data || data.length === 0) {
    return <div className="rounded-md border border-white/10 p-6 text-sm opacity-80">{empty ?? "No data"}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-2">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-3 py-2 text-left text-xs font-semibold uppercase opacity-70">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={getKey(row, index, keyField)} className="rounded-md bg-white/5">
              {columns.map((col) => (
                <td key={String(col.key)} className={["px-3 py-3", col.className].filter(Boolean).join(" ")}>
                  {col.render ? col.render(row) : String((row as any)[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResourceTable;
