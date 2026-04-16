/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import moment from "moment";
import axios from "axios";
import AreaChartComponent from "./area-chart";
import BarChartComponent from "./bar-chart";
import { getCookie } from "@/utils/cookies";
import { withBasePath } from "@/utils/helpers";
import usePlatformService from "@/services/platform/use-platform-service";
import { useVisionUserStore } from "@/store/vizionUser";

const FinancialsTransactionsArea = () => {
  const params = useParams();
  const networkId = params.id as string;
  const { request, url } = usePlatformService().vizion.stackedGraph();
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [view, setView] = useState<"area" | "bar">("area");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const vizionUser = useVisionUserStore((state) => state.visionUser);
  const queryToken = useSearchParams().get("token");
  const token = queryToken ?? getCookie("token");

  const fetchChartData = async () => {
    try {
      if (!vizionUser) {
        console.warn("[FinancialsTransactionsArea] Missing vizion user context, skip fetch.", { networkId });
        setIsLoading(false);
        return;
      }
      const hostList = Array.isArray(vizionUser.hostData) ? vizionUser.hostData : [];
      if (!hostList.length) {
        console.warn("[FinancialsTransactionsArea] vizion user has no host data", { vizionUser, networkId });
      }
      const coreumHost = hostList.find((host) => host.networkId === networkId);
      if (!coreumHost) {
        console.warn("[FinancialsTransactionsArea] Unable to locate host entry for network", { networkId, hostList });
      }
      const coreumPrimaryHost = coreumHost?.primaryHost ?? "";
      console.log("[FinancialsTransactionsArea] fetching chart data", {
        networkId,
        primaryHost: coreumPrimaryHost,
      });

      const response = await axios.post(
        url,
        {
          primaryHost: coreumPrimaryHost,
          token: token ?? "",
          numOfDays: "10",
          currentTime: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${vizionUser?.token ?? token ?? ""}`,
            "Content-Type": "application/json",
          },
        },
      );
      const missedBlockData = response?.data?.data?.["Coreum Validator Signing Info (Missed Blocks)"];
      if (!missedBlockData) {
        console.error("Expected missed block data not found.");
        return;
      }

      const formattedData = missedBlockData.map((item: any) => ({
        timestamp: moment.unix(Number(item.clock)).format("YYYY-MM-DD"),
        date: item.timestamp,
        clock: item.clock,
        missedBlocks: parseFloat(item.value_avg),
      }));

      setChartData(formattedData);
      // Set active index to show tooltip on last data point
      setActiveIndex(formattedData.length - 1);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  // Reset active index when switching views to ensure tooltip shows
  useEffect(() => {
    if (chartData.length > 0) {
      setActiveIndex(chartData.length - 1);
    }
  }, [view, chartData]);

  return (
    <div className="flex size-full min-h-[250px] flex-col">
      <div className="mb-2 flex flex-row items-center justify-between gap-2">
        {/* <div className="flex w-full items-center justify-between">
          <div className="flex gap-2 rounded-lg bg-[#F5F5F5] p-2.5 text-[#696969]">
            <div className="flex items-center justify-center rounded-[4px] p-[6px_8px] transition-all duration-150 hover:bg-[#0DC0FA]">
              <Image
                src={withBasePath("/assets/images/vizion/area-chart.svg")}
                alt="AreaChart"
                width={20}
                height={20}
              />
            </div>
            <div className="flex items-center justify-center rounded-[4px] p-[6px_8px] transition-all duration-150 hover:bg-[#0DC0FA]">
              <Image src={withBasePath("/assets/images/vizion/bar-chart.svg")} alt="BarChart" width={20} height={20} />
            </div>
          </div>
        </div> */}
        <div className={`font-poppins text-xl font-medium text-[#09122D]`}>Number of Missed Blocks</div>

        <div className="flex gap-2 rounded-lg bg-[#F5F5F5] p-1.5 text-[#696969]">
          <div
            className={`flex items-center justify-center rounded-[4px] p-[6px_8px] transition-all duration-150 ${
              view === "area" ? "bg-[#0DC0FA]" : "hover:bg-[#0DC0FA]"
            }`}
            onClick={() => setView("area")}
          >
            <Image src={withBasePath("/assets/images/vizion/area-chart.svg")} alt="AreaChart" width={20} height={20} />
          </div>
          <div
            className={`flex items-center justify-center rounded-[4px] p-[6px_8px] transition-all duration-150 ${
              view === "bar" ? "bg-[#0DC0FA]" : "hover:bg-[#0DC0FA]"
            }`}
            onClick={() => setView("bar")}
          >
            <Image src={withBasePath("/assets/images/vizion/bar-chart.svg")} alt="BarChart" width={20} height={20} />
          </div>
        </div>
      </div>

      <div className="grow">
        {view === "area" ? (
          <AreaChartComponent key={`area-${activeIndex}`} chartData={chartData} activeIndex={activeIndex} />
        ) : (
          <BarChartComponent key={`bar-${activeIndex}`} chartData={chartData} activeIndex={activeIndex} />
        )}
      </div>
    </div>
  );
};

export default FinancialsTransactionsArea;
