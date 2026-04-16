"use client";
import { Heading } from "@zeeve-platform/ui";
import { useZkSyncDashboard } from "../dashboard-context";
import KeyValuePair from "@/components/key-value-pair";
import { formateNumber } from "@/utils/helpers";

const BlockConfig = () => {
  const { normalized, isLoading } = useZkSyncDashboard();
  return (
    <div className="col-span-12 flex h-full flex-col rounded-lg border border-brand-outline 2xl:col-span-3">
      <div className="p-4">
        <Heading as="h4">Block Config</Heading>
      </div>
      <div className="grid grid-cols-12 gap-3 p-4 lg:gap-6">
        <KeyValuePair
          label="Block Commit Deadline (ms)"
          value={
            normalized?.rollupMetadata?.generalConfig?.chainStateKeeperBlockCommitDeadlineMs
              ? formateNumber(
                  parseInt(normalized?.rollupMetadata?.generalConfig?.chainStateKeeperBlockCommitDeadlineMs),
                  10,
                  "standard",
                )
              : "NA"
          }
          isLoading={isLoading}
          className="border-none lg:col-span-12"
        />
        <KeyValuePair
          label="Min. Block Commit Deadline (ms)"
          value={
            normalized?.rollupMetadata?.generalConfig?.chainStateKeeperMiniBlockCommitDeadlineMs
              ? formateNumber(
                  parseInt(normalized?.rollupMetadata?.generalConfig?.chainStateKeeperMiniBlockCommitDeadlineMs),
                  10,
                  "standard",
                )
              : "NA"
          }
          isLoading={isLoading}
          className="border-none lg:col-span-12"
          labelClassName="whitespace-nowrap"
        />
        <KeyValuePair
          label="Min. Block Seal Queue Capacity"
          value={normalized?.rollupMetadata?.generalConfig?.ChainStateKeeperMiniBlockSealQueueCapacity ?? "NA"}
          isLoading={isLoading}
          className="border-none lg:col-span-12"
        />
        {/* <KeyValuePair
          label="Close Block at Geometry (%)"
          value={data?.blockChainConfig?.chainStateKeeperCloseBlockAtGeometryPercentage ?? "NA"}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6 lg:col-span-4"
        /> 
        <KeyValuePair
          label="Close Block at ETH Params (%)"
          value={data?.blockChainConfig?.chainStateKeeperCloseBlockAtEthParamsPercentage ?? "NA"}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6 lg:col-span-4"
        /> 
        <KeyValuePair
          label="Close Block at Gas (%)"
          value={data?.blockChainConfig?.chainStateKeeperCloseBlockAtGasPercentage ?? "NA"}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6 lg:col-span-4"
        /> */}
        {/* <KeyValuePair
          label="Virtual Blocks Interval"
          value={data?.blockChainConfig?.ChainStateKeeperVirtualBlocksInterval ?? "NA"}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6 lg:col-span-4"
        /> */}
        {/* <KeyValuePair
          label="Virtual Blocks / Mini Block"
          value={data?.blockChainConfig?.chainStateKeeperVirtualBlocksPerMiniBlock ?? "NA"}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6 lg:col-span-4"
        /> */}
      </div>
    </div>
  );
};

export default BlockConfig;
