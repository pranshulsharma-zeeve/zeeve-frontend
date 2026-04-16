"use client";
import { useState, MouseEvent, useEffect } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { saveAs } from "file-saver";
import { IconDownload } from "@zeeve-platform/icons/product/outline";
import { Tooltip as ZeeveTooltip } from "@zeeve-platform/ui";
import { IconButton } from "@zeeve-platform/ui";
import MethodDistributionPieChart from "./_components/method-distribution-pie-chart";
import MethodTable from "./_components/method-table";
import ZeeveLoader from "@/components/shared/ZeeveLoader";
import { useGetNodeMethodCounts } from "@/services/platform/getNodeMethodCounts";
import {
  useGetMethodCountDistribution,
  MethodCountDistributionResponse,
} from "@/services/platform/getMethodCountDistribution";
import { formatDateToReadableString } from "@/utils/helpers";
import { COLORS, OPTIMISTICLABS_EMAILS } from "@/constants/protocol";
import { useUserStore } from "@/store/user";

const TIME_RANGE_TABS = [
  { label: "1 Day", value: 1 },
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
];

const generateConsistentColors = (data: MethodCountDistributionResponse[], colors: string[]) => {
  const colorMap: Record<string, string> = {};
  let colorIndex = 0;

  return data.map((entry) => {
    if (!colorMap[entry.method_name]) {
      colorMap[entry.method_name] = colors[colorIndex % colors.length];
      colorIndex++;
    }
    return { ...entry, color: colorMap[entry.method_name] };
  });
};

const downloadCSV = (
  data: { node_name?: string; method_count_sum?: number; method_name?: string; count?: number }[],
  timerange: number,
  type: "nodes" | "method",
  node_name?: string,
) => {
  let csvContent;

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  if (timerange === 1) {
    startDate.setDate(endDate.getDate() - 1);
  } else {
    startDate.setDate(endDate.getDate() - timerange + 1);
  }

  const formatDate = (date: Date) =>
    date
      .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      .replace(/ /g, "_")
      .replace(",", "");

  const dateRange = `${formatDate(startDate)}-${formatDate(endDate)}`;

  if (type === "nodes") {
    csvContent = ["Node Name,Total Method Count"]
      .concat(data.map((node) => `${node.node_name},${node.method_count_sum}`))
      .join("\n");
    saveAs(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }), `node_method_counts_${dateRange}.csv`);
  } else if (type === "method") {
    csvContent = ["Method Name,Count"].concat(data.map((method) => `${method.method_name},${method.count}`)).join("\n");
    saveAs(
      new Blob([csvContent], { type: "text/csv;charset=utf-8;" }),
      `${node_name}_method_count_distribution_${dateRange}.csv`,
    );
  }
};

