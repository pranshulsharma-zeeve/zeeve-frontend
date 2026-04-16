import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import React from "react";

import EmptyState from "@/modules/reports/components/empty-state";

interface DonutHealthChartProps {
  data: Array<{ name: string; value: number; color: string }>;
  total: number;
  totalLabel: string;
  legend?: boolean;
  height?: number | string;
  emptyTitle?: string;
  emptyDescription?: string;
}

const DonutHealthChart: React.FC<DonutHealthChartProps> = ({
  data,
  total,
  totalLabel,
  height = "15rem",
  emptyTitle,
  emptyDescription,
  legend,
}) => {
  const isEmpty = data.every((entry) => entry.value === 0);
  if (isEmpty) {
    return <EmptyState title={emptyTitle || "No data"} description={emptyDescription || "No chart data available."} />;
  }
  return (
    <div style={{ height }} className="w-full">
      <div className="flex h-full items-center justify-between gap-6">
        {/* Pie Chart on the left */}
        <div className="h-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.filter((item) => item.value > 0)}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="85%"
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
                strokeWidth={2}
                stroke="#ffffff"
              >
                {data
                  .filter((item) => item.value > 0)
                  .map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
              </Pie>
              <RechartsTooltip
                formatter={(value: number, name: string) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
                contentStyle={{
                  background: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  padding: "8px 12px",
                }}
                itemStyle={{
                  fontSize: "13px",
                  fontWeight: "500",
                }}
                labelStyle={{
                  color: "#64748b",
                  fontSize: "12px",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
                // Custom content to set text color dynamically
                content={(props) => {
                  if (!props.active || !props.payload || !props.payload.length) return null;
                  const payload = props.payload[0];
                  if (!payload || !payload.name) return null;
                  const entry = data.find((d) => d.name === payload.name);
                  const color = entry?.color || "#0f172a";
                  return (
                    <div
                      style={{
                        background: "#ffffff",
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        padding: "8px 12px",
                      }}
                    >
                      <div style={{ color, fontWeight: 600, fontSize: 13 }}>
                        {payload.name.charAt(0).toUpperCase() + payload.name.slice(1)}
                      </div>
                      <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 500 }}>{payload.value}</div>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Total and Legend on the right */}
        <div className="flex w-48 shrink-0 flex-col items-start justify-center gap-4">
          <div>
            <div className="text-3xl font-bold text-slate-900">{total}</div>
            <div className="text-sm font-medium text-slate-600">{totalLabel}</div>
          </div>
          {legend && (
            <div className="flex w-full flex-col gap-2">
              {data
                .filter((item) => item.value > 0)
                .map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="size-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                    <div className="flex min-w-0 flex-1 items-baseline gap-1.5">
                      <span className="truncate text-sm font-medium text-slate-700">{item.name}</span>
                      <span className="shrink-0 text-sm font-semibold text-slate-900">{item.value}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonutHealthChart;
