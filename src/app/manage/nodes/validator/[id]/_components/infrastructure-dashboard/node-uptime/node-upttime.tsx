/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
  Line,
} from "recharts";
import axios from "axios";
import usePlatformService from "@/services/platform/use-platform-service";
import { useVisionUserStore } from "@/store/vizionUser";
import { useNodeUptimeStore } from "@/store/nodeUptime";
import { getCookie } from "@/utils/cookies";
import HTTP_STATUS from "@/constants/http";

type TimeRange = "1h" | "24h" | "7d";

type NodeUptimeProps = {
  networkId: string;
  protocol?: string;
};

const NodeUptime = ({ networkId, protocol }: NodeUptimeProps) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("24h");
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveringTooltip, setHoveringTooltip] = useState(false);

  const vizionUser = useVisionUserStore((state) => state.visionUser);
  const setNodeStatus = useNodeUptimeStore((state) => state.setNodeStatus);
  const queryToken = useSearchParams().get("token");
  const token = queryToken ?? getCookie("token");
  const { url: portUptimeTrendUrl } = usePlatformService().vizion.portUptimeTrend(protocol);

  const fetchUptimeData = async () => {
    try {
      setIsLoading(true);

      if (!portUptimeTrendUrl) {
        console.warn("[NodeUptime] Missing port uptime trend url", { networkId });
        return;
      }

      if (!vizionUser) {
        console.warn("[NodeUptime] Missing vizion user context", { networkId });
        return;
      }

      const hostList = Array.isArray(vizionUser.hostData) ? vizionUser.hostData : [];
      if (!hostList.length) {
        console.warn("[NodeUptime] vizion user has no host data", {
          vizionUser,
          networkId,
        });

        return;
      }

      const coreumHost = hostList.find((host) => host.networkId === networkId);
      if (!coreumHost) {
        console.warn("[NodeUptime] Unable to locate host entry for network", { networkId, hostList });
        return;
      }

      const hostIds = (coreumHost.hostIds ?? []).filter(Boolean);
      const primaryHost = coreumHost.primaryHost;

      if (!hostIds.length || !primaryHost) {
        console.warn("[NodeUptime] Missing host identifiers", {
          networkId,
          hostIdsLength: hostIds.length,
          primaryHost,
        });
        return;
      }

      const payload = {
        hostIds,
        primaryHost,
        range: selectedRange,
        currentTime: new Date().toISOString(),
      };

      const response = await axios.post(portUptimeTrendUrl, payload, {
        headers: {
          Authorization: `Bearer ${vizionUser?.token ?? token ?? ""}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === HTTP_STATUS.OK) {
        const dataSeries = response.data?.data ?? {};
        // pick the first available series; backend key is protocol-specific (e.g., "Port 26657 Status", "Port 9944 Status")
        const seriesKey = Object.keys(dataSeries)[0];
        const rawData = seriesKey ? (dataSeries[seriesKey] ?? []) : [];

        // Transform API response into chart-ready data
        const formatted = rawData.map((item: any) => ({
          timestamp: Number(item.clock) * 1000,
          value: Number(item.value_avg ?? item.value),
          displayTime: item.timestamp,
        }));

        setChartData(formatted);

        // Set node status based on most recent value_avg
        if (formatted.length > 0) {
          const mostRecent = formatted[formatted.length - 1];
          const status = mostRecent.value === 1 ? "active" : "standby";
          setNodeStatus(`${networkId}-node1`, status);
        }
      }
    } catch (error) {
      console.error("[NodeUptime] Error fetching uptime data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (networkId && vizionUser) {
      fetchUptimeData();
    }
  }, [selectedRange, networkId, vizionUser, portUptimeTrendUrl, token]);

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="animate-pulse text-sm text-gray-500">Loading port uptime...</div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-sm text-gray-500">
        No uptime data available.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[250px] flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="font-poppins text-xl font-medium text-[#09122D]">Uptime</div>
        <div className="flex gap-2">
          {(["1h", "24h", "7d"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedRange === range ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="grow">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ left: 0, right: 10, bottom: 10, top: 10 }}>
            {/* Green uptime background */}
            <ReferenceArea
              x1={chartData[0]?.timestamp}
              x2={chartData[chartData.length - 1]?.timestamp}
              y1={0}
              y2={1}
              fill="#1edb89"
              fillOpacity={0.8}
            />

            {/* Red downtime markers */}
            {chartData
              .filter((d) => d.value === 0)
              .map((d, idx) => (
                <ReferenceLine key={idx} x={d.timestamp} stroke="#ff495c" strokeWidth={3} />
              ))}

            {/* Invisible line to enable tooltip */}
            <Line dataKey="value" stroke="transparent" dot={false} isAnimationActive={false} />

            <XAxis
              dataKey="timestamp"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              interval="preserveStartEnd"
              tickMargin={8}
              tickFormatter={(tick) =>
                selectedRange === "7d" ? moment(tick).format("DD/MM") : moment(tick).format("HH:mm")
              }
              stroke="#999"
              tick={{ fontSize: 12, fill: "#39475A" }}
            />

            <YAxis hide domain={[0, 1]} />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  const isDown = dataPoint.value === 0;

                  return (
                    <div
                      onMouseEnter={() => setHoveringTooltip(true)}
                      onMouseLeave={() => setHoveringTooltip(false)}
                      className="pointer-events-auto max-w-xs rounded-md border bg-white p-3 shadow-lg"
                      style={{ pointerEvents: "auto" }}
                    >
                      <p className={`mb-1 text-sm font-semibold ${isDown ? "text-red-500" : "text-green-500"}`}>
                        {isDown ? "Downtime" : "Uptime"}
                      </p>
                      <p className="text-xs text-gray-700">
                        {dataPoint.displayTime || moment(dataPoint.timestamp).format("DD-MM-YYYY HH:mm:ss")}
                      </p>
                      <p className="mt-1 text-xs text-gray-600">Status: {isDown ? "Down (0)" : "Up (1)"}</p>
                    </div>
                  );
                }
                return null;
              }}
              wrapperStyle={{ pointerEvents: "auto" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NodeUptime;
