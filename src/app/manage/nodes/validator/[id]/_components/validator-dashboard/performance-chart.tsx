"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, Skeleton } from "@zeeve-platform/ui";

interface PerformanceDatum {
  height: number;
  signed?: number;
  missed: number;
  expected_blocks?: number;
  produced_blocks?: number;
}

interface PerformanceData {
  series: PerformanceDatum[];
  latestHeight?: number;
  error?: string;
  note?: string;
  windowSize?: number;
  valconsAddr?: string;
}

interface PerformanceChartProps {
  performanceData?: PerformanceData;
  isLoading?: boolean;
  period?: 1 | 7 | 30;
  onPeriodChange?: (period: 1 | 7 | 30) => void;
  protocolName?: string;
}

const PerformanceChart = ({
  performanceData,
  isLoading = false,
  period = 7,
  onPeriodChange,
  protocolName = "Coreum",
}: PerformanceChartProps) => {
  const isNear = protocolName?.toLowerCase() === "near";
  const periodTabs = [
    { value: 1 as const, label: "Last 24 hrs" },
    { value: 7 as const, label: "Last 7 days" },
    { value: 30 as const, label: "Last 30 days" },
  ];

  const chartData = useMemo(() => {
    if (!performanceData?.series) return [];

    return performanceData.series.map((item) => ({
      name: item.height.toString(),
      signed: isNear ? (item.produced_blocks ?? 0) : (item.signed ?? 0),
      missed: item.missed ?? 0,
      expected: isNear ? item.expected_blocks : undefined,
      produced: isNear ? item.produced_blocks : undefined,
    }));
  }, [performanceData?.series, isNear]);

  const hasError = Boolean(performanceData?.error);
  const hasData = chartData.length > 0;

  const renderTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    if (isNear) {
      // NEAR protocol: show expected, produced, and missed
      const expected = data.expected ?? 0;
      const produced = data.produced ?? 0;
      const missed = data.missed ?? 0;
      const producedPct = expected > 0 ? ((produced / expected) * 100).toFixed(1) : "0";
      const missedPct = expected > 0 ? ((missed / expected) * 100).toFixed(1) : "0";

      return (
        <div className="rounded-lg border border-[#E4E6F3] bg-white p-3 text-xs shadow-sm">
          <div className="mb-2 font-semibold text-[#09122D]">Height: {data.name}</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-sm bg-[#24C28B]" />
              <span className="text-[#7D809C]">
                Produced: {produced.toLocaleString()} ({producedPct}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-sm bg-[#FF6B6B]" />
              <span className="text-[#7D809C]">
                Missed: {missed.toLocaleString()} ({missedPct}%)
              </span>
            </div>
            <div className="mt-1 text-[#7D809C]">Expected: {expected.toLocaleString()}</div>
          </div>
        </div>
      );
    }

    // Other protocols: show signed and missed
    const total = data.signed + data.missed;
    const signedPct = total > 0 ? ((data.signed / total) * 100).toFixed(1) : "0";
    const missedPct = total > 0 ? ((data.missed / total) * 100).toFixed(1) : "0";

    return (
      <div className="rounded-lg border border-[#E4E6F3] bg-white p-3 text-xs shadow-sm">
        <div className="mb-2 font-semibold text-[#09122D]">Height: {data.name}</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-sm bg-[#24C28B]" />
            <span className="text-[#7D809C]">
              Signed: {data.signed.toLocaleString()} ({signedPct}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-sm bg-[#FF6B6B]" />
            <span className="text-[#7D809C]">
              Missed: {data.missed.toLocaleString()} ({missedPct}%)
            </span>
          </div>
        </div>
      </div>
    );
  };
  const subtitle = isNear ? "Block production performance over time" : "Block signing performance over time";
  return (
    <Card className="flex flex-col gap-4 rounded-2xl border border-[#F0F0F0] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-[#09122D]">Performance</h3>
          <p className="text-xs text-[#7D809C]">{subtitle}</p>
        </div>

        {onPeriodChange && (
          <div className="flex gap-1 rounded-lg border border-[#E4E6F3] bg-[#F8F9FC] p-1">
            {periodTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => onPeriodChange(tab.value)}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-all ${
                  period === tab.value ? "bg-white text-[#09122D] shadow-sm" : "text-[#7D809C] hover:text-[#09122D]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {hasError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <div className="font-semibold">Unable to fetch performance data</div>
          <div className="mt-1 text-xs">{performanceData?.note || performanceData?.error}</div>
        </div>
      )}

      <div className="relative h-80 w-full">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-gray-100">
            <div className="flex flex-col items-center gap-2">
              <div className="size-8 animate-spin rounded-full border-4 border-[#E4E6F3] border-t-[#5B5FC7]" />
              <span className="text-xs text-[#7D809C]">Loading performance data...</span>
            </div>
          </div>
        ) : !hasData ? (
          <div className="flex h-full items-center justify-center text-sm text-[#7D809C]">
            {hasError
              ? "Performance data unavailable"
              : "No performance data available. Data will appear after first snapshot."}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F3" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#7D809C", fontSize: 12 }}
                tickLine={{ stroke: "#E4E6F3" }}
                label={{ value: "Block Height", position: "insideBottom", offset: -5, fill: "#7D809C" }}
              />
              <YAxis
                tick={{ fill: "#7D809C", fontSize: 12 }}
                tickLine={{ stroke: "#E4E6F3" }}
                label={{ value: "Blocks", angle: -90, position: "insideLeft", fill: "#7D809C" }}
              />
              <Tooltip content={renderTooltip} />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="square"
                formatter={(value) => (
                  <span className="text-sm text-[#7D809C]">{value.charAt(0).toUpperCase() + value.slice(1)}</span>
                )}
              />
              <Bar
                dataKey="signed"
                stackId="a"
                fill="#24C28B"
                name={isNear ? "produced" : "signed"}
                radius={[0, 0, 0, 0]}
              />
              <Bar dataKey="missed" stackId="a" fill="#FF6B6B" name="missed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      {!isNear && (
        <div className="flex flex-wrap gap-4 border-t border-[#F0F0F0] pt-3 text-xs text-[#7D809C]">
          <div>
            <span className="font-medium">Window Size:</span> {performanceData?.windowSize?.toLocaleString() ?? "—"}
          </div>
          <div className="break-all">
            <span className="font-medium">Consensus Address:</span> {performanceData?.valconsAddr}
          </div>
        </div>
      )}
    </Card>
  );
};

export type { PerformanceData, PerformanceDatum };
export default PerformanceChart;
