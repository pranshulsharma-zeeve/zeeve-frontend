"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, Skeleton } from "@zeeve-platform/ui";

interface RewardsChartDatum {
  date: string;
  value: number;
  epoch?: number;
}

interface RewardsChartProps {
  data?: RewardsChartDatum[];
  isLoading?: boolean;
  period: 1 | 7 | 30;
  onPeriodChange: (period: 1 | 7 | 30) => void;
  note?: string;
  /** When true, plot rewards against epoch instead of date on the x-axis */
  useEpochAxis?: boolean;
}

const RewardsChart = ({ data, isLoading = false, period, onPeriodChange, note, useEpochAxis = false }: RewardsChartProps) => {
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
          <h3 className="text-lg font-semibold text-[#09122D]">Rewards</h3>
          <p className="text-xs text-[#7D809C]">{useEpochAxis ? "Rewards per Epoch" : "Outstanding rewards over time"}</p>
        </div>

        <div className="flex gap-2 text-sm">
          {periodTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                period === tab.value ? "bg-[#574CE3] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => onPeriodChange(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-64 w-full">
        {isLoading ? (
          <Skeleton role="status" as="div" className="absolute inset-0 rounded-xl bg-gray-200" />
        ) : !hasData ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-[#7D809C]">{note || "No historical rewards found"}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F3" />
              <XAxis
                dataKey={useEpochAxis ? "epoch" : "date"}
                stroke="#9AA0C2"
                fontSize={12}
                tickFormatter={(value) => {
                  if (useEpochAxis) return `Epoch ${value}`;
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                }}
              />
              <YAxis stroke="#9AA0C2" fontSize={12} />
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
                  return date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                }}
                formatter={(value: number) => [`${value.toFixed(6)}`, "Rewards"]}
              />
              <Line type="monotone" dataKey="value" stroke="#574CE3" strokeWidth={2} dot={false} name="Rewards" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export type { RewardsChartDatum };
export default RewardsChart;
