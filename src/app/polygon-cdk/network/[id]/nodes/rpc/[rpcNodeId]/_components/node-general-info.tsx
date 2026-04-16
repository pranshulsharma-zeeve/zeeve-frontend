"use client";
import React, { useEffect, useMemo } from "react";
import { Heading } from "@zeeve-platform/ui";
import { useParams } from "next/navigation";
import KeyValuePair from "@/components/key-value-pair";
import Status from "@/components/status";
import { formatDate, formatIntoAge } from "@/utils/helpers";
import usePolygonValidiumService from "@/services/polygon-validium/use-polygon-validium-service";
import { NodeNetworkStates } from "@/types/node";
import { useNodeStore } from "@/store/node";
import { useSuperNetStore } from "@/store/super-net";

const NodeGeneralInfo = () => {
  const params = useParams();
  const networkId = params.id as string;
  const rpcNodeId = params.rpcNodeId as string;
  const {
    request: { data, isLoading },
  } = usePolygonValidiumService().node.info(networkId, rpcNodeId);
  const {
    request: { data: superNetInfo, isLoading: isSuperNetInfoLoading },
  } = usePolygonValidiumService().supernet.supernetInfo(networkId);
  const nodeInfo = data?.data;
  const superNetData = superNetInfo?.data;
  const setNodeInfo = useNodeStore((state) => state.setNodeInfo);
  // super net general info
  // set supernet info
  const setSuperNetInfo = useSuperNetStore((state) => state.setSuperNetInfo);
  const nodeStorePayload = useMemo(() => {
    if (!nodeInfo) return undefined;
    const name = nodeInfo.name;
    const status = nodeInfo.status as NodeNetworkStates | undefined;
    if (!name || !status) return undefined;
    return {
      name,
      status,
    };
  }, [nodeInfo?.name, nodeInfo?.status]);

  const superNetMemoKey = superNetData ? JSON.stringify(superNetData) : undefined;
  const superNetStorePayload = useMemo(() => superNetData, [superNetMemoKey]);

  useEffect(() => {
    console.log("Setting node info in store:", superNetData);
    setNodeInfo(isLoading, nodeStorePayload);
  }, [isLoading, nodeStorePayload, setNodeInfo]);

  useEffect(() => {
    setSuperNetInfo(isSuperNetInfoLoading, superNetStorePayload);
  }, [isSuperNetInfoLoading, setSuperNetInfo, superNetStorePayload]);
  return (
    <div className="col-span-12 flex flex-col rounded-lg border border-brand-outline lg:col-span-5">
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h4">Node General Info</Heading>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 p-4 lg:gap-6">
        <KeyValuePair
          label="Name"
          value={nodeInfo?.name ?? "NA"}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6"
        />
        <KeyValuePair
          label="Type"
          value={nodeInfo?.type ? nodeInfo.type.toUpperCase() : "NA"}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6"
        />
        <KeyValuePair
          label="Status"
          value={nodeInfo?.status ? <Status status={nodeInfo.status as NodeNetworkStates} type={"icon"} /> : "NA"}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6"
        />
        <KeyValuePair
          label="Duration"
          value={formatIntoAge(nodeInfo?.createdAt, new Date())}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6"
        />
        <KeyValuePair
          label="Created On"
          value={formatDate(nodeInfo?.createdAt)}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6"
        />
      </div>
    </div>
  );
};

export default NodeGeneralInfo;
