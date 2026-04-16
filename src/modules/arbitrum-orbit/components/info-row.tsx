import React from "react";
import { Skeleton, tx, Z4CopyButton } from "@zeeve-platform/ui";

type InfoRowProps = {
  label: string;
  value: React.ReactNode;
  showCopyButton?: boolean;
  textAlign?: "left" | "right" | "sm:right";
  isLoading?: boolean;
  className?: string;
  copyValue?: string;
  valueClassName?: string;
  labelClassName?: string;
};

const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  copyValue,
  showCopyButton = false,
  textAlign = "left",
  isLoading = false,
  className = "",
  valueClassName = "",
  labelClassName = "",
}) => {
  const getAlignmentClasses = () => {
    if (textAlign === "right") return "items-end text-right";
    if (textAlign === "sm:right") return "items-start sm:items-end sm:text-right";
    return "items-start";
  };

  const getJustifyClasses = () => {
    if (textAlign === "right") return "justify-end";
    if (textAlign === "sm:right") return "justify-start sm:justify-end";
    return "justify-start";
  };

  return (
    <div className={tx("flex flex-col overflow-hidden whitespace-nowrap", getAlignmentClasses(), className)}>
      <span className={tx("mb-0.5 block text-sm text-[#696969]", labelClassName)}>{label}</span>

      {isLoading ? (
        <Skeleton role="status" as="div" className="w-full">
          <div className="mb-4 h-2.5 w-28 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2.5 h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </Skeleton>
      ) : (
        <div className={tx("flex items-center space-x-2", getJustifyClasses(), valueClassName)}>
          <p className="truncate text-sm">{value ?? "NA"}</p>
          {showCopyButton && value && <Z4CopyButton text={copyValue ?? `${value}`} />}
        </div>
      )}
    </div>
  );
};

export default InfoRow;
