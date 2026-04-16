"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  CopyButton,
  Heading,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  tx,
  useWindowDimensions,
} from "@zeeve-platform/ui";
import { IconArrowRotateRightSquare } from "@zeeve-platform/icons/arrow/outline";
import { IconCardSwap, IconDollarArrowFromUpRightCircle } from "@zeeve-platform/icons/money/outline";
import { IconEdit2 } from "@zeeve-platform/icons/document/outline";
import useZkSyncValidiumService from "@/services/zksync-validium/use-zksync-validium-service";
import KeyValuePair from "@/components/key-value-pair";
import { convertNumber } from "@/utils/helpers";

const Sequencer = () => {
  // set config tabs orientation
  const [configTabsOrientation, setConfigTabsOrientation] = useState<"horizontal" | "vertical">("vertical");
  const windowSize = useWindowDimensions();
  useEffect(() => {
    if (typeof windowSize.width === "number" && windowSize.width >= 1024) {
      setConfigTabsOrientation("vertical");
    } else {
      setConfigTabsOrientation("horizontal");
    }
  }, [windowSize]);

  const {
    id: supernetId,
    zkEVMNodeId,
  }: {
    id: string;
    zkEVMNodeId: string;
  } = useParams();

  // sequencer wallet
  const {
    request: { data: sequencerWallet, isLoading: isSequencerWalletLoading },
  } = useZkSyncValidiumService().supernet.walletDetails(supernetId, "name", "sequencer");
  const sequencerWalletData = sequencerWallet?.data;

  // zkEVMConfig config
  const {
    request: { data: zkEVMConfig, isLoading: isZkEVMConfigLoading },
  } = useZkSyncValidiumService().node.zkevm.config(supernetId, zkEVMNodeId);

  return (
    <div className="grid grid-cols-12 gap-3 text-brand-dark lg:gap-6">
      {/* sequencer address */}
      <div className="col-span-12 flex flex-col justify-between gap-1 rounded-lg border border-brand-outline md:col-span-12 2xl:col-span-4">
        <div className="flex items-start justify-between p-2 lg:p-4">
          <Heading as="h4">Sequencer</Heading>
        </div>
        <div className="grid grid-cols-12 gap-3 p-2 lg:gap-6 lg:p-4">
          <KeyValuePair
            label="Address"
            value={
              sequencerWalletData?.address ? (
                <Tooltip text={sequencerWalletData.address} placement="top-start">
                  <div className="flex items-center">
                    <div className="mr-2">{sequencerWalletData.address}</div>
                    <CopyButton text={sequencerWalletData.address} />
                  </div>
                </Tooltip>
              ) : (
                "NA"
              )
            }
            isLoading={isSequencerWalletLoading}
            className="col-span-12 lg:col-span-12"
          />
        </div>
      </div>
      {/* l1 wallet */}
      <div className="col-span-12 flex flex-col justify-between gap-1 rounded-lg border border-brand-outline md:col-span-6 2xl:col-span-5">
        <div className="flex items-start justify-between p-2 lg:p-4">
          <Heading as="h4">Ethereum Sepolia (L1) Wallet</Heading>
        </div>
        <div className="grid grid-cols-12 gap-3 p-2 lg:gap-6 lg:p-4">
          <KeyValuePair
            label="Balance"
            value={
              sequencerWalletData?.l1Balance && sequencerWalletData.l1Currency
                ? `${convertNumber(sequencerWalletData.l1Balance)} ${sequencerWalletData.l1Currency}`
                : "NA"
            }
            isLoading={isSequencerWalletLoading}
          />
          <KeyValuePair
            label="Average Monthly Spent"
            value={sequencerWalletData?.monthlyProjectedSpend ?? "NA"}
            isLoading={isSequencerWalletLoading}
          />
        </div>
      </div>
      {/* l2 wallet */}
      <div className="col-span-12 flex flex-col gap-1 rounded-lg border border-brand-outline md:col-span-6 2xl:col-span-3">
        <div className="flex items-start justify-between p-2 lg:p-4">
          <Heading as="h4">CDK Chain (L2) Wallet</Heading>
        </div>
        <div className="grid grid-cols-12 gap-3 p-2 lg:gap-6 lg:p-4">
          <KeyValuePair
            label="Balance"
            value={
              sequencerWalletData?.l2Balance && sequencerWalletData.l2Currency
                ? `${convertNumber(sequencerWalletData.l2Balance)} ${sequencerWalletData.l2Currency}`
                : "NA"
            }
            className="col-span-12 lg:col-span-12"
            isLoading={isSequencerWalletLoading}
          />
        </div>
      </div>
      {/* config */}
      <div className="col-span-12 flex flex-col gap-1 overflow-hidden rounded-lg border border-brand-outline lg:col-span-12">
        <div className="flex items-center justify-between p-2 lg:p-4">
          <Heading as="h4">Configurations</Heading>
        </div>
        <Tabs orientation={configTabsOrientation} className="rounded-none border-x-0 border-b-0">
          <TabList
            className={tx({
              "overflow-x-auto": configTabsOrientation === "horizontal",
            })}
          >
            <Tab
              className={tx({
                "h-full": configTabsOrientation === "horizontal",
              })}
            >
              Transactions
            </Tab>
            <Tab
              className={tx({
                "h-full": configTabsOrientation === "horizontal",
              })}
            >
              Sequencer Finalizer
            </Tab>
            <Tab
              className={tx({
                "h-full": configTabsOrientation === "horizontal",
              })}
            >
              Sequencer Effective Gas Price
            </Tab>
            <Tab
              className={tx({
                "h-full": configTabsOrientation === "horizontal",
              })}
            >
              Sequencer Sender
            </Tab>
            <Tab
              className={tx({
                "h-full": configTabsOrientation === "horizontal",
              })}
            >
              Sequencer Database Manager
            </Tab>
            <Tab
              className={tx({
                "h-full": configTabsOrientation === "horizontal",
              })}
            >
              Miscellaneous
            </Tab>
            <Tab
              className={tx({
                "h-full": configTabsOrientation === "horizontal",
              })}
            >
              Sequencer Worker
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className="grid grid-cols-12 gap-3 p-2 lg:gap-6 lg:p-4">
                <KeyValuePair
                  label="Max Transactions Per Batch"
                  value={zkEVMConfig?.data.sequencer.maxTxsPerBatch ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Max Transaction Lifetime"
                  value={zkEVMConfig?.data.sequencer.maxTxLifetime ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Last Batch Virtualization Wait Period"
                  value={zkEVMConfig?.data.sequencer.lastBatchVirtualizationTimeMaxWaitPeriod ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Transaction Lifetime Check Timeout"
                  value={zkEVMConfig?.data.sequencer.txnLifetimeCheckTimeout ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Blocks Amount For Transactions To Be Deleted"
                  value={zkEVMConfig?.data.sequencer.blocksAmountForTxsToBeDeleted ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Wait Period Pool Is Empty"
                  value={zkEVMConfig?.data.sequencer.waitPeriodPoolIsEmpty ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Frequency To Check Transactions To Delete"
                  value={zkEVMConfig?.data.sequencer.frequencyToCheckTxsToDelete ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="grid grid-cols-12 gap-3 p-2 lg:gap-6 lg:p-4">
                <KeyValuePair
                  label="Forced Batches Finality"
                  value={zkEVMConfig?.data.sequencer.forcedBatchesFinalityNumberOfBlocks ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Forced Batch Deadline"
                  value={zkEVMConfig?.data.sequencer.forcedBatchDeadlineTimeout ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="GER Finality Blocks"
                  value={zkEVMConfig?.data.sequencer.gERFinalityNumberOfBlocks ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="GER Deadline Timeout"
                  value={zkEVMConfig?.data.sequencer.gERDeadlineTimeout ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Timestamp Resolution"
                  value={zkEVMConfig?.data.sequencer.timestampResolution ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Sleep Duration"
                  value={zkEVMConfig?.data.sequencer.sleepDuration ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Stop Sequencer On Batch Number"
                  value={zkEVMConfig?.data.sequencer.stopSequencerOnBatchNum ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Resource Percentage To Close Batch"
                  value={zkEVMConfig?.data.sequencer.resourcePercentageToCloseBatch ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Closing Signals Manager L1 Timeout"
                  value={zkEVMConfig?.data.sequencer.closingSignalsManagerWaitForCheckingL1Timeout ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Closing Signals Manager GER"
                  value={zkEVMConfig?.data.sequencer.closingSignalsManagerWaitForCheckingGER ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Closing Signals Manager Forced Batches"
                  value={zkEVMConfig?.data.sequencer.closingSignalsManagerWaitForCheckingForcedBatches ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="grid grid-cols-12 gap-3 p-2 lg:gap-6 lg:p-4">
                <KeyValuePair
                  label="L1 Gas Price Factor"
                  value={zkEVMConfig?.data.sequencer.l1GasPriceFactor ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="grid grid-cols-12 gap-3 p-2 lg:gap-6 lg:p-4">
                <KeyValuePair
                  label="Wait Period Send Sequence"
                  value={zkEVMConfig?.data.sequencer.waitPeriodSendSequence ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Max Transaction Size For L1"
                  value={zkEVMConfig?.data.sequencer.maxTxSizeForL1 ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Last Batch Virtualization Wait Period"
                  value={zkEVMConfig?.data.sequencer.lastBatchVirtualizationTimeMaxWaitPeriod ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="grid grid-cols-12 gap-3 p-2 lg:gap-6 lg:p-4">
                <KeyValuePair
                  label="Pool Retrieval Interval"
                  value={zkEVMConfig?.data.sequencer.poolRetrievalInterval ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="L2 Reorg Retrieval Interval"
                  value={zkEVMConfig?.data.sequencer.l2ReorgRetrievalInterval ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="grid grid-cols-12 gap-3 p-2 lg:gap-6 lg:p-4">
                <KeyValuePair
                  label="Max Keccak Hashes"
                  value={zkEVMConfig?.data.sequencer.maxKeccakHashes ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Max Poseidon Hashes"
                  value={zkEVMConfig?.data.sequencer.maxPoseidonHashes ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Max Poseidon Paddings"
                  value={zkEVMConfig?.data.sequencer.maxPoseidonPaddings ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Max Mem Aligns"
                  value={zkEVMConfig?.data.sequencer.maxMemAligns ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Max Arithmetics"
                  value={zkEVMConfig?.data.sequencer.maxArithmetics ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Max Binaries"
                  value={zkEVMConfig?.data.sequencer.maxBinaries ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Max Steps"
                  value={zkEVMConfig?.data.sequencer.maxSteps ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Max Batch Byte Size"
                  value={zkEVMConfig?.data.sequencer.maxBatchBytesSize ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
                <KeyValuePair
                  label="Max Cumulative Gas Used"
                  value={zkEVMConfig?.data.sequencer.maxCumulativeGasUsed ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="grid grid-cols-12 gap-3 p-2 lg:gap-6 lg:p-4">
                <KeyValuePair
                  label="Resource Cost Multiplier"
                  value={zkEVMConfig?.data.sequencer.resourceCostMultiplier ?? "NA"}
                  className="col-span-12 lg:col-span-3"
                  isLoading={isZkEVMConfigLoading}
                />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default Sequencer;
