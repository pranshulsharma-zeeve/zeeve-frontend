"use client";

import { useMemo, useState } from "react";
import { Card, Skeleton, Tooltip } from "@zeeve-platform/ui";
import InfoCardsGrid from "@/components/info-cards-grid";
import CopyButton from "@/components/vizion/copy-button";
import PerformanceChart from "./performance-chart";
import RewardsChart from "./rewards-chart";
import StakeDelegatorsChart from "./stake-delegators-chart";
import type { ValidatorPublicDetailsResponse } from "@/services/vizion/validator-public-details";
import type { UpdatedValidatorNodeResponse } from "@/services/vizion/new-validator-node-details";
import usePlatformService from "@/services/platform/use-platform-service";
import { toShortString } from "@/utils/helpers";

interface CosmosDelegatorsTableProps {
  nodeId?: string;
  initialTotalDelegators: number;
  isLoading?: boolean;
}

interface CosmosDashboardProps {
  validatorPublicDetails?: ValidatorPublicDetailsResponse;
  validatorPublicDetailsLoading?: boolean;
  updatedValidatorNodeDetails?: UpdatedValidatorNodeResponse;
  updatedValidatorNodeDetailsLoading?: boolean;
  nodeId?: string;
  performanceData?: any;
  performanceLoading?: boolean;
  performancePeriod?: 1 | 7 | 30;
  onPerformancePeriodChange?: (p: 1 | 7 | 30) => void;
  rewardsData?: any;
  rewardsLoading?: boolean;
  rewardsPeriod?: 1 | 7 | 30;
  onRewardsPeriodChange?: (p: 1 | 7 | 30) => void;
  stakeData?: any;
  stakeLoading?: boolean;
  stakePeriod?: 1 | 7 | 30;
  onStakePeriodChange?: (p: 1 | 7 | 30) => void;
}

const ROWS_PER_PAGE = 10;

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

