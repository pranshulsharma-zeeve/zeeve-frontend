/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Area, Tooltip } from "recharts";
import moment from "moment";
import ChartTooltipRpcFull from "@/components/vizion/chart-tooltip-rpc-full";

const AreaChartComponent = ({ chartData, activeIndex = null }: { chartData: any[]; activeIndex?: number | null }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ left: -40, right: 10, bottom: 25 }}>
        <defs>
          {/* Gradient for the area fill */}
          <linearGradient id="missedBlockFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF0303" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          {/* Gradient for the stroke (top line) */}
          <linearGradient id="missedBlockStroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF0303" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={true} horizontal={false} strokeDasharray="3 3" stroke={"rgba(0,0,0,0.1)"} />

        <XAxis
          dataKey="timestamp"
          tickLine={false}
          axisLine={false}
          className=" text-xs"
          stroke={"#999"}
          tickFormatter={(tick) => (tick ? moment(tick).format("DD MMM") : "")}
          interval="preserveStartEnd"
          label={
            <g transform="translate(5, 290)">
              {" "}
              <foreignObject width="150" height="20">
                <div className="flex items-center gap-1 text-[14px] font-normal text-[#999]">
                  <span className="inline-block size-3 rounded-[4px] bg-[#FF0303]"></span>
                  <span>Missed Blocks</span>
                </div>
              </foreignObject>
            </g>
          }
        />

        <YAxis
          tick={false}
          tickLine={false}
          axisLine={false}
          className="text-xs"
          stroke={"#999"}
          dx={5}
          padding={{ top: 10 }}
          tickCount={5}
          domain={[(dataMin: number) => dataMin * 0.4, (dataMax: number) => dataMax * 1.2]}
        />

        <Tooltip
          cursor={false}
          active={activeIndex !== null}
          payload={
            activeIndex !== null && activeIndex >= 0 && activeIndex < chartData.length ? [chartData[activeIndex]] : []
          }
          label={
            activeIndex !== null && activeIndex >= 0 && activeIndex < chartData.length
              ? chartData[activeIndex]?.timestamp
              : ""
          }
          content={
            <ChartTooltipRpcFull
              listGraphState="missed blocks"
              labels={{
                xAxis: "timestamp",
                yAxis: "missedBlocks",
                clock: "clock",
              }}
            />
          }
        />

        <Area
          type="monotone"
          dataKey="missedBlocks"
          stroke="url(#missedBlockStroke)"
          fill="url(#missedBlockFill)"
          strokeWidth={2}
          activeDot={{
            r: 6,
            strokeWidth: 2,
            fill: "#FF0303", // or use the gradient if needed
            stroke: "#FFFFFF",
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;
