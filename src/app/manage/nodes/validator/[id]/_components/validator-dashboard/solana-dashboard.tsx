"use client";

import { useMemo, useState } from "react";
import { Card, Skeleton, Tooltip } from "@zeeve-platform/ui";
import RewardsChart from "./rewards-chart";
import StakeDelegatorsChart from "./stake-delegators-chart";
import InfoCardsGrid from "@/components/info-cards-grid";
import CopyButton from "@/components/vizion/copy-button";
import usePlatformService from "@/services/platform/use-platform-service";
import type { ValidatorRewardsResponse } from "@/services/vizion/validator-rewards";
import type { ValidatorStakeDelegatorsResponse } from "@/services/vizion/validator-stake-delegators";
import { toShortString } from "@/utils/helpers";
import type { ValidatorPublicDetailsResponse } from "@/services/vizion/validator-public-details";
import type { UpdatedValidatorNodeResponse } from "@/services/vizion/new-validator-node-details";

/* ------------------------------------------------------------------ */
/*  Delegators table with server-side pagination via API               */
/* ------------------------------------------------------------------ */

interface SolanaDelegatorsTableProps {
  nodeId?: string;
  totalDelegators: number;
  isLoading?: boolean;
}

const ROWS_PER_PAGE = 10;

const SolanaDelegatorsTable = ({ nodeId, totalDelegators, isLoading = false }: SolanaDelegatorsTableProps) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(Math.ceil(totalDelegators / ROWS_PER_PAGE), 1);

  const {
    request: { data: delegationsResp, isLoading: delegationsLoading },
  } = usePlatformService().vizion.validatorDashboardDelegations(nodeId, page, ROWS_PER_PAGE);

  const rows = delegationsResp?.data?.delegators ?? [];
  const loading = isLoading || delegationsLoading;

  return (
    <Card className="flex flex-col gap-3 rounded-2xl border border-[#F0F0F0] bg-[#F8FAFC] p-4 shadow-md">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-xl font-medium text-[#09122D]">Delegators</h3>
        <span className="text-sm text-[#7D809C]">Total: {totalDelegators.toLocaleString("en-US")}</span>
      </div>

      {loading ? (
        <Skeleton role="status" as="div" className="h-60 w-full rounded-lg bg-gray-200" />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-[#09122D]">
              <thead>
                <tr className="border-b border-[#ECEFF5] text-xs uppercase text-[#7D809C]">
                  <th className="px-3 py-2 font-medium">Stake Accounts</th>
                  <th className="px-3 py-2 font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Denom</th>
                  <th className="px-3 py-2 font-medium">Activation Epoch</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-sm text-[#7D809C]">
                      No delegators found
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.delegatorAddress} className="border-b border-[#F5F6FB] last:border-0">
                      <td className="px-3 py-2 font-mono text-xs lg:text-sm">{row.delegatorAddress}</td>
                      <td className="px-3 py-2">{row.amount}</td>
                      <td className="px-3 py-2 uppercase">{row.denom}</td>
                      <td className="px-3 py-2">{row.activationEpoch ?? "N/A"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              className="rounded-md border bg-[#fefaf3] px-3 py-1 text-xs text-black disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="text-xs">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className="rounded-md border bg-[#fefaf3] px-3 py-1 text-xs text-black disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Solana Dashboard                                              */
/* ------------------------------------------------------------------ */

interface SolanaDashboardProps {
  validatorPublicDetails?: ValidatorPublicDetailsResponse;
  validatorPublicDetailsLoading?: boolean;
  updatedValidatorNodeDetails?: UpdatedValidatorNodeResponse;
  updatedValidatorNodeDetailsLoading?: boolean;
  nodeId?: string;
  rewardsData?: ValidatorRewardsResponse;
  rewardsLoading?: boolean;
  rewardsPeriod: 1 | 7 | 30;
  onRewardsPeriodChange: (period: 1 | 7 | 30) => void;
  stakeData?: ValidatorStakeDelegatorsResponse;
  stakeLoading?: boolean;
  stakePeriod: 1 | 7 | 30;
  onStakePeriodChange: (period: 1 | 7 | 30) => void;
}

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

const StatusBadge = ({
  active,
  activeLabel,
  inactiveLabel,
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
}) => (
  <span
    className={`mr-1 rounded-md px-3 py-1 text-xs font-medium ${
      active
        ? "border border-brand-green bg-green-100 text-brand-green"
        : "border border-brand-red bg-red-100 text-brand-red"
    }`}
  >
    {active ? activeLabel : inactiveLabel}
  </span>
);

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

const SolanaDashboard = ({
  validatorPublicDetails,
  validatorPublicDetailsLoading = false,
  updatedValidatorNodeDetailsLoading = false,
  nodeId,
  rewardsData,
  rewardsLoading = false,
  rewardsPeriod,
  onRewardsPeriodChange,
  stakeData,
  stakeLoading = false,
  stakePeriod,
  onStakePeriodChange,
}: SolanaDashboardProps) => {
  const summary = validatorPublicDetails?.data?.summary;
  const isLoading = validatorPublicDetailsLoading || updatedValidatorNodeDetailsLoading;

  // Transform stake & delegators data for the chart, carrying the epoch through
  const stakeSeries = useMemo(() => {
    if (!stakeData?.data?.tokens || !stakeData?.data?.delegatorCount) return [];
    const tokensData = stakeData.data.tokens;
    const delegatorData = stakeData.data.delegatorCount;
    return tokensData.map((tokenPoint: { date: string; value: number; epoch?: number }, index: number) => {
      const delegatorPoint = delegatorData[index];
      return {
        date: tokenPoint.date,
        tokens: tokenPoint.value,
        delegatorCount: delegatorPoint?.value ?? 0,
        epoch: tokenPoint.epoch,
      };
    });
  }, [stakeData]);

  /* ---------- Validator Details Section ---------- */
  const validatorName = summary?.moniker ?? summary?.name ?? "N/A";
  const iconUrl = summary?.iconUrl;
  const description = summary?.description ?? "N/A";
  const website = summary?.website ?? "N/A";
  const statusLabel = summary?.statusLabel ?? summary?.status ?? "N/A";
  const isActive =
    (summary?.status ?? "").toLowerCase() === "active" || (summary?.status ?? "").toLowerCase() === "current";

  /* ---------- Key Metrics ---------- */
  const metrics = useMemo(() => {
    const totalStake = formatTokenValue(summary?.tokens, "SOL");
    const commission = formatPercent(summary?.commissionPct);
    const epoch = summary?.rewardEpoch ?? summary?.Epoch ?? "N/A";
    const delegatorCount =
      typeof summary?.delegatorCount === "number"
        ? summary.delegatorCount.toLocaleString("en-US")
        : String(summary?.delegatorCount ?? "N/A");

    return [
      { label: "Total Stake", value: totalStake },
      { label: "Commission", value: commission },
      { label: "Current Epoch", value: String(epoch) },
      {
        label: "Status",
        value: statusLabel,
      },
      { label: "Delegators", value: delegatorCount },
    ];
  }, [statusLabel, summary]);

  /* ---------- Rewards ---------- */
  const rewards = useMemo(() => {
    return [
      { label: "Current Epoch Rewards", value: formatTokenValue(summary?.totalRewards, "SOL") },
      { label: "Self Stake Rewards", value: formatTokenValue(summary?.ownedRewards, "SOL") },
      { label: "Commission Rewards", value: formatTokenValue(summary?.outstandingRewards, "SOL") },
    ];
  }, [summary]);

  const totalDelegators =
    typeof summary?.delegatorCount === "number"
      ? summary.delegatorCount
      : Number.parseInt(String(summary?.delegatorCount ?? "0"), 10) || 0;

  return (
    <div className="flex flex-col gap-6">
      {/* --- Validator Details --- */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h3 className="text-xl font-medium text-[#09122D]">Validator Details</h3>
          <div className="flex flex-wrap items-center gap-4">
            {isLoading ? (
              <>
                <Skeleton role="status" as="div" className="h-10 w-52 rounded bg-gray-200" />
                <Skeleton role="status" as="div" className="h-10 w-52 rounded bg-gray-200" />
              </>
            ) : (
              <>
                <AddressPill label="Vote Pubkey" value={summary?.votePubkey} />
                <AddressPill label="Node Pubkey" value={summary?.nodePubkey} />
              </>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }, (_, i) => (
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {/* Validator name + icon card */}
            <Card className="col-span-1 flex flex-col gap-3 rounded-2xl border border-[#E2E6F3] bg-gradient-to-br from-[#F8FAFF] via-white to-[#EEF2FF] p-4 shadow-sm md:col-span-2">
              <div className="flex items-center gap-3">
                {iconUrl && (
                  <img
                    src={iconUrl}
                    alt={`${validatorName} icon`}
                    width={40}
                    height={40}
                    className="rounded-full"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="min-h-7 text-lg font-semibold text-[#09122D]">{validatorName}</div>
              </div>
              <div className="text-sm font-medium text-[#5C5F80]">Validator Name</div>
            </Card>

            {/* Status */}
            <Card className="flex flex-col justify-between gap-3 rounded-2xl border border-[#E2E6F3] bg-gradient-to-br from-[#F8FAFF] via-white to-[#EEF2FF] p-4 shadow-sm">
              <div className="min-h-7">
                <StatusBadge active={isActive} activeLabel={statusLabel} inactiveLabel={statusLabel} />
              </div>
              <div className="text-sm font-medium text-[#5C5F80]">Status</div>
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

            {/* Website */}
            <Card className="flex flex-col justify-between gap-3 rounded-2xl border border-[#E2E6F3] bg-gradient-to-br from-[#F8FAFF] via-white to-[#EEF2FF] p-4 shadow-sm">
              <div className="min-h-7 text-lg font-semibold text-[#09122D]">
                {website && website !== "N/A" ? (
                  <Tooltip text={website} placement="top">
                    <a
                      href={website.startsWith("http") ? website : `https://${website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate text-blue-600 hover:underline"
                    >
                      {website}
                    </a>
                  </Tooltip>
                ) : (
                  "N/A"
                )}
              </div>
              <div className="text-sm font-medium text-[#5C5F80]">Website</div>
            </Card>
          </div>
        )}
      </div>

      {/* --- Key Metrics --- */}
      <InfoCardsGrid title="Key Metrics" items={metrics} isLoading={isLoading} columns="5" />

      {/* --- Rewards --- */}
      <InfoCardsGrid title="Rewards" items={rewards} isLoading={isLoading} columns="3" />

      {/* --- Rewards Chart (epoch-based x-axis) --- */}
      <RewardsChart
        data={rewardsData?.data?.series}
        isLoading={rewardsLoading}
        period={rewardsPeriod}
        onPeriodChange={onRewardsPeriodChange}
        note={rewardsData?.data?.note}
        useEpochAxis
      />

      {/* --- Stake & Delegators Chart (epoch-based x-axis) --- */}
      <StakeDelegatorsChart
        data={stakeSeries}
        isLoading={stakeLoading}
        period={stakePeriod}
        onPeriodChange={onStakePeriodChange}
        useEpochAxis
      />

      {/* --- Delegators Table with server-side pagination --- */}
      <SolanaDelegatorsTable nodeId={nodeId} totalDelegators={totalDelegators} isLoading={isLoading} />
    </div>
  );
};

export default SolanaDashboard;
