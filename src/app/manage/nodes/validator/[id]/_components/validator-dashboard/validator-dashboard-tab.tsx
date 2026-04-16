import { useCallback, useMemo, useState } from "react";
import CosmosDashboard from "./cosmos-dashboard";
import DelegatorsTableCard, { type DelegatorRow } from "./delegators-table-card";
import MetricsGrid, { type Metric } from "./metrics-grid";
import PerformanceChart from "./performance-chart";
import RewardsChart from "./rewards-chart";
import RewardsSummary, { type RewardStat } from "./rewards-summary";
import RestakeInfoCard from "./restake-info-card";
import SkaleDashboard from "./skale-dashboard";
import SolanaDashboard from "./solana-dashboard";
import StakeDelegatorsChart from "./stake-delegators-chart";
import StakeDistributionChart from "./stake-distribution-chart";
import ValidationCountdown from "./validation-countdown";
import ValidatorDetailsCard, { StatusBadge } from "./validator-details-card";
import XdcValidatorDashboard from "./xdc-validator-dashboard";
import {
  PROTOCOL_FEATURE_MAP,
  getProtocolType,
  formatPercent,
  formatPlainNumber,
  formatTokenValue,
  isThetaProtocol,
  isXdcProtocol,
  normalizeAndParseToken,
} from "./helpers";
import ThetaTransactionTable from "@/components/ThetaTransactionTable";
import { getProtocolTokenSymbol } from "@/constants/protocol-token-symbol";
import type { NodeDetailsResponse } from "@/services/platform/network/node-details";
import type { ValidatorPublicDetailsResponse } from "@/services/vizion/validator-public-details";
import type { UpdatedValidatorNodeResponse } from "@/services/vizion/new-validator-node-details";
import usePlatformService from "@/services/platform/use-platform-service";

interface ValidatorDashboardTabProps {
  validatorName?: string;
  validatorAddress?: string;
  protocolName?: string;
  protocolIcon?: string;
  isLoading?: boolean;
  validatorPublicDetails?: ValidatorPublicDetailsResponse;
  validatorPublicDetailsLoading?: boolean;
  updatedValidatorNodeDetails?: UpdatedValidatorNodeResponse;
  updatedValidatorNodeDetailsLoading?: boolean;
  nodeId?: string;
  nodeDetails?: NodeDetailsResponse;
}

