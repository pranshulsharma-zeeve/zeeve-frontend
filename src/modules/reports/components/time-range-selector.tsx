"use client";

import { tx } from "@zeeve-platform/ui";
import type { ReportRange } from "@/types/reporting";

interface TimeRangeSelectorProps {
  value: ReportRange;
  onChange: (value: ReportRange) => void;
  className?: string;
}

const ranges: Array<{ label: string; value: ReportRange }> = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

const TimeRangeSelector = ({ value, onChange, className }: TimeRangeSelectorProps) => {
  return (
    <div className={tx("flex rounded-lg border border-slate-200 bg-white shadow-sm", className)}>
      {ranges.map((range) => {
        const active = range.value === value;
        return (
          <button
            key={range.value}
            type="button"
            onClick={() => onChange(range.value)}
            className={tx(
              "px-4 py-2 text-xs font-semibold transition",
              active
                ? "rounded-lg bg-brand-primary text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
};

export default TimeRangeSelector;
