"use client";
import React, { useState, useEffect } from "react";
import KeyValue from "@/components/vizion/key-value";
import Card from "@/components/vizion/card";
import { useDashboardStore } from "@/store/vizion/dashboard";
import { formatNumber } from "@/modules/arbitrum-orbit/utils/helpers";

export interface ChainData {
  totalBlock?: string;
  avgBlocktime?: number;
  gasTracker?: number;
  totalTransaction?: string;
  walletAddress?: string;
  latestBlock?: string | null;
  relativeLinks?: { name: string; url: string }[]; // Array of links
}

const ChainInfoCard = ({ className }: { className?: string }) => {
  const dashboard = useDashboardStore((state) => state.dashboard);
  const [data, setData] = useState<ChainData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const newData: ChainData = dashboard?.data?.chainData?.RollUp || {};
    setData(newData);
    setIsLoading(false);
  }, [dashboard]);

  return (
    <Card
      className={`${className} rounded-2xl border border-[#89BBF54D] font-semibold`}
      style={{
        backgroundImage: `url('/assets/images/protocol/chaindatabg.svg')`,
        backgroundSize: "fit",
        backgroundPosition: "bottom right",
        backgroundRepeat: "no-repeat",
      }}
      title="Chain Data"
      data={data}
    >
      {/* Chain Data */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KeyValue
          isLoading={isLoading}
          labelClassName={`${"text-[#696969]"}`}
          label="Total Blocks"
          value={data.totalBlock ? formatNumber(data.totalBlock, "standard") : "NA"}
        />
        <KeyValue
          isLoading={isLoading}
          label="Average Block Time(seconds)"
          labelClassName={`${"text-[#696969]"}`}
          value={
            typeof data.avgBlocktime === "number" && !Number.isInteger(data.avgBlocktime)
              ? data.avgBlocktime.toFixed(3)
              : data.avgBlocktime || "NA"
          }
        />
        <KeyValue
          isLoading={isLoading}
          label="Gas Tracker"
          labelClassName={`${"text-[#696969]"}`}
          value={data?.gasTracker?.toFixed(3) || "NA"}
        />
        <KeyValue
          isLoading={isLoading}
          label="Total Transactions"
          labelClassName={`${"text-[#696969]"}`}
          value={data.totalTransaction ? formatNumber(data.totalTransaction, "standard") : "NA"}
        />
        {data?.walletAddress && (
          <KeyValue
            labelClassName={`${"text-[#696969]"}`}
            isLoading={isLoading}
            label="Wallet Addresses"
            value={data.walletAddress ? formatNumber(data.walletAddress, "standard") : "NA"}
          />
        )}
        {/* <KeyValue
          isLoading={isLoading}
          labelClassName={`${"text-[#696969]"}`}
          label="Latest Blocks"
          value={data.latestBlock ? formatNumber(data.latestBlock, "standard") : "NA"}
        /> */}
      </div>
      {/* Explorer Section */}
    </Card>
  );
};

export default ChainInfoCard;
