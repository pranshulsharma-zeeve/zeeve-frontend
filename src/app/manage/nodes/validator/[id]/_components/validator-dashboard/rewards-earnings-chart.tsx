"use client";

import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, Skeleton } from "@zeeve-platform/ui";

interface RewardsEarningDatum {
  date: string;
  rewards: number;
}

interface RewardsEarningsChartProps {
  data: RewardsEarningDatum[];
  isLoading?: boolean;
}

const RewardsEarningsChart = ({ data, isLoading = false }: RewardsEarningsChartProps) => {
  return (
    <Card className="flex flex-col gap-4 rounded-2xl border border-[#F0F0F0] p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-[#09122D]">Rewards Trend</h3>
        <p className="text-xs text-[#7D809C]">Aggregated rewards earned per day</p>
      </div>

      <div className="relative h-64 w-full">
        {isLoading ? (
          <Skeleton role="status" as="div" className="absolute inset-0 rounded-xl bg-gray-200" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="rewardsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0DC0FA" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0DC0FA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F3" />
              <XAxis dataKey="date" stroke="#9AA0C2" fontSize={12} />
              <YAxis stroke="#9AA0C2" fontSize={12} />
              <Tooltip
                contentStyle={{
                  borderRadius: "0.5rem",
                  borderColor: "#E4E6F3",
                  backgroundColor: "white",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="rewards" stroke="#0DC0FA" strokeWidth={2} fill="url(#rewardsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export type { RewardsEarningDatum };
export default RewardsEarningsChart;
