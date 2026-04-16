"use client";

import { useCallback, useMemo } from "react";
import { Card, Skeleton, Tooltip } from "@zeeve-platform/ui";
import InfoCardsGrid from "@/components/info-cards-grid";
import CopyButton from "@/components/vizion/copy-button";
import { toShortString } from "@/utils/helpers";
import RewardsChart from "./rewards-chart";
import StakeDelegatorsChart from "./stake-delegators-chart";
import DelegatorsTableCard, { type DelegatorRow } from "./delegators-table-card";
import type { ValidatorPublicDetailsResponse } from "@/services/vizion/validator-public-details";
import type { UpdatedValidatorNodeResponse } from "@/services/vizion/new-validator-node-details";


const TOKEN_SYMBOL = "SKL";

const formatTokenValue = (value: string | number | undefined, symbol: string): string => {
  if (value === undefined || value === null) return `N/A ${symbol}`;
  const numeric = typeof value === "string" ? Number.parseFloat(value) : value;
  if (Number.isFinite(numeric)) {
    const truncated = Math.floor(numeric * 100) / 100;
    return `${truncated.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${symbol}`;
  }
  return `${value} ${symbol}`;
};

const formatPercent = (value?: number): string => {
  if (value === undefined || value === null || !Number.isFinite(value)) return "N/A";
  const truncated = Math.floor(value * 100) / 100;
  return `${truncated.toFixed(2)}%`;
};

const formatPlainNumber = (value?: number): string => {
  if (value === undefined || value === null || !Number.isFinite(value)) return "N/A";
  return value.toLocaleString("en-US");
};

