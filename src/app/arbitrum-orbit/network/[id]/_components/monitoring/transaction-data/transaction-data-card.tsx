"use client";
import React, { useEffect, useState } from "react";
import KeyValue from "@/components/vizion/key-value";
import Card from "@/components/vizion/card";
import { CountersData, useArbitrumDashboardStore } from "@/store/vizion/arbitrum-dashboard";

const TransactionInfoCard = ({ className }: { className?: string }) => {
  const dashboard = useArbitrumDashboardStore((state) => state.arbitrumDashboard);
  const [selectedTransaction, setSelectedTransaction] = useState<"L1" | "RollUp">("RollUp");
  const switchStatus = (status: "L1" | "RollUp") => {
    setSelectedTransaction(status);
  };
  const [data, setData] = useState<CountersData>({} as CountersData);
  const formatDecimals = (value?: string | number) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue.toFixed(7) : "NA";
  };

  useEffect(() => {
    const newData = (dashboard?.data?.counters || {}) as CountersData;
    setData(newData);
    setIsLoading(false);
  }, [selectedTransaction, dashboard]);
  const [isLoading, setIsLoading] = useState(true);

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
      title="Transaction Data"
      labelTwo={false}
      data={data}
      hideViewButton={true}
    >
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KeyValue
          isLoading={isLoading}
          labelClassName="text-[#696969]"
          className="col-span-1 lg:col-span-1"
          label="Transactions (24h)"
          value={data.newTxns24h || "NA"}
        />
        <KeyValue
          labelClassName="text-[#696969]"
          isLoading={isLoading}
          className="col-span-1 lg:col-span-1"
          label="Completed transactions"
          value={data.completedTxns || "NA"}
        />
        <KeyValue
          isLoading={isLoading}
          labelClassName="text-[#696969]"
          className="col-span-1 lg:col-span-1"
          label="Total ETH transfers"
          value={data.totalNativeCoinTransfers ? data.totalNativeCoinTransfers : "NA"}
        />
        <KeyValue
          isLoading={isLoading}
          labelClassName="text-[#696969]"
          className="col-span-1 lg:col-span-1"
          label={"Transaction fee collected (24h)"}
          value={formatDecimals(data.txnsFee24h)}
        />
        <KeyValue
          isLoading={isLoading}
          labelClassName="text-[#696969]"
          className="col-span-1 lg:col-span-1"
          label="Avg. transaction fee (24h)"
          value={formatDecimals(data.averageTxnFee24h)}
        />
        <KeyValue
          labelClassName="text-sm font-medium text-[#696969]"
          isLoading={isLoading}
          className="col-span-1 lg:col-span-1"
          label="Total contracts"
          value={data.totalContracts || "NA"}
        />
      </div>
    </Card>
  );
};

export default TransactionInfoCard;
