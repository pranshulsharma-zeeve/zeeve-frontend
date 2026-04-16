"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Tooltip } from "@zeeve-platform/ui";
import moment from "moment";
import { withBasePath } from "@/utils/helpers";

const severityMap: Record<number, { label: string; bg: string; text: string }> = {
  1: { label: "Info", bg: "bg-[#17A2B833]", text: "text-[#17A2B8]" },
  2: { label: "Warning", bg: "bg-[#EBBC4633]", text: "text-[#EBBC46]" },
  3: { label: "Average", bg: "bg-[#607FFF33]", text: "text-[#607FFF]" },
  4: { label: "High", bg: "bg-[#BD6E2033]", text: "text-[#BD6E20]" },
  5: { label: "Disaster", bg: "bg-[#DE484133]", text: "text-[#DE4841]" },
  6: { label: "Normal", bg: "bg-[#6C757D33]", text: "text-[#6C757D]" },
};

const severityIcons: Record<number, JSX.Element> = {
  1: <Image src={withBasePath("/assets/images/info.svg")} alt="Severity 1" width={64} height={64} />,
  2: <Image src={withBasePath("/assets/images/warning.svg")} alt="Severity 2" width={64} height={64} />,
  3: <Image src={withBasePath("/assets/images/average.svg")} alt="Severity 3" width={64} height={64} />,
  4: <Image src={withBasePath("/assets/images/high.svg")} alt="Severity 4" width={64} height={64} />,
  5: <Image src={withBasePath("/assets/images/disaster.svg")} alt="Severity 5" width={64} height={64} />,
  6: <Image src={withBasePath("/assets/images/normal.svg")} alt="Severity 6" width={64} height={64} />,
};

interface AlertsProps {
  eventid: string;
  name: string;
  acknowledged: string;
  severity: string;
  clock: string;
  status: string;
  className?: string;
}

const Alerts: React.FC<AlertsProps> = ({ eventid, name, severity, clock, status, className }) => {
  const severityLevel = Number(severity);
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`text-sm text-[#09122D] ${className || ""}`}
    >
      <td className="w-1/6 px-4 text-left">{eventid}</td>
      <td className="w-1/6 px-4 text-left">
        <Tooltip
          text={name}
          placement="top"
          className="z-[9999] rounded-lg border border-[#E1E1E1] bg-white p-1 text-sm font-normal text-[#09122D] shadow-lg"
        >
          <span>{name.slice(0, 15)}...</span>
        </Tooltip>
      </td>
      <td className="w-1/6 px-4 text-left">{status.toLocaleUpperCase() || "NA"}</td>
      <td className="px-4 py-3">
        {severityMap[severityLevel] ? (
          <div
            className={`
        flex h-6 w-[64px] items-center justify-center gap-[10px] rounded-[4px] px-2 py-1 text-xs font-medium 
        ${severityMap[severityLevel].bg} ${severityMap[severityLevel].text}
      `}
            style={{
              border: `1px solid ${severityMap[severityLevel].text.replace("text-[", "").replace("]", "")}`,
            }}
          >
            {severityMap[severityLevel].label}
          </div>
        ) : (
          <div className="h-6 w-fit rounded-[4px] border border-gray-400 bg-gray-200 px-2 py-1 text-xs text-gray-600">
            Unknown
          </div>
        )}
      </td>
      <td className="w-1/6 px-4 text-right">
        {moment(clock, "M/D/YYYY, hh:mm:ss A").format("DD MMM YYYY hh:mm:ss A")}
      </td>
    </motion.tr>
  );
};

export default Alerts;