const AddressPill = ({ label, value }: { label: string; value?: string | null }) => {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-[#F5F5F5] px-3 py-1">
      <span className="text-sm font-normal text-[#696969]">{label}:</span>
      <span className="text-sm font-normal text-[#09122D]">{toShortString(value, 15, 0) || "—"}</span>
      <CopyButton text={value} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main SKALE Dashboard                                               */
/* ------------------------------------------------------------------ */

interface SkaleDashboardProps {
  validatorPublicDetails?: ValidatorPublicDetailsResponse;
  validatorPublicDetailsLoading?: boolean;
  updatedValidatorNodeDetails?: UpdatedValidatorNodeResponse;
  updatedValidatorNodeDetailsLoading?: boolean;
  rewardsData?: any;
  rewardsLoading?: boolean;
  rewardsPeriod: 1 | 7 | 30;
  onRewardsPeriodChange: (period: 1 | 7 | 30) => void;
  stakeData?: any;
  stakeLoading?: boolean;
  stakePeriod: 1 | 7 | 30;
  onStakePeriodChange: (period: 1 | 7 | 30) => void;
}

const SkaleDashboard = ({
  validatorPublicDetails,
  validatorPublicDetailsLoading = false,
  updatedValidatorNodeDetails,
  updatedValidatorNodeDetailsLoading = false,
  rewardsData,
  rewardsLoading = false,
  rewardsPeriod,
  onRewardsPeriodChange,
  stakeData,
  stakeLoading = false,
  stakePeriod,
  onStakePeriodChange,
}: SkaleDashboardProps) => {
  const summary = validatorPublicDetails?.data?.summary;
  const delegations = validatorPublicDetails?.data?.delegations;
  const isLoading = validatorPublicDetailsLoading || updatedValidatorNodeDetailsLoading;
  const validatorAddress = updatedValidatorNodeDetails?.data?.validator_address;

  const stakeSeries = useMemo(() => {
    if (!stakeData?.data?.tokens || !stakeData?.data?.delegatorCount) return [];
    const tokensData = stakeData.data.tokens;
    const delegatorData = stakeData.data.delegatorCount;
    return tokensData.map((tokenPoint: { date: string; value: number }, index: number) => {
      const delegatorPoint = delegatorData[index];
      return {
        date: tokenPoint.date,
        tokens: tokenPoint.value,
        delegatorCount: delegatorPoint?.value ?? 0,
      };
    });
  }, [stakeData]);

  /* ---------- Validator Details ---------- */
  const validatorName = summary?.moniker ?? "N/A";
  const description = summary?.description ?? "N/A";

  /* ---------- Key Metrics ---------- */
  const metrics = useMemo(() => {
    const commission = formatPercent(summary?.commissionPct);
    const delegatorCountSource = summary?.delegatorCount ?? delegations?.items?.length;
    const delegatorsCount = formatPlainNumber(
      typeof delegatorCountSource === "number"
        ? delegatorCountSource
        : Number.parseInt(String(delegatorCountSource ?? 0), 10),
    );
    const totalStake = formatTokenValue(summary?.tokens, TOKEN_SYMBOL);

    return [
      { label: "Commission", value: commission },
      { label: "Delegators", value: delegatorsCount },
      { label: "Total Stake", value: totalStake },
    ];
  }, [summary, delegations]);

  /* ---------- Rewards ---------- */
  const rewards = useMemo(() => {
    return [
      { label: "Outstanding Rewards", value: formatTokenValue(summary?.outstandingRewards, TOKEN_SYMBOL) },
      { label: "Total Rewards", value: formatTokenValue(summary?.totalRewards, TOKEN_SYMBOL) },
      { label: "Owned Rewards", value: formatTokenValue(summary?.ownedRewards, TOKEN_SYMBOL) },
    ];
  }, [summary]);

  /* ---------- Delegator rows ---------- */
  const normalizeToken = useCallback((raw?: string | number): number => {
    if (raw === undefined || raw === null) return 0;
    const numeric = typeof raw === "number" ? raw : Number.parseFloat(String(raw));
    return Number.isFinite(numeric) ? numeric : 0;
  }, []);

  const delegatorRows: DelegatorRow[] = useMemo(() => {
    if (!delegations?.items) return [];
    return delegations.items.map((item) => {
      const amount = normalizeToken(item.amount ?? "0");
      return {
        address: item.delegatorAddress ?? "N/A",
        amount,
        denom: item.denom,
        pctOfValidator: item.pctOfValidator ?? 0,
      };
    });
  }, [delegations, normalizeToken]);

  return (
    <div className="flex flex-col gap-6">
      {/* --- Validator Details --- */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h3 className="text-xl font-medium text-[#09122D]">Validator Details</h3>
          <div className="flex flex-wrap items-center gap-4">
            {isLoading ? (
              <Skeleton role="status" as="div" className="h-10 w-52 rounded bg-gray-200" />
            ) : (
              <AddressPill label="Validator ID" value={validatorAddress} />
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }, (_, i) => (
              <Card
                key={`skeleton-${i}`}
                className="flex flex-col gap-3 rounded-2xl border border-[#E2E6F3] bg-gradient-to-br from-[#F8FAFF] via-white to-[#EEF2FF] p-4 shadow-sm"
              >
                <Skeleton role="status" as="div" className="h-6 w-24 rounded bg-gray-200" />
                <Skeleton role="status" as="div" className="h-4 w-32 rounded bg-gray-200" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Validator Name */}
            <Card className="flex flex-col justify-between gap-3 rounded-2xl border border-[#E2E6F3] bg-gradient-to-br from-[#F8FAFF] via-white to-[#EEF2FF] p-4 shadow-sm">
              <div className="min-h-7 text-lg font-semibold text-[#09122D]">{validatorName}</div>
              <div className="text-sm font-medium text-[#5C5F80]">Validator Name</div>
            </Card>

            {/* Description */}
            <Card className="flex flex-col justify-between gap-3 rounded-2xl border border-[#E2E6F3] bg-gradient-to-br from-[#F8FAFF] via-white to-[#EEF2FF] p-4 shadow-sm">
              <div className="min-h-7 text-lg font-semibold text-[#09122D]">
                {description && description !== "N/A" && description.length > 60 ? (
                  <Tooltip text={description} placement="top">
                    <span className="block truncate">{description}</span>
                  </Tooltip>
                ) : (
                  <span className="block truncate">{description}</span>
                )}
              </div>
              <div className="text-sm font-medium text-[#5C5F80]">Description</div>
            </Card>
          </div>
        )}
      </div>

      {/* --- Key Metrics --- */}
      <InfoCardsGrid title="Key Metrics" items={metrics} isLoading={isLoading} columns="3" />

      {/* --- Rewards --- */}
      <InfoCardsGrid title="Rewards" items={rewards} isLoading={isLoading} columns="3" />

      {/* --- Rewards Chart --- */}
      <RewardsChart
        data={rewardsData?.data?.series}
        isLoading={rewardsLoading}
        period={rewardsPeriod}
        onPeriodChange={onRewardsPeriodChange}
        note={rewardsData?.data?.note}
      />

      {/* --- Stake & Delegators Chart --- */}
      <StakeDelegatorsChart
        data={stakeSeries}
        isLoading={stakeLoading}
        period={stakePeriod}
        onPeriodChange={onStakePeriodChange}
      />

      {/* --- Delegators Table --- */}
      <DelegatorsTableCard rows={delegatorRows} isLoading={validatorPublicDetailsLoading} />
    </div>
  );
};

export default SkaleDashboard;
