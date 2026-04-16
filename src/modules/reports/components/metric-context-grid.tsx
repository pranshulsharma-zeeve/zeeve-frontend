"use client";

import type { ReactNode } from "react";
import { Card, tx } from "@zeeve-platform/ui";
import TrendIndicator from "./trend-indicator";
import type { MetricStatus } from "@/modules/reports/utils";
import { getMetricStatusLabel, getMetricStatusStyles } from "@/modules/reports/utils";

interface MetricContextItem {
  label: string;
  value: ReactNode;
  delta?: number;
  invert?: boolean;
  status: MetricStatus;
  context: string;
}

interface MetricContextGridProps {
  title: string;
  description?: string;
  items: MetricContextItem[];
  columns?: "2" | "3" | "4";
}

const MetricContextGrid = ({ title, description, items, columns = "3" }: MetricContextGridProps) => {
  const gridColsClass = {
    "2": "md:grid-cols-2",
    "3": "md:grid-cols-2 xl:grid-cols-3",
    "4": "md:grid-cols-2 xl:grid-cols-4",
  }[columns];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-xl font-medium text-[#09122D]">{title}</h3>
        {description ? <p className="text-sm text-slate-500">{description}</p> : null}
      </div>
      <div className={tx("grid grid-cols-1 gap-4", gridColsClass)}>
        {items.map((item) => {
          const statusStyles = getMetricStatusStyles(item.status);
          return (
            <Card
              key={item.label}
              className="flex flex-col gap-3 rounded-2xl border border-[#E2E6F3] bg-gradient-to-br from-[#F8FAFF] via-white to-[#EEF2FF] p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-[#09122D]">{item.label}</div>
                <span
                  className={tx(
                    "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                    statusStyles.bg,
                    statusStyles.text,
                    statusStyles.border,
                  )}
                >
                  {getMetricStatusLabel(item.status)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-lg font-semibold text-[#0B1220]">
                <span>{item.value}</span>
                <TrendIndicator value={item.delta} invert={item.invert} />
              </div>
              <p className="text-xs text-[#5C5F80]">{item.context}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export type { MetricContextItem };
export default MetricContextGrid;
