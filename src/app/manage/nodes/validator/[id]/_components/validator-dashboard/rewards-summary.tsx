"use client";

import InfoCardsGrid from "@/components/info-cards-grid";

interface RewardStat {
  label: string;
  value: string;
  helper?: string;
}

interface RewardsSummaryProps {
  rewards: RewardStat[];
  isLoading?: boolean;
}

const RewardsSummary = ({ rewards, isLoading = false }: RewardsSummaryProps) => {
  return <InfoCardsGrid title="Rewards" items={rewards} isLoading={isLoading} columns="3" />;
};

export type { RewardStat };
export default RewardsSummary;
