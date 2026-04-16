"use client";

import { Card, Skeleton } from "@zeeve-platform/ui";
import { format } from "date-fns";

interface CommissionHistoryItem {
  date: string;
  commissionPct: number;
}

interface CommissionHistoryCardProps {
  rows: CommissionHistoryItem[];
  isLoading?: boolean;
}

const CommissionHistoryCard = ({ rows, isLoading = false }: CommissionHistoryCardProps) => {
  return (
    <Card className="flex flex-col gap-3 rounded-2xl border border-[#F0F0F0] p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-[#09122D]">Commission History</h3>
      {isLoading ? (
        <Skeleton role="status" as="div" className="h-48 w-full rounded-lg bg-gray-200" />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-[#09122D]">
            <thead>
              <tr className="border-b border-[#ECEFF5] text-xs uppercase text-[#7D809C]">
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Commission</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.date} className="border-b border-[#F5F6FB] last:border-0">
                  <td className="px-3 py-2">{format(new Date(row.date), "MMM d, yyyy")}</td>
                  <td className="px-3 py-2">{row.commissionPct.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export type { CommissionHistoryItem };
export default CommissionHistoryCard;
