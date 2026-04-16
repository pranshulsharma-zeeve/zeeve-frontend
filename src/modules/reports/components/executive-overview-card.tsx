"use client";

import { tx } from "@zeeve-platform/ui";
import ReportCard from "./report-card";
import TrendIndicator from "./trend-indicator";
import type { HealthStatus } from "@/types/reporting";
import { getHealthStyles } from "@/modules/reports/utils";

interface ExecutiveOverviewCardProps {
  score?: number;
  grade?: string;
  statusLabel: string;
  statusTone?: HealthStatus;
  trendValue?: number;
  trendLabel?: string;
  trendInvert?: boolean;
  verdict: string;
}

const ExecutiveOverviewCard = ({
  score,
  grade,
  statusLabel,
  statusTone = "warning",
  trendValue,
  trendLabel = "vs previous period",
  trendInvert = false,
  verdict,
}: ExecutiveOverviewCardProps) => {
  const statusStyles = getHealthStyles(statusTone);

  return (
    <ReportCard title="Executive Overview" description="At-a-Glance Health and Direction for this Period.">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase text-slate-500">Overall score</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{typeof score === "number" ? score : "NA"}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase text-slate-500">Grade</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{grade ?? "NA"}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase text-slate-500">Status</div>
          <div
            className={tx(
              "mt-3 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
              statusStyles.bg,
              statusStyles.border,
              statusStyles.text,
            )}
          >
            {statusLabel}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase text-slate-500">Trend</div>
          <div className="mt-2 flex items-center gap-2 text-base font-semibold text-slate-900">
            <TrendIndicator value={trendValue} invert={trendInvert} className="text-sm" />
            <span className="text-xs text-slate-500">{trendLabel}</span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600">{verdict}</p>
    </ReportCard>
  );
};

export default ExecutiveOverviewCard;
