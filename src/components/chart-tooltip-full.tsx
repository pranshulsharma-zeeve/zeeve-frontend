"use client";

import React from "react";
import { TooltipProps } from "recharts";
import Image from "next/image";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { formateNumber, withBasePath } from "@/utils/helpers";
import { useUserStore } from "@/store/user";

// Define label colors
const labelStyles = {
  baseFee: {
    text: "text-[#9085FA]",
    eth: "",
    border: "border-[#9085FA]",
    label: "Gas Fee Trends",
  },
  gasFee: {
    text: "text-[#9085FA]",
    eth: "",
    border: "border-[#9085FA]",
    label: "Gas Fee Trends",
  },
  batchFee: {
    text: "text-[#E59D44]",
    eth: "feeEth",
    border: "border-[#E59D44]",
    label: "Batch Fee",
  },
  batchReward: {
    text: "text-[#26C0C7]",
    eth: "rewardEth",
    border: "border-[#26C0C7]",
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

const ChartTooltipFull = (
  props: TooltipProps<ValueType, NameType> & {
    listGraphState: string;
    labels: {
      xAxis: string;
      yAxis: string;
      clock: string;
    };
  },
) => {
  // const { isTheme } = useUserStore();
  const { active, payload, label } = props;

  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#12132966] bg-[#0000000A] p-3 text-xs shadow-md backdrop-blur-md">
      {/* Top Section - Date & Time */}
      <div className={`mb-3 flex justify-between text-sm font-semibold ${"text-black"}`}>
        <span>{label?.split(",")[0] ?? ""}</span>{" "}
        <span>
          {label && label.includes(",") && label.split(",")[1]
            ? label.split(",")[1]?.trim().split(":").slice(0, 2).join(":") +
              (label.toUpperCase().includes("AM") ? " AM" : label.toUpperCase().includes("PM") ? " PM" : "")
            : ""}
        </span>
      </div>

      {/* Bottom Section - Grid Layout */}
      <div className="grid grid-cols-2 gap-3">
        {payload.map((entry, index) => {
          const key = entry.dataKey as keyof typeof labelStyles;

          const styles = labelStyles[key] || {
            text: "text-white",
            border: "border-white",
            label: entry.name || "Unknown",
          };

          const rawValue = Array.isArray(entry.value) ? entry.value[0] : (entry.value ?? 0);

          return (
            <div key={index} className={`flex flex-col text-center ${index % 2 === 0 ? "items-start" : "items-end"}`}>
              {/* Value Box */}
              <div
                className={`inline-flex items-center gap-1 rounded-md border ${styles.border} px-2 py-1 text-xl font-semibold ${styles.text} w-auto max-w-fit backdrop-blur-sm`}
              >
                <span>{formateNumber(rawValue ?? 0, 2, "compact")}</span>
                {styles.eth ? (
                  <Image
                    src={withBasePath(`/assets/images/protocol/${styles.eth}.svg`)}
                    onError={(e) => (e.currentTarget.src = withBasePath("/assets/images/protocol/eth.svg"))}
                    alt="ETH Icon"
                    width={14}
                    height={14}
                  />
                ) : (
                  "GWei"
                )}
              </div>

              {/* Label */}
              <span className={`mt-1 text-sm font-normal ${styles.text}`}>{styles.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChartTooltipFull;
