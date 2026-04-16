/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Area, Tooltip } from "recharts";
import moment from "moment";
import { tx } from "@zeeve-platform/ui";
import {
  getPolygonCdkDemoHost,
  getPolygonCdkDemoVizionToken,
  getPolygonCdkDemoVizionUrl,
  isPolygonCdkDemoNetwork,
} from "../demo-vizion";
import { useUserStore } from "@/store/user";
import { getCookie } from "@/utils/cookies";
import ChartTooltipFull from "@/components/chart-tooltip-full";
import KeyValue from "@/components/vizion/key-value";
import ChartTooltip from "@/components/chart-tooltip";
import useVisionService from "@/services/vision/use-vision-service";
import { useVisionUserStore } from "@/store/vizionUser";
import ROUTES from "@/routes";

const FinancialsTransactionsArea = ({
  dayRange,
  listGraphValue,
  listGraph,
  listGraphState,
  gasFee,
  batchFee,
  rewardBatch,
  totalFee,
}: {
  dayRange: string;
  listGraphValue?: string;
  listGraph?: boolean;
  listGraphState?: string;
  gasFee?: boolean;
  batchFee?: boolean;
  totalFee?: boolean;
  rewardBatch?: boolean;
}) => {
  const { id } = useParams();
  const networkId = id as string;
  const [colorGasFee, setColorGasFee] = useState("#9085FA");
  const [colorBatchFee, setColorBatchFee] = useState("#E59D44");
  const [colorBatchReward, setColorBatchReward] = useState("#26C0C7");
  const [colorTotalFees, setColorTotalFees] = useState("#DC3090");
  // const { isRefreshed, isRefreshInterval } = useUserStore();
  const user = useVisionUserStore((state) => state.visionUser);
  const [dayRangeUpdate, setDayRange] = useState<number>(1);
  const { request, url: financialUrlConfig } = useVisionService().mainPage.financial();
  const queryToken = useSearchParams().get("token");
  const isDemoNetwork = isPolygonCdkDemoNetwork(networkId);
  const demoToken = getPolygonCdkDemoVizionToken()?.trim();
  const token = isDemoNetwork ? demoToken || (user?.token ?? getCookie("token")) : (user?.token ?? getCookie("token"));
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const currentHost = isDemoNetwork
    ? getPolygonCdkDemoHost()
    : user?.hostData?.find((host) => host.networkId === networkId);
  const financialUrl = isDemoNetwork ? getPolygonCdkDemoVizionUrl(ROUTES.VISION.API.FINANCIAL) : financialUrlConfig;
  const fetchChartData = async () => {
    try {
      const selectedHost = currentHost ?? user?.hostData?.[0];
      if (!selectedHost) {
        setIsLoading(false);
        return;
      }
      const { primaryHost } = selectedHost;
      const response = await request(
        financialUrl,
        {
          numOfDays: dayRangeUpdate,
          primaryHost,
          currentTime: new Date(),
          proxyType: currentHost?.proxyType || "ha",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response?.data?.data) {
        console.error("API response data is missing!");
        return;
      }

      const gasFeeData = response.data.data["Rollup Gas Fee Trend"];
      const batchFeeData = response.data.data["Rollup Batch Fee"];
      const batchRewardData = response.data.data["Rollup Reward Per Batch"];
      const totalFeeData = response.data.data["Rollup Total Fee Collected"];

      if (!gasFeeData || !batchFeeData || !batchRewardData || !totalFeeData) {
        console.error("Expected keys not found in API response.");
        return;
      }

      const formattedGasFeeData = gasFeeData.map((item: any) => ({
        timestamp: item.timestamp,
        clock: item.clock,
        date: moment(item.timestamp).format("YYYY-MM-DD"),
        gasFee: parseFloat(item.value_avg) || 0,
      }));

      const formattedBatchFeeData = batchFeeData.map((item: any) => ({
        timestamp: item.timestamp,
        clock: item.clock,
        date: moment(item.timestamp).format("YYYY-MM-DD"),
        batchFee: parseFloat(item.value_avg) || 0,
      }));

      const formattedBatchRewardData = batchRewardData.map((item: any) => ({
        timestamp: item.timestamp,
        clock: item.clock,
        date: moment(item.timestamp).format("YYYY-MM-DD"),
        batchReward: parseFloat(item.value_avg) || 0,
      }));

      const formattedRollupTotalData = totalFeeData.map((item: any) => ({
        timestamp: item.timestamp,
        clock: item.clock,
        date: moment(item.timestamp).format("YYYY-MM-DD"),
        totalFee: parseFloat(item.value_avg) || 0,
      }));

      const mergedData: Record<string, any> = {};
      formattedGasFeeData.forEach((item) => {
        if (mergedData[item.timestamp]) {
          mergedData[item.timestamp].gasFee = item.gasFee;
        } else {
          mergedData[item.timestamp] = {
            timestamp: item.timestamp,
            date: item.date,
            clock: item.clock,
            gasFee: item.gasFee,
            batchFee: 0,
            batchReward: 0,
            totalFee: 0,
          };
        }
      });

      formattedBatchFeeData.forEach((item) => {
        if (mergedData[item.timestamp]) {
          mergedData[item.timestamp].batchFee = item.batchFee;
        } else {
          mergedData[item.timestamp] = {
            timestamp: item.timestamp,
            date: item.date,
            clock: item.clock,
            gasFee: 0,
            batchFee: item.batchFee,
            batchReward: 0,
            totalFee: 0,
          };
        }
      });

      formattedBatchRewardData.forEach((item) => {
        if (mergedData[item.timestamp]) {
          mergedData[item.timestamp].batchReward = item.batchReward;
        } else {
          mergedData[item.timestamp] = {
            timestamp: item.timestamp,
            date: item.date,
            clock: item.clock,
            gasFee: 0,
            batchFee: 0,
            batchReward: item.batchReward,
            totalFee: 0,
          };
        }
      });
      formattedRollupTotalData.forEach((item) => {
        if (mergedData[item.timestamp]) {
          mergedData[item.timestamp].totalFee = item.totalFee;
        } else {
          mergedData[item.timestamp] = {
            timestamp: item.timestamp,
            date: item.date,
            clock: item.clock,
            gasFee: 0,
            batchFee: 0,
            batchReward: 0,
            totalFee: item.totalFee,
          };
        }
      });

      const sortedData = Object.values(mergedData).sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
      setChartData(sortedData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetchChartData();
    // const interval = setInterval(() => {
    //   fetchChartData();
    // }, isRefreshInterval);
    // return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayRangeUpdate, token]);

  return (
    <div className="flex size-full min-h-[250px] flex-col">
      <div className="mb-2 flex flex-row items-end justify-end gap-2">
        <div className="rounded-l bg-[#F5F5F5] px-2 py-1">
          {[
            { label: "1D", value: 1 },
            { label: "7D", value: 7 },
            { label: "1M", value: 30 },
          ].map(({ label, value }) => (
            <button
              key={value}
              className={tx(
                "px-3 py-1 rounded-lg text-sm font-medium",
                dayRangeUpdate === value ? "bg-[#4054B2] text-white" : "bg-transparent text-black hover:bg-[#0D8CD24D]",
              )}
              onClick={() => setDayRange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {listGraph && (
        <div className="flex w-full items-start">
          <span className="whitespace-nowrap p-2 text-sm font-medium text-white">{listGraphState}</span>
          <KeyValue
            label=""
            value={Number(listGraphValue) % 1 !== 0 ? Number(listGraphValue).toFixed(3) : Number(listGraphValue) || "0"}
            valueClassName="border border-[#0BB63B] rounded-md p-1 text-[#0BB63B] ml-auto"
          />
        </div>
      )}
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={chartData} margin={{ left: 10, right: 0 }}>
          {/* <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs> */}
          {/* Vertical Dotted Grid Lines */}
          <CartesianGrid vertical={true} horizontal={false} strokeDasharray="3 3" stroke={"#ddd"} />

          <XAxis
            dataKey="timestamp"
            tickLine={false}
            axisLine={false}
            className="hidden text-xs md:block"
            stroke={"#999"}
            dx={0}
            // padding={{ left: 0, right: 0 }}
            tickFormatter={(tick) =>
              dayRangeUpdate === 1 ? moment(tick).format("HH") : moment(tick).format("YYYY-MM-DD")
            }
            interval={"preserveStartEnd"}
          />

          <YAxis
            hide={true}
            tickLine={false}
            axisLine={false}
            className="text-xs"
            stroke={"#999"}
            dx={-5}
            padding={{ top: 10 }}
            domain={[(dataMin: number) => dataMin, (dataMax: number) => dataMax]}
          />

          {listGraph ? (
            <Tooltip
              content={
                <ChartTooltip
                  listGraphState={(listGraphState || "Reward per batch").toLowerCase()}
                  labels={{
                    xAxis: "date",
                    yAxis: "value_avg",
                    clock: "clock",
                  }}
                />
              }
            />
          ) : (
            <Tooltip
              content={
                <ChartTooltipFull
                  listGraphState={(listGraphState || "Reward per batch").toLowerCase()}
                  labels={{
                    xAxis: "date",
                    yAxis: "value_avg",
                    clock: "clock",
                  }}
                />
              }
            />
          )}
          {gasFee && (
            <Area type="monotone" dataKey="gasFee" stroke={colorGasFee} strokeWidth={2} fill="url(#colorGasFee)" />
          )}
          {batchFee && (
            <Area
              type="monotone"
              dataKey="batchFee"
              stroke={colorBatchFee}
              strokeWidth={2}
              fill="url(#colorBatchFee)"
            />
          )}
          {rewardBatch && (
            <Area
              type="monotone"
              dataKey="batchReward"
              stroke={colorBatchReward}
              strokeWidth={2}
              fill="url(#colorBatchReward)"
            />
          )}
          {totalFee && (
            <Area
              type="monotone"
              dataKey="totalFee"
              stroke={colorTotalFees}
              strokeWidth={2}
              fill="url(#colorTotalFees)"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
      {/* {!listGraph && (
          <div className="ml-1 mt-2 flex w-full items-center gap-4 overflow-x-auto text-sm font-normal text-[#AAABB8]">
            <div className="flex items-center space-x-2">
              <span className="size-3 rounded-full bg-[#26C0C7]"></span>
              <label className="whitespace-nowrap">Reward Per Batch</label>
            </div>
            <div className="flex items-center space-x-2">
              <span className="size-3 rounded-full bg-[#5133D3]"></span>
              <label className="whitespace-nowrap">Batch Fee</label>
            </div>
            <div className="flex items-center space-x-2">
              <span className="size-3 rounded-full bg-[#DC3090]"></span>
              <label className="whitespace-nowrap">
                Transaction Fees Collected
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <span className="size-3 rounded-full bg-[#9085FA]"></span>
              <label className="whitespace-nowrap">Gas Fee Trends</label>
            </div>
          </div>
        )} */}
    </div>
  );
};

export default FinancialsTransactionsArea;
