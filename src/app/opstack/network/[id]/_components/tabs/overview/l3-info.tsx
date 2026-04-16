"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { Heading, IconButton, Tooltip, Z4DashboardCard } from "@zeeve-platform/ui";
import Link from "next/link";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import { formatDate, toCapitalize } from "@orbit/utils/helpers";
import { OVERVIEW_INFO } from "@orbit/types/overview";
import InfoRow from "@orbit/components/info-row";
import Z4NetworkNodeStatus from "@orbit/components/z4-network-node-status";
import {
  getChallengePeriodBlock,
  getConfirmationPeriodInBlock,
  getCreatedAt,
  getDataAvailabilityLayer,
  getL3ChainId,
  getL2ExplorerUrl,
  getL3ExplorerUrl,
  getNetworkEnvironment,
  getNetworkName,
  getNetworkStatus,
  getSettlementLayer,
  getL2ChainId,
} from "@orbit/utils/network-overview";

type GeneralProps = {
  data: OVERVIEW_INFO | undefined;
  isLoading: boolean;
};
const L3Info = ({ data, isLoading }: GeneralProps) => {
  const isDemo = useSearchParams().get("demo") ?? false;
  const networkStatus = getNetworkStatus(data);
  const networkName = getNetworkName(data);
  const networkNameValue = networkName ?? "NA";
  const networkType = getNetworkEnvironment(data);
  const challengeBlocks = getChallengePeriodBlock(data);
  const settlementLayer = getSettlementLayer(data);
  const dataAvailabilityLayer = getDataAvailabilityLayer(data);
  const createdOn = getCreatedAt(data);
  const confirmPeriod = getConfirmationPeriodInBlock(data) ?? "NA";

  // Calculate rollup layer based on settlement layer
  const getRollupLayerName = () => {
    if (!settlementLayer) return "Rollup Info";
    const match = settlementLayer.match(/L(\d+)/i);
    if (match) {
      const layerNumber = parseInt(match[1], 10) + 1;
      return `L${layerNumber} Rollup Info`;
    }
    return "Rollup Info";
  };

  // Get explorer URL dynamically based on settlement layer
  const getExplorerUrl = () => {
    if (!settlementLayer) return getL2ExplorerUrl(data);
    const match = settlementLayer.match(/L(\d+)/i);
    if (match) {
      const layerNumber = parseInt(match[1], 10) + 1;
      // If next layer is L3, use L3 explorer, otherwise use L2
      return layerNumber === 3 ? getL3ExplorerUrl(data) : getL2ExplorerUrl(data);
    }
    return getL2ExplorerUrl(data);
  };

  // Get explorer tooltip text based on settlement layer
  const getExplorerTooltipText = () => {
    if (!settlementLayer) return "Explorer";
    const match = settlementLayer.match(/L(\d+)/i);
    if (match) {
      const layerNumber = parseInt(match[1], 10) + 1;
      return `L${layerNumber} Explorer`;
    }
    return "Explorer";
  };

  const getChainIdValue = () => {
    if (!settlementLayer) return getL2ChainId(data) ?? "NA";
    const match = settlementLayer.match(/L(\d+)/i);
    if (match) {
      const layerNumber = parseInt(match[1], 10) + 1;
      return (layerNumber === 3 ? getL3ChainId(data) : getL2ChainId(data)) ?? "NA";
    }
    return getL2ChainId(data) ?? "NA";
  };

  const chainIdValue = getChainIdValue();
  const explorerUrl = getExplorerUrl();

  // Format blocks to display with extended time calculation
  const formatBlocksWithTime = (blocks: string | number | undefined) => {
    if (!blocks || blocks === "NA") return "NA";

    const blockCount = typeof blocks === "string" ? parseInt(blocks, 10) : blocks;

    if (isNaN(blockCount)) return "NA";

    const totalSeconds = blockCount * 12;

    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInWeek = secondsInDay * 7;
    const secondsInMonth = secondsInDay * 30; // Approximation
    const secondsInYear = secondsInDay * 365; // Approximation

    let remaining = totalSeconds;

    const years = Math.floor(remaining / secondsInYear);
    remaining %= secondsInYear;

    const months = Math.floor(remaining / secondsInMonth);
    remaining %= secondsInMonth;

    const weeks = Math.floor(remaining / secondsInWeek);
    remaining %= secondsInWeek;

    const days = Math.floor(remaining / secondsInDay);
    remaining %= secondsInDay;

    const hours = Math.floor(remaining / secondsInHour);
    remaining %= secondsInHour;

    const minutes = Math.floor(remaining / secondsInMinute);

    const parts: string[] = [];

    if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
    if (weeks > 0) parts.push(`${weeks} week${weeks > 1 ? "s" : ""}`);
    if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? "s" : ""}`);

    const timeStr = parts.length > 0 ? parts.join(" ") : "0 mins";

    return `${blockCount} Blocks (~ ${timeStr})`;
  };

  return (
    <div className="col-span-12 flex flex-col rounded-[10px] xl:col-span-5 2xl:col-span-5">
      <Z4DashboardCard cardType={isDemo ? "demo" : "testnet"}>
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h5">{getRollupLayerName()}</Heading>
          <Link href={explorerUrl ?? ""} target={"_blank"}>
            <Tooltip text={getExplorerTooltipText()} placement="top-start">
              <IconButton
                colorScheme="primary"
                variant={"ghost"}
                size={"medium"}
                isDisabled={!explorerUrl || networkStatus !== "active"}
              >
                <IconArrowUpRightFromSquare className="text-base" />
              </IconButton>
            </Tooltip>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InfoRow
            label="Name"
            value={networkNameValue}
            isLoading={isLoading}
            showCopyButton={networkNameValue !== "NA"}
          />
          <InfoRow
            label="Chain ID"
            value={chainIdValue}
            isLoading={isLoading}
            showCopyButton={chainIdValue !== "NA"}
            textAlign="sm:right"
          />

          {/* <InfoRow label="Confirmation Period" value={formatBlocksWithTime(confirmPeriod)} isLoading={isLoading} />

          <InfoRow
            label="Extra Challenge Period"
            value={formatBlocksWithTime(challengeBlocks)}
            isLoading={isLoading}
            textAlign="sm:right"
          /> */}
          {/* <InfoRow label="Stake Token" value={getStateToken(data) ?? "NA"} isLoading={isLoading} showCopyButton />
          <InfoRow
            label="Base Stake"
            value={getBaseStake(data) ?? "NA"}
            isLoading={isLoading}
            textAlign="right"
            valueClassName="rounded border border-[#FF0420] px-1.5 text-xs font-bold text-[#FF0420]"
          /> */}
          <InfoRow label="Settlement Layer" value={settlementLayer ?? "NA"} isLoading={isLoading} />
          <InfoRow
            label="Data Availability (DA) Layer"
            value={
              dataAvailabilityLayer
                ? dataAvailabilityLayer?.toLowerCase() === "anytrust"
                  ? "AnyTrust DA"
                  : dataAvailabilityLayer
                : "NA"
            }
            isLoading={isLoading}
            textAlign="sm:right"
          />
          <InfoRow
            label="Network Type"
            value={networkType ? toCapitalize(networkType, "all").toUpperCase() : "NA"}
            isLoading={isLoading}
            valueClassName="rounded border border-black px-1.5 text-sm"
          />
          <InfoRow
            label="Status"
            labelClassName="sm:mr-4"
            value={<Z4NetworkNodeStatus status={networkStatus} />}
            isLoading={isLoading}
            textAlign="sm:right"
          />
          <InfoRow label="Created On" value={createdOn ? formatDate(createdOn) : "NA"} isLoading={isLoading} />
        </div>
      </Z4DashboardCard>
    </div>
  );
};

export default L3Info;
