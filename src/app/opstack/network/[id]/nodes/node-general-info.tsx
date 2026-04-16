"use client";
import React, { useEffect } from "react";
import { Heading } from "@zeeve-platform/ui";
import { useParams } from "next/navigation";
import KeyValuePair from "@orbit/components/key-value-pair";
import NetworkNodeStatus from "@orbit/components/network-node-status";
import { formatDate, formatIntoAge } from "@orbit/utils/helpers";
import { NodeDetail, NodeNetworkStates } from "@orbit/types/node";
import { useNodeStore } from "@orbit/store/node";
import { useNetworkStore } from "@orbit/store/network";
import useOpStackService from "@orbit/services/arbitrum-orbit/use-arbitrum-orbit-service";

type GeneralProps = {
  data?: NodeDetail | undefined;
  isLoading: boolean;
};

const NodeGeneralInfo = ({ data, isLoading }: GeneralProps) => {
  const params = useParams();
  const networkId = params.id as string;

  const {
    request: { data: networkInfo, isLoading: isNetworkInfoLoading },
  } = useOpStackService().network.overview(networkId);

  const setNodeInfo = useNodeStore((state) => state.setNodeInfo);
  // super net general info
  // set network info
  const setNetworkInfo = useNetworkStore((state) => state.setNetworkInfo);
  useEffect(() => {
    setNodeInfo(isLoading);
    setNetworkInfo(isNetworkInfoLoading);
    if (data) {
      setNodeInfo(isLoading, {
        name: data.nodeName,
        status: data.nodeStatus as NodeNetworkStates,
      });
    }
    if (networkInfo?.data) {
      setNetworkInfo(isNetworkInfoLoading, networkInfo.data);
    }
  }, [data, isLoading, isNetworkInfoLoading, setNodeInfo, setNetworkInfo, networkInfo?.data]);
  return (
    <div className="col-span-12 flex flex-col rounded-lg border border-brand-outline md:col-span-6 lg:col-span-5">
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h4">Node General Info</Heading>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 p-4 lg:gap-6">
        <KeyValuePair
          label="Name"
          value={data?.nodeName ?? "NA"}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6"
        />
        <KeyValuePair
          label="Type"
          value={data?.nodeType ? data.nodeType.toUpperCase() : "NA"}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6"
        />
        <KeyValuePair
          label="Status"
          value={
            data?.nodeStatus ? <NetworkNodeStatus status={data.nodeStatus as NodeNetworkStates} type={"icon"} /> : "NA"
          }
          isLoading={isLoading}
          className="col-span-12 md:col-span-6"
        />
        <KeyValuePair
          label="Duration"
          value={formatIntoAge(data?.nodeCreatedAt, new Date())}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6"
        />
        <KeyValuePair
          label="Created On"
          value={formatDate(data?.nodeCreatedAt)}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6"
        />
      </div>
    </div>
  );
};

export default NodeGeneralInfo;
