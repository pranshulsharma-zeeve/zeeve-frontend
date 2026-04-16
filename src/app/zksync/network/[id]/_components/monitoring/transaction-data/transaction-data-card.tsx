"use client";
import React, { useEffect, useState } from "react";
import { useZkSyncDashboard } from "../../tabs/dashboard-context";
import KeyValue from "@/components/vizion/key-value";
import Card from "@/components/vizion/card";
import { useZksyncDashboardStore } from "@/store/vizion/zksync-dashboard";
type RelativeLink = {
  name: string;
  url: string;
};
export interface TransactionData {
  averageBlockTime: string;
  completedTxns: string;
  lastNewContracts: string;
  lastNewVerifiedContracts: string;
  totalAccounts: string;
  totalAddresses: string;
  totalBlocks: string;
  totalContracts: string;
  totalNativeCoinTransfers: string;
  totalTokens: string;
  totalTxns: string;
  totalVerifiedContracts: string;
  newTxns24h: string;
  pendingTxns30m: string;
  txnsFee24h: string;
  averageTxnFee24h: string;
  relativeLinks: RelativeLink[];
}

const TransactionInfoCard = ({ className }: { className?: string }) => {
  const dashboard = useZksyncDashboardStore((state) => state.zksyncDashboard);
  const { normalized } = useZkSyncDashboard();
  const prividiumValue = normalized?.rollupMetadata?.isPrividium ?? normalized?.overview?.isPrividium;
  const isPrividium =
    typeof prividiumValue === "boolean"
      ? prividiumValue
      : typeof prividiumValue === "string"
        ? prividiumValue.toLowerCase() === "true"
        : false;
  const [selectedTransaction, setSelectedTransaction] = useState<"L1" | "RollUp">("RollUp");
  const switchStatus = (status: "L1" | "RollUp") => {
    setSelectedTransaction(status);
  };
  const [data, setData] = useState<TransactionData>({} as TransactionData);
  const formatDecimals = (value?: string | number) => {
    if (isPrividium) return "NA";
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue.toFixed(7) : "NA";
  };

  useEffect(() => {
    if (isPrividium) {
      setData({} as TransactionData);
      setIsLoading(false);
      return;
    }
    const newData = (dashboard?.data?.counters || {}) as TransactionData;
    setData(newData);
    setIsLoading(false);
  }, [selectedTransaction, dashboard, isPrividium]);
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
    >
      {isPrividium && (
        <div className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Data is not available since this network is private.
        </div>
      )}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KeyValue
          isLoading={isLoading}
          labelClassName="text-[#696969]"
          className="col-span-1 lg:col-span-1"
          label="Transactions (24h)"
          value={isPrividium ? "NA" : data.newTxns24h || "NA"}
        />
        <KeyValue
          labelClassName="text-[#696969]"
          isLoading={isLoading}
          className="col-span-1 lg:col-span-1"
          label="Completed transactions"
          value={isPrividium ? "NA" : data.completedTxns || "NA"}
        />
        <KeyValue
          isLoading={isLoading}
          labelClassName="text-[#696969]"
          className="col-span-1 lg:col-span-1"
          label="Total ETH transfers"
          value={isPrividium ? "NA" : data.totalNativeCoinTransfers ? data.totalNativeCoinTransfers : "NA"}
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
        {/* <KeyValue
          labelClassName="text-sm font-medium text-[#696969]"
          isLoading={isLoading}
          className="col-span-1 lg:col-span-1"
          label="Total tokens"
          value={data.totalTokens || "NA"}
        /> */}
      </div>
    </Card>
  );
};

export default TransactionInfoCard;
