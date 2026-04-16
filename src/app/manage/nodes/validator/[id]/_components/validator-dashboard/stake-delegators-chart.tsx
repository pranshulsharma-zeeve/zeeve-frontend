"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Card, Skeleton } from "@zeeve-platform/ui";

interface StakeDelegatorsDatum {
  date: string;
  tokens: number;
  delegatorCount: number;
  epoch?: number;
}

interface StakeDelegatorsChartProps {
  data: StakeDelegatorsDatum[];
  isLoading?: boolean;
  period?: 1 | 7 | 30;
  onPeriodChange?: (period: 1 | 7 | 30) => void;
  /** When true, use epoch as the x-axis instead of date */
  useEpochAxis?: boolean;
}

const StakeDelegatorsChart = ({ data, isLoading = false, period = 7, onPeriodChange, useEpochAxis = false }: StakeDelegatorsChartProps) => {
  const hasData = data && data.length > 0;

  const periodTabs = [
    { value: 1 as const, label: "Last 24 hrs" },
    { value: 7 as const, label: "Last 7 days" },
    { value: 30 as const, label: "Last 30 days" },
  ];

  return (
    <Card className="flex flex-col gap-4 rounded-2xl border border-[#F0F0F0] p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-[#09122D]">Stake & Delegators</h3>
          <p className="text-xs text-[#7D809C]">Total stake and delegator count over time</p>
        </div>

        {onPeriodChange && (
          <div className="flex gap-2 text-sm">
            {periodTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`rounded-lg px-3 py-1.5 transition-colors ${
                  period === tab.value ? "bg-[#574CE3] text-white" : "bg-gray-100 text-[#7D809C] hover:bg-gray-200"
                }`}
                onClick={() => onPeriodChange(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative h-64 w-full">
        {isLoading ? (
          <Skeleton role="status" as="div" className="absolute inset-0 rounded-xl bg-gray-200" />
        ) : !hasData ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-[#7D809C]">No historical stake & delegators data found</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F3" />
              <XAxis
                dataKey={useEpochAxis ? "epoch" : "date"}
                stroke="#9AA0C2"
                fontSize={12}
                tickFormatter={(value) => {
                  if (useEpochAxis) return `Epoch ${value}`;
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis
                yAxisId="left"
                stroke="#6366f1"
                fontSize={12}
                label={{
                  value: "Total Stake",
                  angle: -90,
                  position: "insideLeft",
                  offset: -20,
                  style: { fontSize: 12, textAnchor: "middle" },
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#22c55e"
                fontSize={12}
                label={{
                  value: "Delegators",
                  angle: 90,
                  position: "insideRight",
                  offset: 10,
                  style: { fontSize: 12, textAnchor: "middle" },
                }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "0.5rem",
                  borderColor: "#E4E6F3",
                  backgroundColor: "white",
                  fontSize: "12px",
                }}
                labelFormatter={(value) => {
                  if (useEpochAxis) return `Epoch ${value}`;
                  const date = new Date(value);
                  return date.toLocaleDateString();
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} iconType="line" />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="tokens"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                name="Total Stake"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="delegatorCount"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                name="Delegator Count"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export type { StakeDelegatorsDatum };
export default StakeDelegatorsChart;