const CosmosDelegatorsTable = ({
  nodeId,
  initialTotalDelegators,
  isLoading = false,
}: CosmosDelegatorsTableProps) => {
  const [page, setPage] = useState(1);

  const {
    request: { data: delegationsResp, isLoading: delegationsLoading },
  } = usePlatformService().vizion.validatorDashboardDelegations(nodeId, page, ROWS_PER_PAGE);

  const rows = delegationsResp?.data?.delegators ?? [];
  const totalDelegators = delegationsResp?.data?.totalDelegators ?? initialTotalDelegators;
  const totalPages = Math.max(Math.ceil(totalDelegators / ROWS_PER_PAGE), 1);
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
                  <th className="px-3 py-2 font-medium">Delegator Address</th>
                  <th className="px-3 py-2 font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Denom</th>
                  <th className="px-3 py-2 font-medium">% Of Validator</th>
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
                    <tr key={`${row.delegatorAddress}-${row.amount}`} className="border-b border-[#F5F6FB] last:border-0">
                      <td className="px-3 py-2 font-mono text-xs lg:text-sm">{row.delegatorAddress}</td>
                      <td className="px-3 py-2">{row.amount}</td>
                      <td className="px-3 py-2 uppercase">{row.denom}</td>
                      <td className="px-3 py-2">{formatPercent(row.pctOfValidator)}</td>
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
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="text-xs">Page {page} of {totalPages}</span>
            <button
              type="button"
              className="rounded-md border bg-[#fefaf3] px-3 py-1 text-xs text-black disabled:opacity-50"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
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

const CosmosDashboard = ({
  validatorPublicDetails,
  validatorPublicDetailsLoading = false,
  updatedValidatorNodeDetails,
  updatedValidatorNodeDetailsLoading = false,
  nodeId,
  performanceData,
  performanceLoading = false,
  performancePeriod = 7,
  onPerformancePeriodChange,
  rewardsData,
  rewardsLoading = false,
  rewardsPeriod = 7,
  onRewardsPeriodChange,
  stakeData,
  stakeLoading = false,
  stakePeriod = 7,
  onStakePeriodChange,
}: CosmosDashboardProps) => {
  const summary = validatorPublicDetails?.data?.summary;
  const updatedValidatorDetails = updatedValidatorNodeDetails?.data;
  const isLoading = validatorPublicDetailsLoading || updatedValidatorNodeDetailsLoading;

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

  const validatorDetails = useMemo(
    () => [
      { label: "Validator Name", value: summary?.moniker ?? "N/A" },
      { label: "Identity", value: summary?.identity ?? "N/A" },
      {
        label: "Website",
        value:
          summary?.website && summary.website !== "N/A" ? (
            <Tooltip text={summary.website} placement="top">
              <a
                href={summary.website.startsWith("http") ? summary.website : `https://${summary.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-blue-600 hover:underline"
              >
                {summary.website}
              </a>
            </Tooltip>
          ) : (
            "N/A"
          ),
      },
      {
        label: "Description",
        value:
          summary?.description && summary.description !== "N/A" ? (
            <Tooltip text={summary.description} placement="top">
              <span className="block truncate">{summary.description}</span>
            </Tooltip>
          ) : (
            "N/A"
          ),
      },
      {
        label: "Jailed Status",
        value:
          typeof summary?.jailed === "boolean" ? (
            <StatusBadge active={!summary.jailed} activeLabel="Unjailed" inactiveLabel="Jailed" />
          ) : (
            "N/A"
          ),
      },
      {
        label: "Bonded Status",
        value: summary?.statusLabel ? (
          <StatusBadge
            active={summary.statusLabel === "Bonded"}
            activeLabel="Bonded"
            inactiveLabel={summary.statusLabel}
          />
        ) : (
          "N/A"
        ),
      },
    ],
    [summary],
  );

  const metrics = useMemo(
    () => [
      { label: "Total Stake", value: formatTokenValue(summary?.tokens, "ATOM") },
      { label: "Commission", value: formatPercent(summary?.commissionPct) },
      { label: "Voting Power", value: formatPercent(summary?.votingPowerPct) },
      { label: "Uptime", value: formatPercent(summary?.uptimePct) },
      { label: "Status", value: summary?.statusLabel ?? summary?.status ?? "N/A" },
    ],
    [summary],
  );

  const rewards = useMemo(
    () => [
      { label: "Outstanding Rewards", value: formatTokenValue(summary?.outstandingRewards, "ATOM") },
      { label: "Total Rewards", value: formatTokenValue(summary?.totalRewards, "ATOM") },
      { label: "Self Stake Reward", value: formatTokenValue(summary?.ownedRewards, "ATOM") },
      { label: "Commission Reward", value: formatTokenValue(summary?.commissionRewards, "ATOM") },
    ],
    [summary],
  );

  const totalDelegators =
    typeof summary?.delegatorCount === "number"
      ? summary.delegatorCount
      : Number.parseInt(String(summary?.delegatorCount ?? "0"), 10) || 0;

  return (
    <div className="flex flex-col gap-6">
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
                <AddressPill label="Validator Address" value={updatedValidatorDetails?.validator_address} />
                <AddressPill label="Delegation Address" value={updatedValidatorDetails?.delegation_address} />
              </>
            )}
          </div>
        </div>

        <InfoCardsGrid title="" items={validatorDetails} isLoading={isLoading} columns="3" />
      </div>
      <InfoCardsGrid title="Key Metrics" items={metrics} isLoading={isLoading} columns="5" />
      <InfoCardsGrid title="Rewards" items={rewards} isLoading={isLoading} columns="4" />

      <PerformanceChart
        performanceData={performanceData?.data}
        isLoading={performanceLoading}
        period={performancePeriod}
        onPeriodChange={onPerformancePeriodChange ?? (() => {})}
        protocolName="Cosmos"
      />

      <RewardsChart
        data={rewardsData?.data?.series}
        isLoading={rewardsLoading}
        period={rewardsPeriod}
        onPeriodChange={onRewardsPeriodChange ?? (() => {})}
        note={rewardsData?.data?.note}
      />

      <StakeDelegatorsChart
        data={stakeSeries}
        isLoading={stakeLoading}
        period={stakePeriod}
        onPeriodChange={onStakePeriodChange ?? (() => {})}
      />

      <CosmosDelegatorsTable nodeId={nodeId} initialTotalDelegators={totalDelegators} isLoading={isLoading} />
    </div>
  );
};

export default CosmosDashboard;