"use client";
import React from "react";
import { Heading } from "@zeeve-platform/ui";
import { useZkSyncDashboard } from "../dashboard-context";
import KeyValuePair from "@/components/key-value-pair";
import { formateNumber } from "@/utils/helpers";

const TransactionConfig = () => {
  const { normalized, isLoading } = useZkSyncDashboard();
  return (
    <div className="col-span-12 flex flex-col rounded-lg border border-brand-outline 2xl:col-span-6">
      <div className="p-4">
        <Heading as="h4">Transaction Config</Heading>
      </div>
      <div className="grid grid-cols-12 gap-3 p-4 lg:gap-6">
        <KeyValuePair
          label="Keeper Txn Slots"
          value={
            normalized?.rollupMetadata?.generalConfig?.chainStateKeeperTxSlot
              ? formateNumber(
                  parseInt(normalized?.rollupMetadata?.generalConfig?.chainStateKeeperTxSlot),
                  10,
                  "standard",
                )
              : "NA"
          }
          isLoading={isLoading}
          className="col-span-12 mx-0 border-none md:col-span-6 lg:col-span-4"
          labelClassName="whitespace-nowrap"
        />
        <KeyValuePair
          label="Max. Allowed L2 Txn Gas Limit"
          value={
            normalized?.rollupMetadata?.generalConfig?.chainStateKeeperMaxAllowedL2TxGasLimit
              ? formateNumber(
                  parseInt(normalized?.rollupMetadata?.generalConfig?.chainStateKeeperMaxAllowedL2TxGasLimit),
                  10,
                  "standard",
                )
              : "NA"
          }
          isLoading={isLoading}
          className="col-span-12 mx-0 border-none md:col-span-6 lg:col-span-4"
          labelClassName="whitespace-nowrap"
        />
        <KeyValuePair
          label="Max. Single Txn Gas"
          value={
            normalized?.rollupMetadata?.generalConfig?.chainStateKeeperMaxSingleTxGas
              ? formateNumber(
                  parseInt(normalized?.rollupMetadata?.generalConfig?.chainStateKeeperMaxSingleTxGas),
                  10,
                  "standard",
                )
              : "NA"
          }
          isLoading={isLoading}
          className="col-span-12 mx-0 border-none md:col-span-6 lg:col-span-4"
          labelClassName="whitespace-nowrap"
        />
        {/* <KeyValuePair
          label="Reject Txn. at Geometry (%)"
          value={data?.blockChainConfig.chainStateKeeperRejectTxAtGeometryPercentage ?? "NA"}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6 lg:col-span-4"
        />
        <KeyValuePair
          label="Reject Txn. at ETH Params (%)"
          value={data?.blockChainConfig.chainStateKeeperRejectTxAtEthParamsPercentage ?? "NA"}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6 lg:col-span-4"
        />
        <KeyValuePair
          label="Reject Txn. at Gas (%)"
          value={data?.blockChainConfig.chainStateKeeperRejectTxAtGasPercentage ?? "NA"}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6 lg:col-span-4"
        /> */}
      </div>
    </div>
  );
};

export default TransactionConfig;
