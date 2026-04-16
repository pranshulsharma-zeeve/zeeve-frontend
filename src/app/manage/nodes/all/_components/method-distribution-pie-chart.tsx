import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell as PieCell } from "recharts";
import { MethodCountDistributionResponse } from "@/services/platform/getMethodCountDistribution";
import { COLORS } from "@/constants/protocol";

const MethodDistributionPieChart: React.FC<{ data: (MethodCountDistributionResponse & { color: string })[] }> = ({
  data,
}) => {
  // Calculate total method count
  const totalMethodCount = data.reduce((sum, item) => sum + item.count, 0);

  // Filter methods with >= 5% and accumulate the rest as "Other"
  const significantMethods = data.filter((item) => (item.count / totalMethodCount) * 100 >= 5);
  const others = data.filter((item) => (item.count / totalMethodCount) * 100 < 5).sort((a, b) => b.count - a.count); // Sort others in descending order of count

  const otherTotal = others.reduce((sum, item) => sum + item.count, 0);

  const pieData =
    others.length > 0
      ? [...significantMethods, { method_name: "Other", count: otherTotal, details: others, color: "#e0421f" }]
      : significantMethods; // Exclude "Other" if there are no insignificant methods

  return (
    <ResponsiveContainer height={290} className="">
      <PieChart>
        <Pie
          data={pieData}
          dataKey="count"
          nameKey="method_name"
          cx="50%"
          cy="50%"
          outerRadius={110}
          fill="#8884d8"
          // label={({ name, x, y }) => (
          //   <text
          //     x={x}
          //     y={y}
          //     textAnchor="middle"
          //     // dominantBaseline="central"
          //     style={{ fill: "#333" }}
          //     className="text-xs font-medium"
          //   >
          //     {name}
          //   </text>
          // )}
        >
          {pieData.map((entry, index) => (
            <PieCell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              const percentage = ((data.count / totalMethodCount) * 100).toFixed(2);
              return (
                <div
                  style={{
                    backgroundColor: "#1e293b",
                    color: "#f8fafc",
                    padding: "10px 15px",
                    borderRadius: "12px",
                    fontSize: "15px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {data.method_name !== "Other" && (
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
                  )}
                  <p className={`m-0 ${data.method_name === "Other" ? "text-lg font-medium" : "text-xs"}`}>
                    {data.method_name === "Other" ? "Other Methods" : data.method_name}
                  </p>
                  {/* <p style={{ margin: 0 }}>Count: {data.count}</p> */}
                  {data.method_name === "Other" && (
                    <div style={{ marginTop: "10px" }}>
                      {/* <p style={{ margin: 0, fontWeight: "bold" }}>Details:</p> */}
                      <ul style={{ paddingLeft: "0px", margin: 0 }}>
                        {data.details.map((item: { method_name: string; count: number }, index: number) => (
                          <li key={index} style={{ fontSize: "12px" }} className="mt-1">
                            {item.method_name}:
                            <span className="ml-1 font-semibold text-[#FFD700]">{`${((item.count / totalMethodCount) * 100).toFixed(4)}%`}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            }
            return null;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MethodDistributionPieChart;