const NodeMetrics = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedRange, setSelectedRange] = useState(1); // Default range is 1 day
  const [consistentPieData, setConsistentPieData] = useState<(MethodCountDistributionResponse & { color: string })[]>(
    [],
  );
  const user = useUserStore((state) => state.user);
  const [isOptimisticUser, setIsOptimisticUser] = useState(OPTIMISTICLABS_EMAILS.includes(user?.usercred || ""));

  const { data: nodes, isLoading: isBarDataLoading } = useGetNodeMethodCounts(selectedRange, isOptimisticUser);

  const filteredData = nodes?.filter((node) => node.method_count_sum > 0) || [];

  const { data: pieData, isLoading: isPieDataLoading } = useGetMethodCountDistribution(
    filteredData[activeIndex]?.node_name,
    selectedRange,
    isOptimisticUser,
  );

  useEffect(() => {
    setIsOptimisticUser(OPTIMISTICLABS_EMAILS.includes(user?.usercred || ""));
  }, [user]);

  useEffect(() => {
    if (pieData) {
      const filteredPieData = pieData
        .filter((entry) => entry.count > 0)
        .map((entry) => ({
          ...entry,
          method_name: entry.method_name.replace(/MethodCount$/, ""), // Remove 'MethodCount' suffix
        }));
      setConsistentPieData(generateConsistentColors(filteredPieData, COLORS));
    }
  }, [pieData]);

  const handleClick = (_: MouseEvent<SVGRectElement>, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseEnter = (_: MouseEvent<SVGRectElement>, index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between md:w-[64%]">
        <span className="font-semibold md:text-xl">Total Method Count</span>
        <div className="flex items-center gap-4">
          <ZeeveTooltip text="Download total method counts" placement="bottom-end" className="mt-1 text-xs">
            <IconButton
              className="size-6 rounded-[4px] border border-gray-400 bg-white md:size-6"
              isDisabled={!filteredData.length}
              onClick={() => {
                if (filteredData.length) {
                  downloadCSV(filteredData, selectedRange, "nodes");
                }
              }}
            >
              <IconDownload className="text-sm text-brand-gray lg:text-sm" />
            </IconButton>
          </ZeeveTooltip>
          <div className="flex flex-col rounded border md:flex-row">
            {TIME_RANGE_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedRange(tab.value)}
                className={`px-4 py-2 text-xs ${
                  selectedRange === tab.value
                    ? "rounded bg-brand-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        {isBarDataLoading ? (
          <div className="flex h-[600px] w-full items-center justify-center">
            <ZeeveLoader label="Loading Nodes Method Counts..." className="" />
          </div>
        ) : (
          <div className="w-full md:w-[65%]">
            <ResponsiveContainer
              width="100%"
              height={530}
              className={isBarDataLoading || !filteredData.length ? "hidden" : ""}
            >
              <BarChart
                layout="horizontal"
                data={filteredData}
                margin={window.innerWidth < 768 ? { left: 12 } : { top: 20, right: 10, left: 30, bottom: 0 }}
              >
                <XAxis
                  type="category"
                  dataKey="node_name"
                  tick={false}
                  interval={0}
                  label={{
                    value: "Nodes",
                    position: "insideBottom",
                    offset: 3,
                    fontSize: window.innerWidth < 768 ? 14 : 16,
                    fontWeight: "",
                    color: "#000",
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="method_count_sum"
                  tick={{ fontSize: window.innerWidth < 768 ? 10 : 12, color: "#000" }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div
                          style={{
                            backgroundColor: "#1e293b",
                            color: "#f8fafc",
                            padding: "10px 15px",
                            borderRadius: "8px",
                            fontSize: "15px",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <p
                            style={{
                              margin: "0 0 5px",
                              fontWeight: "",
                              fontSize: "16px",
                              color: "#FFD700",
                            }}
                          >
                            {label}
                          </p>
                          <p style={{ margin: 0, fontWeight: "normal", fontSize: "12px" }}>
                            {`Total Count:`}
                            <span style={{ marginLeft: "6px" }} className="font-semibold">
                              {payload[0].value}
                            </span>
                          </p>
                          <p style={{ margin: 0, fontWeight: "normal", fontSize: "12px" }}>
                            {`Created On:`}
                            <span style={{ marginLeft: "6px" }} className="font-semibold">
                              {formatDateToReadableString(payload[0].payload.node_created_date)}
                            </span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="method_count_sum"
                  onClick={handleClick}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {filteredData.map((_entry, index) => (
                    <Cell
                      cursor="pointer"
                      fill={index === activeIndex ? "#4054B2" : "#00000030"}
                      key={`cell-${index}`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {!isBarDataLoading && (
              <div className="mt-3 text-sm text-gray-600" style={{ width: "100%" }}>
                <div className="flex flex-wrap gap-2">
                  {filteredData.map((node, index) => (
                    <span
                      key={node.node_name}
                      className={`cursor-pointer rounded border bg-gray-100 px-2 py-[2px] text-center text-xs ${
                        index === activeIndex ? "bg-yellow-300" : ""
                      }`}
                      onClick={() => setActiveIndex(index)}
                    >
                      {node.node_name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!isBarDataLoading &&
          nodes &&
          nodes.length > 0 &&
          (isPieDataLoading ? (
            <div className="flex h-[600px] animate-pulse items-center justify-center text-center font-medium md:w-[35%] md:text-xl">
              Loading Method Count Distribution...
            </div>
          ) : (
            <div
              className="flex w-full flex-col md:-mt-12 md:w-[35%]"
              style={{
                backgroundColor: "#d7d3d339", // Light gray background color for separation
                boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.25)", // Further increased shadow visibility
                borderRadius: "10px",
                padding: "16px",
                paddingBottom: "6px",
              }}
            >
              <div className="flex flex-col gap-y-5">
                <span className="flex flex-col items-center justify-between md:ml-3 md:flex-row ">
                  <span className="font-semibold md:text-xl">Method Count Distribution</span>
                  <div className="flex items-center gap-x-2">
                    <span className="text-xs font-normal text-[#333841] md:text-sm">
                      {" "}
                      {filteredData[activeIndex]?.node_name}
                    </span>
                    <ZeeveTooltip
                      text="Download method count distribution"
                      placement="bottom-end"
                      className="mt-1 text-xs"
                    >
                      <IconButton
                        className="size-6 rounded-[4px] border border-gray-400 bg-white md:size-6"
                        isDisabled={!consistentPieData.length}
                        onClick={() => {
                          if (consistentPieData.length) {
                            downloadCSV(
                              consistentPieData,
                              selectedRange,
                              "method",
                              filteredData[activeIndex]?.node_name,
                            );
                          }
                        }}
                      >
                        <IconDownload className="text-sm text-brand-gray lg:text-sm" />
                      </IconButton>
                    </ZeeveTooltip>
                  </div>
                </span>
                {/* Use the MethodDistributionPieChart component in the main render logic */}
                <MethodDistributionPieChart data={consistentPieData} />
                {/* <ResponsiveContainer height={270} className={""}>
                  <PieChart>
                    <Pie
                      data={consistentPieData}
                      labelLine={false}
                      dataKey="count"
                      nameKey="method_name"
                      cx="50%"
                      cy="50%"
                      outerRadius={135}
                      fill="#8884d8"
                    >
                      {consistentPieData.map((entry, index) => (
                        <PieCell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const { method_name, count } = payload[0].payload;
                          const total = consistentPieData.reduce((sum, item) => sum + item.count, 0);
                          const percentage = ((count / total) * 100).toFixed(2);
                          return (
                            <div
                              style={{
                                backgroundColor: "#1e293b",
                                color: "#f8fafc",
                                padding: "10px 15px",
                                borderRadius: "8px",
                                fontSize: "15px",
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <p
                                style={{
                                  margin: "0 0 5px",
                                  fontWeight: "",
                                  fontSize: "18px",
                                  color: "#FFD700",
                                }}
                              >
                                {`${percentage}%`}
                              </p>
                              <p style={{ margin: 0, fontWeight: "", fontSize: "12px" }}>
                                {`Method:`}
                                <span style={{ marginLeft: "6px", fontWeight: "normal" }}>{method_name}</span>
                              </p>
                              <p style={{ margin: 0, fontWeight: "", fontSize: "12px" }}>
                                {`Count:`}
                                <span style={{ marginLeft: "6px" }} className="font-semibold">
                                  {count}
                                </span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer> */}
              </div>
              <MethodTable data={consistentPieData} colors={COLORS} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <div>
      <NodeMetrics />
    </div>
  );
}
