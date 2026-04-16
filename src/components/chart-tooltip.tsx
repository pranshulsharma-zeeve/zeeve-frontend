"use client";

import React from "react";
import { tx } from "@zeeve-platform/ui";
import { TooltipProps } from "recharts";
import Image from "next/image";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { formateNumber, withBasePath } from "@/utils/helpers";

const labelStyles = {
  baseFee: {
    text: "text-[#9085FA]",
    border: "border-[#9085FA]",
    eth: "",
    label: "Gas Fee Trends",
  },
  gasFee: {
    text: "text-[#9085FA]",
    border: "border-[#9085FA]",
    eth: "",
    label: "Gas Fee Trends",
  },
  batchFee: {
    text: "text-[#5133D3]",
    eth: "feeEth",
    border: "border-[#5133D3]",
    label: "Batch Fee",
  },
  batchReward: {
    text: "text-[#26C0C7]",
    border: "border-[#26C0C7]",
    eth: "rewardEth",
    label: "Reward Per Batch",
  },
  stakingRevenue: {
    text: "text-[#EA881B]",
    eth: "",
    border: "border-[#EA881B]",
    label: "Staking Revenue",
  },
  totalFee: {
    text: "text-[#DC3090]",
    eth: "transEth",
    border: "border-[#DC3090]",
    label: "Transaction Fees Collected",
  },
  revenuePerTransaction: {
    text: "text-[#207CEB]",
    border: "border-[#207CEB]",
    eth: "",
    label: "Revenue Per Transaction (RPT)",
  },
};

const ChartTooltip = (
  props: TooltipProps<ValueType, NameType> & {
    listGraphState: string;
    labels: {
      xAxis: string;
      yAxis: string;
      clock: string;
    };
  },
) => {
  const { active, payload, label, listGraphState } = props;

  if (!active || !payload || payload.length === 0) return null;

  const dateLabel = label || "Unknown Date";

  return (
    <div className={tx("w-60 flex flex-col rounded-lg overflow-hidden text-xs text-theme-text bg-[#101936] shadow-md")}>
      {/* Top Section - Date & Time */}
      <div className="flex justify-between bg-[#101936] p-3 text-sm text-white">
        <span>{dateLabel.split(",")[0]}</span>{" "}
        <span>
          {dateLabel.includes(",") && dateLabel.split(",")[1]
            ? dateLabel.split(",")[1]?.trim().split(":").slice(0, 2).join(":") +
              (dateLabel.toUpperCase().includes("AM") ? " AM" : dateLabel.toUpperCase().includes("PM") ? " PM" : "")
            : ""}
        </span>
      </div>

      {/* Bottom Section - Reward Data */}
      <div className="bg-[#101936] p-4">
        {payload.map((entry, index) => {
          const key = entry.dataKey as keyof typeof labelStyles; // Explicit assertion
          const styles = labelStyles[key] || {
            text: "text-white",
            border: "border-white",
            eth: "",
            label: entry.name || "Unknown",
          };

          return (
            <div key={index} className="mt-2">
              <div
                className={`flex items-center gap-1 rounded-md border ${styles.border} px-2 py-1 text-xl font-semibold ${styles.text}`}
              >
                {formateNumber(entry.value as number)}
                <Image
                  src={withBasePath(`/assets/images/protocol/${styles.eth}.svg`)}
                  onError={(e) => (e.currentTarget.src = withBasePath("/assets/images/protocol/eth.svg"))}
                  alt="ETH Icon"
                  width={14}
                  height={14}
                />
              </div>
              <div className={`mt-1 text-sm ${styles.text}`}>{styles.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChartTooltip;
