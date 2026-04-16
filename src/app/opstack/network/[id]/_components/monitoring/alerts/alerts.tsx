"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { withBasePath } from "@/utils/helpers";

const severityIcons: Record<number, JSX.Element> = {
  1: <Image src={withBasePath("/assets/images/protocol/info.svg")} alt="Severity 1" width={84} height={24} />,
  2: <Image src={withBasePath("/assets/images/protocol/warning.svg")} alt="Severity 2" width={64} height={24} />,
  3: <Image src={withBasePath("/assets/images/protocol/average.svg")} alt="Severity 3" width={64} height={24} />,
  4: <Image src={withBasePath("/assets/images/protocol/high.svg")} alt="Severity 4" width={64} height={24} />,
  5: <Image src={withBasePath("/assets/images/protocol/disaster.svg")} alt="Severity 5" width={64} height={24} />,
  6: <Image src={withBasePath("/assets/images/protocol/normal.svg")} alt="Severity 6" width={64} height={24} />,
};

interface AlertsProps {
  eventid: string;
  name: string;
  acknowledged: string;
  severity: string;
  clock: string;
  status: string;
  rowFontSize?: string;
  rowPadding?: string;
  isMobileCard?: boolean;
}

const Alerts: React.FC<AlertsProps> = ({
  eventid,
  name,
  severity,
  clock,
  status,
  rowFontSize = "text-xs",
  rowPadding = "px-2 py-1",
  isMobileCard = false,
}) => {
  const severityLevel = Number(severity);

  if (isMobileCard) {
    return (
      <div className="flex items-center">
        {severityIcons[severityLevel] || (
          <Image
            src={withBasePath("/assets/images/protocol/default.svg")}
            alt="Unknown Severity"
            width={56}
            height={20}
          />
        )}
      </div>
    );
  }

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="border-t border-[#E1E1E1] text-[#09122D]"
    >
      <td className={`w-1/6 ${rowPadding} ${rowFontSize} text-left`}>{eventid}</td>
      <td className={`w-1/6 ${rowPadding} ${rowFontSize} text-left`}>{name}</td>
      <td className={`w-1/6 ${rowPadding} ${rowFontSize} text-left`}>{status.toLocaleUpperCase() || "NA"}</td>
      <td className={`${rowPadding}`}>
        {severityIcons[severityLevel] || (
          <Image
            src={withBasePath("/assets/images/protocol/default.svg")}
            alt="Unknown Severity"
            width={64}
            height={24}
          />
        )}
      </td>
      <td className={`w-1/6 ${rowPadding} ${rowFontSize} text-right`}>{clock}</td>
    </motion.tr>
  );
};

export default Alerts;
