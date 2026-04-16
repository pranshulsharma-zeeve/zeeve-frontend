"use client";
import React, { useState, useEffect } from "react";
import KeyValue from "@/components/vizion/key-value";
import Card from "@/components/vizion/card";
import { useArbitrumDashboardStore } from "@/store/vizion/arbitrum-dashboard";
import { formatNumber } from "@/modules/arbitrum-orbit/utils/helpers";

export interface ChainData {
  totalBlock?: string;
  avgBlocktime?: number;
  gasTracker?: string | number;
  totalTransaction?: string;
  walletAddress?: string;
  latestBlock?: string | null;
  relativeLinks?: { name: string; url: string }[]; // Array of links
}

const ChainInfoCard = ({ className }: { className?: string }) => {
  const [selectedChain, setSelectedChain] = useState<"L1" | "RollUp">("RollUp");
  const dashboard = useArbitrumDashboardStore((state) => state.arbitrumDashboard);
  const [data, setData] = useState<ChainData>({});
  const [isLoading, setIsLoading] = useState(true);

  const switchStatus = (status: "L1" | "RollUp") => {
    setSelectedChain(status);
  };

  useEffect(() => {
    const newData: ChainData = dashboard?.data?.chainData?.[selectedChain] || {};
    setData(newData);
    setIsLoading(false);
  }, [selectedChain, dashboard]);

  return (
    <Card
      className={`${className} rounded-2xl border border-[#89BBF54D] bg-white font-semibold`}
      style={{
        backgroundImage: `url('/assets/images/protocol/chaindatabg.svg')`,
        backgroundSize: "fit",
        backgroundPosition: "bottom right",
        backgroundRepeat: "no-repeat",
      }}
      switchStatus={switchStatus}
      title="Chain Data"
      data={data}
      labelTwo={false}
      hideViewButton={true}
    >
      {/* Chain Data */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KeyValue
          isLoading={isLoading}
          labelClassName={`${"text-[#696969]"}`}
          label="Total Blocks"
          value={data.totalBlock || "NA"}
        />
        <KeyValue
          isLoading={isLoading}
          label="Average Block Time(ms)"
          labelClassName={`${"text-[#696969]"}`}
          value={
            data.avgBlocktime !== undefined && data.avgBlocktime !== null
              ? typeof data.avgBlocktime === "number" && !Number.isInteger(data.avgBlocktime)
                ? data.avgBlocktime.toFixed(3)
                : data.avgBlocktime
              : "NA"
          }
        />
        <KeyValue
          isLoading={isLoading}
          label="Gas Tracker"
          labelClassName={`${"text-[#696969]"}`}
          value={data.gasTracker ? formatNumber(Number(data.gasTracker) / 1e9, "standard") : "0"}
        />
        <KeyValue
          isLoading={isLoading}
          label="Total Transactions"
          labelClassName={`${"text-[#696969]"}`}
          value={data.totalTransaction || "NA"}
        />
        {data?.walletAddress && (
          <KeyValue
            labelClassName={`${"text-[#696969]"}`}
            isLoading={isLoading}
            label="Wallet Addresses"
            value={data.walletAddress || "NA"}
          />
        )}
        <KeyValue
          labelClassName="text-sm font-medium text-[#696969]"
          isLoading={isLoading}
          className="col-span-1 lg:col-span-1"
          label="Total tokens"
          value={dashboard?.data?.counters?.totalTokens || "NA"}
        />
      </div>
      {/* Explorer Section */}
    </Card>
  );
};

export default ChainInfoCard;
