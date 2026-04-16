"use client";
import React, { useEffect, useState } from "react";
import Card from "@/components/vizion/card";
import KeyValueEvm from "@/components/vizion/key-value-evm";
import NodeUptime from "@/app/manage/nodes/validator/[id]/_components/infrastructure-dashboard/node-uptime/node-upttime";
import type { ProtocolDataResponse } from "@/services/vizion/protocol-latest-data";

const formatBlockHeight = (value?: string | number) => {
  if (value === null || value === undefined || value === "") {
    return "NA";
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "NA";
  }
  return numeric.toLocaleString("en-US");
};

const formatSyncStatus = (value?: string | number) => {
  if (value === null || value === undefined || value === "") {
    return "NA";
  }
  if (value === "1" || value === 1) {
    return "Synced";
  }
  if (value === "0" || value === 0) {
    return "Syncing";
  }
  return "NA";
};

const NodeMetricsCard = ({
  className,
  protocolData,
  networkId,
  protocol,
}: {
  className?: string;
  protocolData?: ProtocolDataResponse;
  networkId: string;
  protocol?: string;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(!protocolData);
  }, [protocolData]);

  return (
    <div className={`col-span-10 grid grid-cols-10 rounded-2xl border border-[#E1E1E1] ${className}`}>
      <Card
        className={`col-span-10 gap-6 rounded-l-2xl border border-[#89BBF54D]/30 p-6 font-medium text-white lg:col-span-4`}
        style={{
          background: `
          linear-gradient(165.43deg, rgba(30, 41, 60, 0.5) 29.94%, rgba(87, 76, 227, 0.5) 103.23%),
          url('/assets/images/vizion/nodebg1.svg'),
          linear-gradient(to bottom, #1E293C, #574CE3)
        `,
          backgroundSize: "cover, auto, cover",
          backgroundPosition: "center, 100% 100%, center",
          backgroundRepeat: "no-repeat, no-repeat, no-repeat",
        }}
        isTheme={true}
        // IconTwo={UptimeIcon}
        title="Validator Details"
      >
        {/* Make two columns that are flex-col so we can push items down */}

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">
          <KeyValueEvm
            isLoading={isLoading}
            horizontal={false}
            valueClassName="text-white font-semibold text-xl"
            label="Block Height"
            labelClassName="text-sm font-normal text-[#AAABB8]"
            value={formatBlockHeight(protocolData?.data?.blockHeight)}
          />

          <KeyValueEvm
            isLoading={isLoading}
            horizontal={false}
            valueClassName="text-white font-semibold text-xl"
            label="Syncing Status"
            labelClassName="text-sm font-normal text-[#AAABB8]"
            value={formatSyncStatus(protocolData?.data?.syncStatus)}
          />
        </div>
      </Card>

      <div className="col-span-10 p-5 lg:col-span-6">
        <NodeUptime networkId={networkId} protocol={protocol} />
      </div>
    </div>
  );
};

export default NodeMetricsCard;
