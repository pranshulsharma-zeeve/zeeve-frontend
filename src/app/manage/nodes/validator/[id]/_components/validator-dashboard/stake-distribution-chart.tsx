"use client";

import { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Card, Skeleton } from "@zeeve-platform/ui";

interface StakeDistributionDatum {
  name: string;
  value: number;
}

const COLORS = ["#574CE3"];

interface StakeDistributionChartProps {
  totalStake: number;
  tokenSymbol: string;
  isLoading?: boolean;
}

const StakeDistributionChart = ({ totalStake, tokenSymbol, isLoading = false }: StakeDistributionChartProps) => {
  const chartData: StakeDistributionDatum[] = useMemo(() => {
    return [{ name: "Total Stake", value: totalStake }];
  }, [totalStake]);

  const formatValue = (value: number): string => {
    return `${value.toLocaleString("en-US", { maximumFractionDigits: 6 })} ${tokenSymbol}`;
  };

  const renderTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0];
    const value = data.value as number;
    const total = chartData.reduce((sum, d) => sum + d.value, 0);
    const percent = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";

    return (
      <div className="rounded-lg border border-[#E4E6F3] bg-white p-2 text-xs shadow-sm">
        <div className="font-medium text-[#09122D]">{data.name}</div>
        <div className="text-[#7D809C]">
          {formatValue(value)} ({percent}%)
        </div>
      </div>
    );
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    const total = chartData.reduce((sum, d) => sum + d.value, 0);

    return (
      <div className="flex flex-col gap-2 text-xs">
        {payload.map((entry: any, index: number) => {
          const value = entry.payload.value as number;
          const percent = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";

          return (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <div className="size-3 rounded-sm" style={{ backgroundColor: entry.color }} />
              <span className="text-[#7D809C]">
                {entry.value}: {formatValue(value)} ({percent}%)
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const hasData = totalStake > 0;

  return (
    <Card className="flex flex-col gap-4 rounded-2xl border border-[#F0F0F0] p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-[#09122D]">Total Stake</h3>
        <p className="text-xs text-[#7D809C]">Current validator total stake</p>
      </div>
      <div className="relative h-64 w-full">
        {isLoading ? (
          <Skeleton role="status" as="div" className="absolute inset-0 rounded-xl bg-gray-200" />
        ) : !hasData ? (
          <div className="flex h-full items-center justify-center text-sm text-[#7D809C]">No stake data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" nameKey="name">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={renderTooltip} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export type { StakeDistributionDatum };
export default StakeDistributionChart;
