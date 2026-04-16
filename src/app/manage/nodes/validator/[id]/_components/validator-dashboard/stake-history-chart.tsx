"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, Skeleton } from "@zeeve-platform/ui";

interface StakeHistoryDatum {
  date: string;
  stake: number;
}

interface StakeHistoryChartProps {
  data: StakeHistoryDatum[];
  isLoading?: boolean;
}

const StakeHistoryChart = ({ data, isLoading = false }: StakeHistoryChartProps) => {
  return (
    <Card className="flex flex-col gap-4 rounded-2xl border border-[#F0F0F0] p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-[#09122D]">Stake History</h3>
        <p className="text-xs text-[#7D809C]">Total staked amount over the last 30 days</p>
      </div>

      <div className="relative h-64 w-full">
        {isLoading ? (
          <Skeleton role="status" as="div" className="absolute inset-0 rounded-xl bg-gray-200" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
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
              <Line type="monotone" dataKey="stake" stroke="#574CE3" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export type { StakeHistoryDatum };
export default StakeHistoryChart;
