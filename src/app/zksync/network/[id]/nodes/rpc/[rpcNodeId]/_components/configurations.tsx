"use client";
import React from "react";
import { Heading, IconButton, Tooltip } from "@zeeve-platform/ui";
import { IconArrowRotateRightSquare } from "@zeeve-platform/icons/arrow/outline";
import { IconEdit2 } from "@zeeve-platform/icons/document/outline";
import { useParams } from "next/navigation";
import KeyValuePair from "@/components/key-value-pair";
import FlagState from "@/components/flag-state";
import useZkSyncValidiumService from "@/services/zksync-validium/use-zksync-validium-service";

const Configurations = () => {
  const params = useParams();
  const networkId = params.id as string;
  const rpcNodeId = params.rpcNodeId as string;
  const {
    request: { data, isLoading },
  } = useZkSyncValidiumService().node.rpc.config(networkId, rpcNodeId);
  const rpcConfig = data?.data;
  return (
    <div className="col-span-12 flex flex-col rounded-lg border border-brand-outline md:col-span-12 lg:col-span-7">
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h4">Configurations</Heading>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 p-4 lg:gap-6">
        <KeyValuePair
          label="L2 Suggested Gas Price Polling"
          value={
            typeof rpcConfig?.enbaledL2SuggestedGasPricePolling === "boolean" ? (
              <FlagState flag={rpcConfig.enbaledL2SuggestedGasPricePolling} />
            ) : (
              "NA"
            )
          }
          isLoading={isLoading}
          className="col-span-12 md:col-span-6"
        />
        <KeyValuePair
          label="Max Cumulative Gas Used"
          value={rpcConfig?.maxCumulativeGasUsed ?? "NA"}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6"
        />
        <div className="col-span-12 flex flex-col">
          <div className="px-4">
            <Heading as="h5">APIs Config</Heading>
          </div>
          <div className="grid grid-cols-12 gap-3 p-4 lg:gap-6">
            <KeyValuePair
              label="Max Requests Per IP Per Second"
              value={rpcConfig?.maxReqPerIpPerSec ?? "NA"}
              isLoading={isLoading}
              className="col-span-12 md:col-span-6"
            />
            <KeyValuePair
              label="Trace Batch Use HTTPS"
              value={
                typeof rpcConfig?.traceBatchUseHTTPS === "boolean" ? (
                  <FlagState flag={rpcConfig.traceBatchUseHTTPS} />
                ) : (
                  "NA"
                )
              }
              isLoading={isLoading}
              className="col-span-12 md:col-span-6"
            />
            <KeyValuePair
              label="Read Timeout"
              value={rpcConfig?.readTimeout ?? "NA"}
              isLoading={isLoading}
              className="col-span-12 md:col-span-6"
            />
            <KeyValuePair
              label="Write Timeout"
              value={rpcConfig?.writeTimeout ?? "NA"}
              isLoading={isLoading}
              className="col-span-12 md:col-span-6"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configurations;
