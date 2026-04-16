"use client";

import React from "react";
import { Tooltip } from "@zeeve-platform/ui";
import { IconInfoCircle } from "@zeeve-platform/icons/essential/outline";
import { formatCurrencyCompact, formatNumberCompact, formatPercent } from "@/modules/reports/utils";

export interface MetricItem {
  label: string;
  value: string | number | undefined;
  delta?: number;
  context: string;
  icon: React.ReactNode;
  isInverted?: boolean;
}

interface MetricsOverviewProps {
  overview?: {
    totalNodes?: number;
    overallUptimePct?: number;
    totalRequests?: number;
    totalRewards?: number;
    overallScore?: number;
    overallGrade?: string;
    overallStatus?: string;
  };
  rpcSummary?: {
    totalRequests?: number;
    prevTotalRequests?: number;
  };
  validatorSummary?: {
    totalRewards?: number;
    prevTotalRewards?: number;
    totalStake?: number;
    prevTotalStake?: number;
  };
  hasRpcNodes?: boolean;
  hasValidators?: boolean;
  // New flexible props for external items
  items?: MetricItem[];
  title?: string;
  description?: string;
}

const calculateDelta = (current: number | undefined, previous: number | undefined): number | undefined => {
  if (typeof current !== "number" || typeof previous !== "number" || previous === 0) {
    return undefined;
  }
  return ((current - previous) / previous) * 100;
};

const DeltaIndicator = ({ value, isInverted = false }: { value: number | undefined; isInverted?: boolean }) => {
  if (typeof value !== "number" || isNaN(value)) {
    return null;
  }

  const isPositive = value >= 0;
  const isGood = isInverted ? value < 0 : value > 0;
  const icon = isPositive ? "↑" : "↓";
  const color = isGood ? "text-emerald-600" : "text-rose-600";

  return (
    <div className={`flex items-center gap-1 text-sm font-semibold ${color}`}>
      <span className="text-xl">{icon}</span>
      <span>{value.toFixed(2)}%</span>
    </div>
  );
};

const MetricCard = ({
  label,
  value,
  delta,
  context,
  icon,
  isInverted = false,
}: {
  label: string;
  value: string;
  delta?: number;
  context: string;
  icon: React.ReactNode;
  isInverted?: boolean;
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50/50 to-slate-50/30 p-5 transition-all duration-300 hover:border-slate-300/80 hover:shadow-lg hover:backdrop-blur-md">
      {/* Background glow on hover */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -inset-full animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-5 items-center justify-center rounded-lg bg-slate-200/50 text-slate-600">
              {icon}
            </div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-slate-900">{label}</h4>
              <Tooltip text={context} placement="top">
                <div className="inline-flex">
                  <IconInfoCircle className="size-4 cursor-help text-slate-400 transition-colors hover:text-slate-600" />
                </div>
              </Tooltip>
            </div>
          </div>
          {delta !== undefined && <DeltaIndicator value={delta} isInverted={isInverted} />}
        </div>

        {/* Value */}
        <div className="text-2xl font-bold text-slate-900">{value}</div>

        {/* Context - Hidden since it's now in the info icon */}
        {/* <p className="text-xs leading-relaxed text-slate-600">{context}</p> */}
      </div>
    </div>
  );
};

const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  overview,
  rpcSummary,
  validatorSummary,
  hasRpcNodes = false,
  hasValidators = false,
  items,
  title = "Key metrics",
  description = "Performance overview for this week",
}) => {
  // If items are provided externally, use those
  if (items && items.length > 0) {
    return (
      <div className="">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          {description && (
            <Tooltip text={description} placement="right">
              <div className="inline-flex">
                <IconInfoCircle className="size-5 cursor-help text-slate-400 transition-colors hover:text-slate-600" />
              </div>
            </Tooltip>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <MetricCard
              key={item.label}
              label={item.label}
              value={String(item.value)}
              delta={item.delta}
              context={item.context}
              icon={item.icon}
              isInverted={item.isInverted}
            />
          ))}
        </div>
      </div>
    );
  }

  // Otherwise, use the auto-calculated mode from overview and summaries
  // Calculate deltas
  const requestsDelta = calculateDelta(rpcSummary?.totalRequests, rpcSummary?.prevTotalRequests);
  const rewardsDelta = calculateDelta(validatorSummary?.totalRewards, validatorSummary?.prevTotalRewards);
  const stakeDelta = calculateDelta(validatorSummary?.totalStake, validatorSummary?.prevTotalStake);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        {description && (
          <Tooltip text={description} placement="top">
            <div className="inline-flex">
              <IconInfoCircle className="size-5 cursor-help text-slate-400 transition-colors hover:text-slate-600" />
            </div>
          </Tooltip>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Overall Uptime */}
        <MetricCard
          label="Overall Uptime"
          value={formatPercent(overview?.overallUptimePct)}
          context="Availability across all nodes."
          icon="📊"
        />

        {/* RPC Requests */}
        {hasRpcNodes && (
          <MetricCard
            label="RPC Requests"
            value={formatNumberCompact(rpcSummary?.totalRequests)}
            delta={requestsDelta}
            context="Total workload handled by your RPC fleet."
            icon="⚡"
          />
        )}

        {/* Validator Rewards */}
        {hasValidators && (
          <MetricCard
            label="Validator Weekly Rewards"
            value={formatCurrencyCompact(validatorSummary?.totalRewards)}
            delta={rewardsDelta}
            context="Weekly earnings from your validators."
            icon="💰"
          />
        )}

        {/* Total Stake */}
        {hasValidators && (
          <MetricCard
            label="Total Stake"
            value={formatCurrencyCompact(validatorSummary?.totalStake)}
            delta={stakeDelta}
            context="Delegator confidence reflected in staked assets."
            icon="🔐"
          />
        )}
      </div>
    </div>
  );
};

export default MetricsOverview;
