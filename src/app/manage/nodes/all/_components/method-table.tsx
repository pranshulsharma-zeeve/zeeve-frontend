import { MethodCountDistributionResponse } from "@/services/platform/getMethodCountDistribution";

const MethodTable: React.FC<{ data: (MethodCountDistributionResponse & { color: string })[]; colors: string[] }> = ({
  data,
}) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const dataWithColorsAndPercentages = data
    .map((entry) => {
      const percentage = (entry.count / total) * 100;
      const isOthers = percentage < 5;
      return {
        ...entry,
        color: isOthers ? "#e0421f" : entry.color,
        percentage: percentage.toFixed(2),
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="scrollbar-thin-custom ml-3 mt-1 h-[320px] overflow-y-auto rounded-md border bg-white pl-3">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 1 }}>
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <th style={{ textAlign: "left", padding: "8px", paddingLeft: "10px" }} className="font-semibold">
              Method Name
            </th>
            <th style={{ textAlign: "left", padding: "8px" }} className="font-semibold">
              Count
            </th>
            {/* <th style={{ textAlign: "left", padding: "8px" }}>Percentage</th> */}
          </tr>
        </thead>
        <tbody>
          {dataWithColorsAndPercentages.map((entry, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #ddd", color: "#4b5563" }}>
              <td className="flex items-center gap-3 p-2 text-xs">
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: entry.color,
                    borderRadius: "50%",
                  }}
                ></div>
                {entry.method_name}
              </td>
              <td style={{ padding: "8px", fontSize: "12px" }}>{entry.count}</td>
              {/* <td style={{ padding: "8px" }}>{entry.percentage}%</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MethodTable;
