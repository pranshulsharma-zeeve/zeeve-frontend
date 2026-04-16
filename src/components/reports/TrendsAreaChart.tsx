import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

import EmptyState from "@/modules/reports/components/empty-state";

interface TrendsAreaChartProps {
  data: Array<Record<string, unknown>>;
  dataKey: string;
  color: string;
  gradientId: string;
  valueFormatter?: (value: number) => string;
  height?: number | string;
  legend?: boolean;
  xAxisKey?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

const TrendsAreaChart: React.FC<TrendsAreaChartProps> = ({
  data,
  dataKey,
  color,
  gradientId,
  valueFormatter,
  height = "15rem",
  legend = true,
  xAxisKey = "date",
  emptyTitle,
  emptyDescription,
}) => {
  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle || "No data"} description={emptyDescription || "No chart data available."} />;
  }

  const heightValue =
    typeof height === "string" && height.startsWith("h-")
      ? { "h-52": "13rem", "h-60": "15rem", "h-80": "20rem", "h-96": "24rem" }[height] || "15rem"
      : height;

  return (
    <div style={{ height: heightValue }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={valueFormatter} />
          <RechartsTooltip
            formatter={(value: number, name: string) => [
              valueFormatter ? valueFormatter(value) : value,
              name.charAt(0).toUpperCase() + name.slice(1),
            ]}
            labelFormatter={(label: string) => label.charAt(0).toUpperCase() + label.slice(1)}
            contentStyle={{
              background: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "8px 12px",
            }}
            itemStyle={{
              color: "#0f172a",
              fontSize: "13px",
              fontWeight: "500",
            }}
            labelStyle={{
              color: "#64748b",
              fontSize: "12px",
              fontWeight: "600",
              marginBottom: "4px",
            }}
          />
          {legend && <Legend />}
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill={`url(#${gradientId})`}
            strokeWidth={2}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendsAreaChart;
