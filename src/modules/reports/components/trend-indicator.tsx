"use client";

import { tx } from "@zeeve-platform/ui";
import { formateNumber } from "@/utils/helpers";

interface TrendIndicatorProps {
  value?: number;
  className?: string;
  invert?: boolean;
}

const TrendIndicator = ({ value, className, invert = false }: TrendIndicatorProps) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  const isPositive = value > 0;
  const isNeutral = value === 0;
  const formatted = `${isPositive ? "+" : ""}${formateNumber(value, 2)}%`;
  const isGood = invert ? value < 0 : value > 0;

  return (
    <span
      className={tx(
        "text-xs font-semibold",
        isNeutral ? "text-slate-500" : isGood ? "text-emerald-600" : "text-rose-600",
        className,
      )}
    >
      {formatted}
    </span>
  );
};

export default TrendIndicator;
