"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Heading, IconButton, Tooltip } from "@zeeve-platform/ui";
import { IconArrowRotateRightSquare } from "@zeeve-platform/icons/arrow/outline";
import { IconEdit2 } from "@zeeve-platform/icons/document/outline";
import KeyValuePair from "@/components/key-value-pair";
import usePolygonValidiumService from "@/services/polygon-validium/use-polygon-validium-service";

const Synchronizer = () => {
  const {
    id: supernetId,
    zkEVMNodeId,
  }: {
    id: string;
    zkEVMNodeId: string;
  } = useParams();

  // zkEVMConfig config
  const {
    request: { data: zkEVMConfig, isLoading: isZkEVMConfigLoading },
  } = usePolygonValidiumService().node.zkevm.config(supernetId, zkEVMNodeId);

  return (
    <div className="grid grid-cols-12 gap-3 text-brand-dark lg:gap-6">
      <div className="col-span-12 flex flex-col gap-1 rounded-lg border border-brand-outline">
        <div className="flex items-center justify-between p-2 lg:p-4">
          <Heading as="h4">Configurations</Heading>
        </div>
        <div className="grid grid-cols-12 gap-3 p-2 lg:gap-6 lg:p-4">
          <KeyValuePair
            label="Sync Interval"
            value={zkEVMConfig?.data.syncronizer?.syncInterval ?? "NA"}
            isLoading={isZkEVMConfigLoading}
          />
          <KeyValuePair
            label="Sync Chunk Size"
            value={zkEVMConfig?.data.syncronizer?.syncChunkSize ?? "NA"}
            isLoading={isZkEVMConfigLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Synchronizer;
