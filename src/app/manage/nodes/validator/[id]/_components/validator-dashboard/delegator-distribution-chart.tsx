"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Card, Skeleton } from "@zeeve-platform/ui";

interface DelegatorDistributionDatum {
  name: string;
  value: number;
}

const COLORS = ["#574CE3", "#0DC0FA", "#FF9F43", "#24C28B", "#FF6B6B"];

interface DelegatorDistributionChartProps {
  data: DelegatorDistributionDatum[];
  isLoading?: boolean;
}

const DelegatorDistributionChart = ({ data, isLoading = false }: DelegatorDistributionChartProps) => {
  const renderLabel = ({ name, percent }: { name: string; percent: number }) =>
    `${name} ${(percent * 100).toFixed(1)}%`;

  return (
    <Card className="flex flex-col gap-4 rounded-2xl border border-[#F0F0F0] p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-[#09122D]">Delegator Distribution</h3>
        <p className="text-xs text-[#7D809C]">Top delegators by stake share</p>
      </div>
      <div className="relative h-64 w-full">
        {isLoading ? (
          <Skeleton role="status" as="div" className="absolute inset-0 rounded-xl bg-gray-200" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={renderLabel}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "0.5rem",
                  borderColor: "#E4E6F3",
                  backgroundColor: "white",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export type { DelegatorDistributionDatum };
export default DelegatorDistributionChart;
