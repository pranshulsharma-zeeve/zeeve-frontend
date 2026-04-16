"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
// import FinancialsTransactionsArea from "./financials-transactions-area";
import RollupCard from "../rollups/rollups";
import { useUserStore } from "@/store/user";
import KeyValue from "@/components/vizion/key-value";
import CardChart from "@/components/vizion/card-chart";
import { useVisionUserStore } from "@/store/vizionUser";
import { withBasePath } from "@/utils/helpers";
import { useZksyncDashboardStore } from "@/store/vizion/zksync-dashboard";
import TruncatedAddress from "@/components/vizion/truncated-address";

const labelColors: Record<string, string> = {
  "Reward per batch": "text-[#26C0C7]",
  "Batch fee": "text-[#E59D44]",
  "Staking Revenue": "text-[#EA881B]",
  "Transaction Fees Collected": "text-[#DC3090]",
  "Gas Fee Trends": "text-[#5133D3]",
  "Revenue Per Transaction (RPT)": "text-[#207CEB]",
};

const FinancialsTransactionsCard = ({ className }: { className?: string }) => {
  const dashboard = useZksyncDashboardStore((state) => state.zksyncDashboard);
  const [dayRange] = useState<string>("1WEEK");
  const [listGraph, setListGraph] = useState<boolean>(false);
  const user = useVisionUserStore((state) => state.visionUser);
  const [listGraphState, setListGraphState] = useState<string>("Reward Per Batch");
  const formatDecimals = (value?: string | number) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue.toFixed(7) : "NA";
  };
  // const [listGraphValue, setListGraphValue] = useState<string>(
  //   dashboard?.data?.financials?.rewardPerBatch?.toString() || "0",
  // );
  // const rangeUpdate = (range: string) => {
  //   setDayRange(range);
  // };
  const listGraphType = (listGraph: boolean) => {
    setListGraph(listGraph);
  };
  const [gasFeeGraph, setGasFeeGraph] = useState<boolean>(false);
  const [batchFeeGraph, setBatchFeeGraph] = useState<boolean>(false);
  const [rewardBatchGraph, setRewardBatchGraph] = useState<boolean>(true);
  const [rolluptotalGraph, setRollupTotalGraph] = useState<boolean>(false);

  const showGraph = (label: string) => {
    switch (label) {
      case "Reward Per Batch":
        setRewardBatchGraph(true);
        setRollupTotalGraph(false);
        setBatchFeeGraph(false);
        setGasFeeGraph(false);
        break;
      case "Batch Fee":
        setBatchFeeGraph(true);
        setRollupTotalGraph(false);
        setRewardBatchGraph(false);
        setGasFeeGraph(false);
        break;
      case "Gas Fee Trends":
        setGasFeeGraph(true);
        setBatchFeeGraph(false);
        setRewardBatchGraph(false);
        setRollupTotalGraph(false);
        break;
      case "Transaction Fees Collected":
        setGasFeeGraph(false);
        setBatchFeeGraph(false);
        setRollupTotalGraph(true);
        setRewardBatchGraph(false);
        break;
      default:
        setGasFeeGraph(false);
        setBatchFeeGraph(false);
        setRollupTotalGraph(false);
        setRewardBatchGraph(false);
    }
  };
  useEffect(() => {
    setListGraph(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.hostData[0]?.nodeName]);

  return (
    <CardChart
      className="w-full bg-white pb-0 pr-0 text-xl font-medium"
      listGraphType={listGraphType}
      hideGraphSwitch={false}
      listGraph={listGraph}
      title="Rollup Economics"
    >
      <div className="relative mb-2">
        {/* <div className="absolute right-0 top-[-48px]">
          {" "}
          <Image src={withBasePath("/assets/images/protocols/eth_brand.svg")} alt="ETH Brand" width={58} height={24} />
        </div> */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KeyValue
            label="Blob operator address"
            eth="feeEth"
            labelClassName="text-[#696969]"
            value={
              <TruncatedAddress
                address={dashboard?.data.financials.sequenceAddress || "0"}
                maxLength={20}
                textClassName="text-[#E59D44]"
                color="text-[#E59D44]"
              />
            }
            valueClassName="border border-[#E59D44] rounded-md p-1"
          />
          <KeyValue
            labelClassName="text-[#696969]"
            label="Blob operator Balance"
            eth="redEth"
            value={formatDecimals(dashboard?.data.financials.sequenceBalance) || "0"}
            valueClassName="border border-[#DE4841] rounded-md p-1 text-[#DE4841]"
          />
          <KeyValue
            label="Min. L2 Gas Price"
            labelClassName="text-[#696969] text-sm"
            eth="gwei"
            value={
              typeof dashboard?.data.financials.minL2GasPrice === "number"
                ? dashboard.data.financials.minL2GasPrice.toExponential(2)
                : dashboard?.data.financials.minL2GasPrice || "0"
            }
            valueClassName="border border-[#5133D3] rounded-md p-1 text-[#5133D3]"
          />
          <KeyValue
            label="Transaction Fees Collected"
            labelClassName="text-[#696969] text-sm"
            eth="transEth"
            value={
              typeof dashboard?.data.financials.feeAccountBalanceL2 === "number"
                ? dashboard.data.financials.feeAccountBalanceL2.toExponential(2)
                : parseFloat(dashboard?.data.financials.feeAccountBalanceL2 as string).toExponential(2) || "0"
            }
            valueClassName="border border-[#DC3090] rounded-md p-1 text-[#DC3090]"
          />
        </div>
      </div>

      {listGraph ? (
        <>
          {/* <div className="grid grid-cols-1 gap-3 border-t border-[#503A5B] pt-2 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Reward Per Batch", key: "rewardPerBatch" },
              { label: "Batch Fee", key: "batchFee" },
              {
                label: "Transaction Fees Collected",
                key: "transactionFeeCollected",
              },
              { label: "Gas Fee Trends", key: "gasTrend" },
            ].map(({ label, key }) => {
              const value = dashboard?.data.financials[key as keyof typeof dashboard.data.financials];

              // Ensure it's a number before applying .toFixed(3)
              const formattedValue =
                typeof value === "number"
                  ? value === 0 || value.toFixed(3) === "0.000"
                    ? "0"
                    : value.toFixed(3)
                  : value;

              return (
                <KeyValue
                  key={label}
                  label={label}
                  value={formattedValue !== undefined ? formattedValue : "0"}
                  labelClassName={
                    label.toLowerCase() === listGraphState.toLowerCase()
                      ? labelColors[
                          (Object.keys(labelColors).find(
                            (k) => k.toLowerCase() === listGraphState.toLowerCase(),
                          ) as keyof typeof labelColors) || ""
                        ] || ""
                      : ""
                  }
                  valueClassName="border border-[#0BB63B] rounded-md p-1 text-[#0BB63B]"
                  onClick={() => {
                    setListGraphState(label);
                    setListGraphValue(value?.toString() || "");
                    showGraph(label);
                  }}
                  className="cursor-pointer rounded-md p-1 transition duration-200 hover:bg-[#252E4B] active:bg-[#1a2036]"
                />
              );
            })}
          </div> */}

          {/* <div className="h-full min-h-[200px] rounded-md border border-[##0000001A] bg-[#003CFF33] p-2">
            <FinancialsTransactionsArea
              listGraph={listGraph}
              listGraphValue={listGraphValue}
              listGraphState={listGraphState}
              dayRange={dayRange}
              rewardBatch={rewardBatchGraph}
              gasFee={gasFeeGraph}
              batchFee={batchFeeGraph}
              totalFee={rolluptotalGraph}
            />
          </div> */}
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <KeyValue
              label="Operator address"
              eth="rewardEth"
              labelClassName="text-[#696969]"
              value={
                <TruncatedAddress
                  address={dashboard?.data.financials.aggregaterAddress || "0"}
                  maxLength={20}
                  textClassName="text-[#26C0C7]"
                  color="text-[#26C0C7]"
                />
              }
              valueClassName="border border-[#26C0C7] rounded-md p-1"
            />
            <KeyValue
              labelClassName="text-[#696969]"
              label="Operator Balance"
              eth="greenEth"
              value={formatDecimals(dashboard?.data.financials.aggregaterBalance) || "0"}
              valueClassName="border border-[#0BB63B] rounded-md p-1 text-[#0BB63B]"
            />
            <KeyValue
              label="Gas Used"
              // eth="gwei"
              labelClassName="text-[#696969]"
              valueClassName="border border-[#2EC589] rounded-md p-1 text-[#2EC589]"
              value={
                typeof dashboard?.data.financials.gasUsed === "number"
                  ? dashboard.data.financials.gasUsed.toExponential(2)
                  : dashboard?.data.financials.gasUsed || "0"
              }
            />
          </div>
          {/* <div className="h-full min-h-[480px] border-t border-[##0000001A] p-4">
            <FinancialsTransactionsArea
              listGraph={listGraph}
              dayRange={dayRange}
              gasFee={true}
              batchFee={true}
              rewardBatch={true}
              totalFee={true}
            />
          </div> */}
          <div className="mr-5 mt-6 border-t border-[#E5E7EB]" />
          <RollupCard className="col-span-12" />
        </>
      )}
    </CardChart>
  );
};

export default FinancialsTransactionsCard;
