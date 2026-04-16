"use client";
import React, { useEffect, useState } from "react";
import { useDashboardStore } from "@/store/vizion/dashboard";
import KeyValue from "@/components/vizion/key-value";
import Card from "@/components/vizion/card";
interface TransactionData {
  transactionValue?: number;
  transactionPerBlock?: number;
  transactionGasLimit?: number;
  transactionCost?: number;
  gasPrice?: number;
  gasLimit?: number;
  gasLimitLastCheck?: string;
  latestBlock?: string;
}

const TransactionInfoCard = ({ className }: { className?: string }) => {
  const dashboard = useDashboardStore((state) => state.dashboard);
  const [data, setData] = useState<TransactionData>({} as TransactionData);

  useEffect(() => {
    const newData: TransactionData = dashboard?.data?.transactionData?.RollUp || {};
    setData(newData);
    setIsLoading(false);
  }, [dashboard]);
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
      title="Transaction Data"
      data={data}
    >
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KeyValue
          isLoading={isLoading}
          labelClassName="text-[#696969]"
          className="col-span-1 lg:col-span-1"
          label={"Tx Per Block"}
          value={data.transactionPerBlock || "NA"}
        />
        <KeyValue
          isLoading={isLoading}
          labelClassName="text-[#696969]"
          className="col-span-1 lg:col-span-1"
          label="Tx Gas Limit (gas)"
          value={data.gasLimit?.toFixed(3) || "NA"}
        />
        <KeyValue
          isLoading={isLoading}
          labelClassName="text-[#696969]"
          className="col-span-1 lg:col-span-1"
          label="Tx Value (ETH)"
          value={data.transactionValue ? data.transactionValue.toExponential(2) : "NA"}
        />
        <KeyValue
          labelClassName="text-sm font-medium text-[#696969]"
          isLoading={isLoading}
          className="col-span-1 lg:col-span-1"
          label="Tx Cost (ETH)"
          value={data.transactionCost ? data.transactionCost.toExponential(2) : "NA"}
        />
        <KeyValue
          labelClassName="text-[#696969]"
          isLoading={isLoading}
          className="col-span-1 lg:col-span-1"
          label="Tx Gas Price"
          value={data.gasPrice ? data.gasPrice.toExponential(2) : "NA"}
        />
        {/* <KeyValue
          isLoading={isLoading}
          labelClassName="text-[#696969]"
          className="col-span-1 lg:col-span-1"
          label="Latest Blocks"
          value={data.latestBlock ? formatNumber(data.latestBlock, "standard") : "NA"}
        /> */}
      </div>
    </Card>
  );
};

export default TransactionInfoCard;
