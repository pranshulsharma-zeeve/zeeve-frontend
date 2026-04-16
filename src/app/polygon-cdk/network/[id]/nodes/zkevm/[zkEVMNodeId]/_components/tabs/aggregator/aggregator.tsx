"use client";
import React from "react";
import { useParams } from "next/navigation";
import { CopyButton, Heading, IconButton, Tooltip } from "@zeeve-platform/ui";
import { IconArrowRotateRightSquare } from "@zeeve-platform/icons/arrow/outline";
import { IconEdit2 } from "@zeeve-platform/icons/document/outline";
import { IconCardSwap, IconDollarArrowFromUpRightCircle } from "@zeeve-platform/icons/money/outline";
import usePolygonValidiumService from "@/services/polygon-validium/use-polygon-validium-service";
import KeyValuePair from "@/components/key-value-pair";
import { convertNumber } from "@/utils/helpers";

const Aggregator = () => {
  const {
    id: supernetId,
    zkEVMNodeId,
  }: {
    id: string;
    zkEVMNodeId: string;
  } = useParams();

  // aggregator wallet details
  const {
    request: { data: aggregatorWallet, isLoading: isAggregatorWalletLoading },
  } = usePolygonValidiumService().supernet.walletDetails(supernetId, "name", "aggregator");
  const aggregatorWalletData = aggregatorWallet?.data;

  // zkEVMConfig config
  const {
    request: { data: zkEVMConfig, isLoading: isZkEVMConfigLoading },
  } = usePolygonValidiumService().node.zkevm.config(supernetId, zkEVMNodeId);

  return (
    <div className="grid grid-cols-12 gap-3 text-brand-dark lg:gap-6">
      {/* aggregator address */}
      <div className="col-span-12 flex flex-col justify-between gap-1 rounded-lg border border-brand-outline md:col-span-12 2xl:col-span-5">
        <div className="flex items-center justify-between p-2 lg:p-4">
          <Heading as="h4">Aggregator</Heading>
        </div>
        <div className="grid grid-cols-12 gap-3 p-2 lg:gap-6 lg:p-4">
          <KeyValuePair
            label="Address"
            value={
              aggregatorWalletData?.address ? (
                <Tooltip text={aggregatorWalletData.address} placement="top-start">
                  <div className="flex items-center">
                    <div className="mr-2">{aggregatorWalletData.address}</div>
                    <CopyButton text={aggregatorWalletData.address} />
                  </div>
                </Tooltip>
              ) : (
                "NA"
              )
            }
            isLoading={isAggregatorWalletLoading}
            className="col-span-12 lg:col-span-12"
            shouldAllowCopy={!!aggregatorWalletData?.address}
          />
        </div>
      </div>
      {/* l1 wallet */}
      <div className="col-span-12 flex flex-col justify-between gap-1 rounded-lg border border-brand-outline md:col-span-6 2xl:col-span-4">
        <div className="flex items-center justify-between p-2 lg:p-4">
          <Heading as="h4">Ethereum Sepolia (L1) Wallet</Heading>
        </div>
        <div className="grid grid-cols-12 gap-3 p-2 lg:gap-6 lg:p-4">
          <KeyValuePair
            label="Balance"
            value={
              aggregatorWalletData?.l1Balance && aggregatorWalletData.l1Currency
                ? `${convertNumber(aggregatorWalletData.l1Balance)} ${aggregatorWalletData.l1Currency}`
                : "NA"
            }
            isLoading={isAggregatorWalletLoading}
          />
          <KeyValuePair
            label="Average Monthly Spent"
            value={aggregatorWalletData?.monthlyProjectedSpend ?? "NA"}
            isLoading={isAggregatorWalletLoading}
          />
        </div>
      </div>
      {/* l2 wallet */}
      <div className="col-span-12 flex flex-col gap-1 rounded-lg border border-brand-outline md:col-span-6 2xl:col-span-3">
        <div className="flex items-center justify-between p-2 lg:p-4">
          <Heading as="h4">CDK Chain (L2) Wallet</Heading>
        </div>
        <div className="grid grid-cols-12 gap-3 p-2 lg:gap-6 lg:p-4">
          <KeyValuePair
            label="Balance"
            value={
              aggregatorWalletData?.l2Balance && aggregatorWalletData.l2Currency
                ? `${convertNumber(aggregatorWalletData.l2Balance)} ${aggregatorWalletData.l2Currency}`
                : "NA"
            }
            className="col-span-12 lg:col-span-12"
            isLoading={isAggregatorWalletLoading}
          />
        </div>
      </div>
      {/* config */}
      <div className="col-span-12 flex flex-col gap-1 rounded-lg border border-brand-outline lg:col-span-12">
        <div className="flex items-center justify-between p-2 lg:p-4">
          <Heading as="h4">Configurations</Heading>
        </div>
        <div className="grid grid-cols-12 gap-3 p-2 lg:gap-6 lg:p-4">
          <KeyValuePair
            label="Retry Time"
            value={zkEVMConfig?.data.aggregator.retryTime ?? "NA"}
            className="col-span-12 lg:col-span-3"
            isLoading={isZkEVMConfigLoading}
          />
          <KeyValuePair
            label="Proof State Polling Interval"
            value={zkEVMConfig?.data.aggregator.proofStatePollingInterval ?? "NA"}
            className="col-span-12 lg:col-span-3"
            isLoading={isZkEVMConfigLoading}
          />
          <KeyValuePair
            label="Transaction Profitability Checker Type"
            value={zkEVMConfig?.data.aggregator.txProfitabilityCheckerType ?? "NA"}
            className="col-span-12 lg:col-span-3"
            isLoading={isZkEVMConfigLoading}
          />
          <KeyValuePair
            label="Transaction Profitability Minimum Reward"
            value={zkEVMConfig?.data.aggregator.txProfitabilityMinimumReward ?? "NA"}
            className="col-span-12 lg:col-span-3"
            isLoading={isZkEVMConfigLoading}
          />
          <KeyValuePair
            label="Verify Proof Interval"
            value={zkEVMConfig?.data.aggregator.verifyProofInterval ?? "NA"}
            className="col-span-12 lg:col-span-3"
            isLoading={isZkEVMConfigLoading}
          />
          <KeyValuePair
            label="Cleanup Locked Proofs Interval"
            value={zkEVMConfig?.data.aggregator.cleanupLockedProofsInterval ?? "NA"}
            className="col-span-12 lg:col-span-3"
            isLoading={isZkEVMConfigLoading}
          />
          <KeyValuePair
            label="Generating Proof Cleanup Threshold"
            value={zkEVMConfig?.data.aggregator.generatingProofCleanupThreshold ?? "NA"}
            className="col-span-12 lg:col-span-3"
            isLoading={isZkEVMConfigLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Aggregator;