const ValidatorDashboardTab = ({
  protocolName: protocolNameProp,
  validatorPublicDetails,
  validatorPublicDetailsLoading = false,
  updatedValidatorNodeDetails,
  updatedValidatorNodeDetailsLoading = false,
  nodeId,
  nodeDetails,
}: ValidatorDashboardTabProps) => {
  const protocolDisplayName = protocolNameProp ?? "Coreum";
  const tokenSymbol = getProtocolTokenSymbol(protocolDisplayName);
  const protocolType = getProtocolType(protocolDisplayName);
  const protocolConfig = PROTOCOL_FEATURE_MAP[protocolType];
  const isThetaValidator = isThetaProtocol(protocolDisplayName);
  const isSolanaValidator = protocolType === "solana";
  const isCosmosValidator = protocolType === "cosmos";
  const isSkaleValidator = protocolType === "skale";
  const isXdcValidator = isXdcProtocol(protocolDisplayName);
  // console.log("[ValidatorDashboardTab] protocol config", { protocolType, protocolDisplayName, isThetaValidator });

  // Show validator address in key metrics for specific protocols
  const showValidatorAddressInMetrics =
    protocolType === "flow" ||
    protocolType === "injective" ||
    protocolType === "skale" ||
    protocolType === "energyweb" ||
    protocolType === "near" ||
    protocolType === "avalanche";

  const showRewardsSummary = protocolType !== "near";

  // Protocol chart visibility
  const {
    charts: {
      showStakeDistribution,
      showPerformance,
      showRewards,
      showStakeDelegators,
      showValidationCountdown,
      showValidatorDetails,
      showRestakeInfo,
    },
    supportsPerformanceData,
    supportsRewardsData,
    supportsStakeData,
  } = protocolConfig;

  // Period state for performance chart (1 = daily, 7 = weekly, 30 = monthly)
  const [performancePeriod, setPerformancePeriod] = useState<1 | 7 | 30>(7);

  // Period state for rewards chart (1 = daily, 7 = weekly, 30 = monthly)
  const [rewardsPeriod, setRewardsPeriod] = useState<1 | 7 | 30>(7);

  // Period state for stake & delegators chart (1 = daily, 7 = weekly, 30 = monthly)
  const [stakePeriod, setStakePeriod] = useState<1 | 7 | 30>(7);

  // Fetch performance data with period - for protocols that support it
  const {
    request: { data: performanceData, isLoading: performanceLoading },
  } = usePlatformService().vizion.validatorPerformance(supportsPerformanceData ? nodeId : undefined, performancePeriod);

  // Fetch rewards data with period for rewards chart - for protocols that support it
  const {
    request: { data: rewardsData, isLoading: rewardsLoading },
  } = usePlatformService().vizion.validatorRewards(supportsRewardsData ? nodeId : undefined, rewardsPeriod);

  // Fetch stake & delegators data with period for stake chart - for protocols that support it
  const {
    request: { data: stakeData, isLoading: stakeLoading },
  } = usePlatformService().vizion.validatorStakeDelegators(supportsStakeData ? nodeId : undefined, stakePeriod);

  const overviewData = validatorPublicDetails?.data;
  const summary = overviewData?.summary;
  const delegations = overviewData?.delegations;
  const updatedValidatorDetailsData = updatedValidatorNodeDetails?.data;

  const normalizeToken = useCallback(
    (raw?: string | number): number => {
      return normalizeAndParseToken(raw, protocolDisplayName);
    },
    [protocolDisplayName],
  );

  const delegatorRows: DelegatorRow[] = useMemo(() => {
    if (!delegations?.items) {
      return [];
    }
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

  const metrics: Metric[] = useMemo(() => {
    const outstanding = formatTokenValue(normalizeToken(summary?.outstandingRewards), tokenSymbol);
    const balance = formatTokenValue(normalizeToken(summary?.balance), tokenSymbol);
    const ownedStake = formatTokenValue(normalizeToken(summary?.ownedStake), tokenSymbol);
    const shouldShowOwnedStake = summary?.ownedStake !== undefined && summary?.ownedStake !== null;
    const totalStake = formatTokenValue(normalizeToken(summary?.tokens), tokenSymbol);
    const delegatorCountSource = summary?.delegatorCount ?? delegations?.items?.length;
    const delegatorsCount = formatPlainNumber(
      typeof delegatorCountSource === "number"
        ? delegatorCountSource
        : Number.parseInt(String(delegatorCountSource ?? 0), 10),
    );
    const outstandingLabel = protocolType === "near" ? "Rewards" : "Outstanding Rewards";

    if (protocolType === "subsquid") {
      const subsquidMetrics: Metric[] = [
        { label: outstandingLabel, value: outstanding },
        { label: "Total Stake", value: totalStake },
        { label: "Worker APR", value: formatPercent(summary?.workerAPR) },
        { label: "Delegator APR", value: formatPercent(summary?.delegatorAPR) },
        { label: "Uptime (24h)", value: formatPercent(summary?.uptime24Hours) },
        { label: "Uptime (90d)", value: formatPercent(summary?.uptime90Days) },
        { label: "Delegators", value: delegatorsCount },
      ];
      if (shouldShowOwnedStake) {
        subsquidMetrics.splice(2, 0, { label: "Owned Stake", value: ownedStake });
      }
      return subsquidMetrics;
    }
    if (isThetaValidator) {
      const thetaBalance = formatTokenValue(normalizeToken(summary?.thetaBalance), tokenSymbol);
      const tfuelBalance = formatTokenValue(normalizeToken(summary?.tfuelBalance), getProtocolTokenSymbol("TFUEL"));
      const sequence =
        summary?.sequence !== undefined && summary?.sequence !== null
          ? formatPlainNumber(Number(summary.sequence))
          : "N/A";
      const thetaMetrics: Metric[] = [
        { label: "Total Stake", value: totalStake },
        { label: "THETA Balance", value: thetaBalance },
        { label: "TFUEL Balance", value: tfuelBalance },
        { label: "Sequence", value: sequence },
        { label: "Delegators", value: delegatorsCount },
      ];
      if (shouldShowOwnedStake) {
        thetaMetrics.splice(1, 0, { label: "Owned Stake", value: ownedStake });
      }
      return thetaMetrics;
    }
    const votingPower = formatPercent(summary?.votingPowerPct);
    const uptime = formatPercent(summary?.uptimePct);
    const commission = formatPercent(summary?.commissionPct);
    const rewardMetric: Metric =
      protocolType === "energyweb"
        ? { label: "Balance", value: balance }
        : { label: outstandingLabel, value: outstanding };
    const baseMetrics: Metric[] = [
      rewardMetric,
      { label: "Total Stake", value: totalStake },
      { label: "Voting Power", value: votingPower },
      { label: "Uptime", value: uptime },
      { label: "Commission", value: commission },
      { label: "Delegators", value: delegatorsCount },
    ];
    if (shouldShowOwnedStake) {
      baseMetrics.splice(2, 0, { label: "Owned Stake", value: ownedStake });
    }
    if (protocolType === "near") {
      return baseMetrics.filter((metric) => metric.label !== "Uptime");
    }
    return baseMetrics;
  }, [summary, delegations, tokenSymbol, normalizeToken, protocolType, isThetaValidator]);

  const rewards: RewardStat[] = useMemo(() => {
    if (protocolType === "energyweb") {
      return [{ label: "Total Rewards", value: formatTokenValue(normalizeToken(summary?.totalRewards), tokenSymbol) }];
    }
    return [
      { label: "Owned Rewards", value: formatTokenValue(normalizeToken(summary?.ownedRewards), tokenSymbol) },
      { label: "Delegation Rewards", value: formatTokenValue(normalizeToken(summary?.delegationRewards), tokenSymbol) },
      { label: "Total Rewards", value: formatTokenValue(normalizeToken(summary?.totalRewards), tokenSymbol) },
    ];
  }, [summary, tokenSymbol, normalizeToken, protocolType]);

  // Transform stake & delegators data for chart
  const stakeSeries = useMemo(() => {
    if (!stakeData?.data?.tokens || !stakeData?.data?.delegatorCount) {
      return [];
    }

    const tokensData = stakeData.data.tokens;
    const delegatorData = stakeData.data.delegatorCount;

    // Combine both series by date
    const combined = tokensData.map((tokenPoint: { date: string; value: number }, index: number) => {
      const delegatorPoint = delegatorData[index];
      return {
        date: tokenPoint.date,
        tokens: tokenPoint.value,
        delegatorCount: delegatorPoint?.value ?? 0,
      };
    });

    return combined;
  }, [stakeData]);

  // Calculate total stake
  const totalStake = useMemo(() => {
    return normalizeToken(summary?.tokens);
  }, [summary, normalizeToken]);

  const validatorDetailsLoading = validatorPublicDetailsLoading || updatedValidatorNodeDetailsLoading;
  const delegationAmount =
    summary?.networkType === "Testnet" ? `${summary?.tokens} TESTCORE` : `${summary?.tokens} ${tokenSymbol}`;
  const validatorNodeName = summary?.moniker ?? "N/A";
  const jailedNode =
    typeof summary?.jailed === "boolean" ? (
      <StatusBadge active={!summary.jailed} activeLabel="Unjailed" inactiveLabel="Jailed" />
    ) : (
      "N/A"
    );
  const statusLabel = summary?.statusLabel?.trim();
  const restakeStatus =
    typeof updatedValidatorDetailsData?.restake_status === "boolean" ? (
      <StatusBadge active={updatedValidatorDetailsData.restake_status} activeLabel="Enabled" inactiveLabel="Disabled" />
    ) : (
      "N/A"
    );
  const restakeEnabled = updatedValidatorDetailsData?.restake_status === true;
  const bondedNode =
    statusLabel && statusLabel.length > 0 ? (
      <StatusBadge active={statusLabel === "Bonded"} activeLabel="Bonded" inactiveLabel="Unbonded" />
    ) : (
      "N/A"
    );

  // Build validator details fields based on protocol
  const defaultValidatorDetailsFields = [
    { label: "Validator Name", value: validatorNodeName },
    { label: "Validator Identity", value: summary?.identity?.trim() || "N/A" },
    { label: "Jailed Status", value: jailedNode },
    { label: "Bonded Status", value: bondedNode },
    { label: "Website", value: summary?.website ? summary.website : "N/A" },
    { label: "Description", value: summary?.description ? summary.description : "N/A" },
    { label: "Security Contact", value: summary?.email ? summary.email : "N/A" },
    { label: "Delegation Amount", value: summary?.tokens ? delegationAmount : "N/A" },
    { label: "Network Type", value: summary?.networkType ? summary.networkType : "N/A" },
    { label: "Restake Status", value: restakeStatus },
  ];

  const subsquidValidatorDetailsFields = [
    { label: "Validator Name", value: validatorNodeName },
    { label: "Jailed Status", value: jailedNode },
    { label: "Status", value: statusLabel || "N/A" },
    { label: "Network Type", value: summary?.networkType ? summary.networkType : "N/A" },
    { label: "Description", value: summary?.description ? summary.description : "N/A" },
    { label: "Security Contact", value: summary?.email ? summary.email : "N/A" },
  ];

  const validatorDetailsFields =
    protocolType === "subsquid" ? subsquidValidatorDetailsFields : defaultValidatorDetailsFields;

  // Render Theta validator dashboard with minimal features
  if (isThetaValidator) {
    return (
      <div className="flex flex-col gap-6">
        <MetricsGrid
          metrics={metrics}
          isLoading={validatorPublicDetailsLoading}
          validatorAddress={updatedValidatorDetailsData?.validator_address}
          showValidatorAddress={true}
        />

        <DelegatorsTableCard rows={delegatorRows} isLoading={validatorPublicDetailsLoading} />

        {nodeId && (
          <ThetaTransactionTable
            nodeId={nodeId}
            validatorAddress={updatedValidatorDetailsData?.validator_address ?? ""}
          />
        )}
      </div>
    );
  }

  // Render Solana validator dashboard with custom layout
  if (isSolanaValidator) {
    return (
      <SolanaDashboard
        validatorPublicDetails={validatorPublicDetails}
        validatorPublicDetailsLoading={validatorPublicDetailsLoading}
        updatedValidatorNodeDetails={updatedValidatorNodeDetails}
        updatedValidatorNodeDetailsLoading={updatedValidatorNodeDetailsLoading}
        nodeId={nodeId}
        rewardsData={rewardsData}
        rewardsLoading={rewardsLoading}
        rewardsPeriod={rewardsPeriod}
        onRewardsPeriodChange={setRewardsPeriod}
        stakeData={stakeData}
        stakeLoading={stakeLoading}
        stakePeriod={stakePeriod}
        onStakePeriodChange={setStakePeriod}
      />
    );
  }

  if (isCosmosValidator) {
    return (
      <CosmosDashboard
        validatorPublicDetails={validatorPublicDetails}
        validatorPublicDetailsLoading={validatorPublicDetailsLoading}
        updatedValidatorNodeDetails={updatedValidatorNodeDetails}
        updatedValidatorNodeDetailsLoading={updatedValidatorNodeDetailsLoading}
        nodeId={nodeId}
        performanceData={performanceData}
        performanceLoading={performanceLoading}
        performancePeriod={performancePeriod}
        onPerformancePeriodChange={setPerformancePeriod}
        rewardsData={rewardsData}
        rewardsLoading={rewardsLoading}
        rewardsPeriod={rewardsPeriod}
        onRewardsPeriodChange={setRewardsPeriod}
        stakeData={stakeData}
        stakeLoading={stakeLoading}
        stakePeriod={stakePeriod}
        onStakePeriodChange={setStakePeriod}
      />
    );
  }

  // Render SKALE validator dashboard with custom layout
  if (isSkaleValidator) {
    return (
      <SkaleDashboard
        validatorPublicDetails={validatorPublicDetails}
        validatorPublicDetailsLoading={validatorPublicDetailsLoading}
        updatedValidatorNodeDetails={updatedValidatorNodeDetails}
        updatedValidatorNodeDetailsLoading={updatedValidatorNodeDetailsLoading}
        rewardsData={rewardsData}
        rewardsLoading={rewardsLoading}
        rewardsPeriod={rewardsPeriod}
        onRewardsPeriodChange={setRewardsPeriod}
        stakeData={stakeData}
        stakeLoading={stakeLoading}
        stakePeriod={stakePeriod}
        onStakePeriodChange={setStakePeriod}
      />
    );
  }

  if (isXdcValidator) {
    return (
      <XdcValidatorDashboard
        summary={summary}
        updatedValidatorNodeDetails={updatedValidatorNodeDetails}
        isLoading={validatorPublicDetailsLoading}
      />
    );
  }
  return (
    <div className="flex flex-col gap-6">
      {/* <ValidatorDashboardHeader
        validatorName={validatorName}
        validatorAddress={valoper}
        protocolName={protocolDisplayName}
        protocolIcon={protocolIcon}
        status={summary?.status}
        statusLabel={summary?.statusLabel}
        connectionStatus={summary?.connectionStatus}
        jailed={summary?.jailed}
        isLoading={overallHeaderLoading}
        networkType={networkType}
      /> */}

      {showValidatorDetails && (
        <ValidatorDetailsCard
          fields={validatorDetailsFields}
          validatorAddress={updatedValidatorDetailsData?.validator_address}
          delegationAddress={updatedValidatorDetailsData?.delegation_address}
          peerId={summary?.peerId || undefined}
          isLoading={validatorDetailsLoading}
        />
      )}

      {showRestakeInfo && restakeEnabled && (
        <RestakeInfoCard
          restakeAddress={updatedValidatorDetailsData?.bot_addresses}
          restakeBalance={updatedValidatorDetailsData?.bot_wallet_balances}
          minimumReward={nodeDetails?.data?.metadata?.minimum_reward}
          frequencyHours={nodeDetails?.data?.metadata?.interval}
          networkType={nodeDetails?.data?.network_type}
          isLoading={validatorDetailsLoading}
        />
      )}

      <MetricsGrid
        metrics={metrics}
        isLoading={validatorPublicDetailsLoading}
        validatorAddress={updatedValidatorDetailsData?.validator_address}
        showValidatorAddress={showValidatorAddressInMetrics}
      />
      {showRewardsSummary && <RewardsSummary rewards={rewards} isLoading={validatorPublicDetailsLoading} />}

      {(showStakeDistribution || showPerformance || showRewards || showStakeDelegators || showValidationCountdown) && (
        <>
          {showPerformance && (
            <PerformanceChart
              performanceData={performanceData?.data}
              isLoading={performanceLoading}
              period={performancePeriod}
              onPeriodChange={setPerformancePeriod}
              protocolName={protocolDisplayName}
            />
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {showStakeDistribution && (
              <div className="lg:col-span-1">
                <StakeDistributionChart
                  totalStake={totalStake}
                  tokenSymbol={tokenSymbol}
                  isLoading={validatorPublicDetailsLoading}
                />
              </div>
            )}

            {showRewards && (
              <div className="lg:col-span-2">
                <RewardsChart
                  data={rewardsData?.data?.series}
                  isLoading={rewardsLoading}
                  period={rewardsPeriod}
                  onPeriodChange={setRewardsPeriod}
                  note={rewardsData?.data?.note}
                />
              </div>
            )}
          </div>

          {showValidationCountdown && (
            <ValidationCountdown startDate={summary?.startDate || ""} endDate={summary?.endDate || ""} />
          )}

          {showStakeDelegators && (
            <StakeDelegatorsChart
              data={stakeSeries}
              isLoading={stakeLoading}
              period={stakePeriod}
              onPeriodChange={setStakePeriod}
            />
          )}
        </>
      )}

      <DelegatorsTableCard rows={delegatorRows} isLoading={validatorPublicDetailsLoading} />
    </div>
  );
};

export default ValidatorDashboardTab;
