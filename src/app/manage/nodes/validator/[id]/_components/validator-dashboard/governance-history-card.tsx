"use client";

import { Card, Skeleton } from "@zeeve-platform/ui";

interface GovernanceHistoryItem {
  proposal: string;
  title: string;
  vote: "yes" | "no" | "abstain";
  timestamp: string;
}

interface GovernanceHistoryCardProps {
  entries: GovernanceHistoryItem[];
  isLoading?: boolean;
}

const VOTE_COLORS: Record<GovernanceHistoryItem["vote"], string> = {
  yes: "bg-green-100 text-green-700",
  no: "bg-red-100 text-red-600",
  abstain: "bg-slate-100 text-slate-700",
};

const GovernanceHistoryCard = ({ entries, isLoading = false }: GovernanceHistoryCardProps) => {
  return (
    <Card className="flex flex-col gap-3 rounded-2xl border border-[#F0F0F0] p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-[#09122D]">Governance History</h3>
      {isLoading ? (
        <Skeleton role="status" as="div" className="h-56 w-full rounded-lg bg-gray-200" />
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((item) => (
            <div key={item.proposal} className="rounded-xl border border-[#ECEFF5] p-3">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <span className="text-sm font-semibold text-[#09122D]">{item.proposal}</span>
                  <p className="text-xs text-[#7D809C]">{item.title}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase ${
                      VOTE_COLORS[item.vote]
                    }`}
                  >
                    {item.vote}
                  </span>
                  <span className="text-xs text-[#7D809C]">{item.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export type { GovernanceHistoryItem };
export default GovernanceHistoryCard;
