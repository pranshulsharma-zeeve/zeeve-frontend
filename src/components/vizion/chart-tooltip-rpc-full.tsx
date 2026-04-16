"use client";

import React from "react";
import { TooltipProps } from "recharts";
import Image from "next/image";

import moment from "moment";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { withBasePath } from "@/utils/helpers";

// Pass dashboard as a prop to access throughput
const ChartTooltipRpcFull = (
  props: TooltipProps<ValueType, NameType> & {
    listGraphState: string;
    labels: {
      xAxis: string;
      yAxis: string;
      clock: string;
    };
    dashboard?: string;
  },
) => {
  const { active, payload, label } = props;

  if (!active || !payload || payload.length === 0) return null;

  // Extract UNIX timestamp from payload
  const clockTimestamp = payload[0]?.payload?.clock;

  // Extract successResponse from payload
  const missedBlocks = payload[0]?.payload?.missedBlocks ?? "N/A";
  return (
    <div className="w-[300px] rounded-xl border border-[#E1E1E1] bg-white p-4 shadow-lg">
      {/* Top Section - Date & Time with Close Icon */}
      <div className="mb-3 flex items-center justify-between text-[14px] font-medium text-[#0B0B0B]">
        <div>
          <span className="text-sm font-semibold">{moment(label).format("D MMMM")}</span>{" "}
        </div>
      </div>

      {/* Missed blocks */}
      <div className="flex justify-between text-sm font-normal text-[#696969]">
        <div className="flex items-center gap-2">
          <span className="inline-block size-3 rounded-[4px] bg-[#FF0303]"></span>
          <span className="text-sm font-normal text-[#696969]">Missed Blocks</span>
        </div>
        <span className="text-lg font-semibold text-[#09122D]">{missedBlocks}</span>
      </div>
    </div>
  );
};

export default ChartTooltipRpcFull;
