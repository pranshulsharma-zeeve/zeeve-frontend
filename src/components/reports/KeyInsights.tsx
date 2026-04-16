import React from "react";
import { HealthBadge } from "@/modules/reports/components";
import type { HealthStatus } from "@/types/reporting";

interface KeyInsightsProps {
  insights?: Array<{
    id: string;
    title: string;
    description?: string;
    severity?: HealthStatus;
  }>;
  periodHighlights?: string[];
}

const getSeverityGradient = (severity?: HealthStatus) => {
  switch (severity) {
    case "critical":
      return "from-red-600/10 via-orange-500/5 to-transparent";
    case "warning":
      return "from-amber-500/10 via-yellow-400/5 to-transparent";
    default:
      return "from-emerald-500/10 via-green-400/5 to-transparent";
  }
};

const getSeverityDot = (severity?: HealthStatus) => {
  switch (severity) {
    case "critical":
      return "bg-red-500 shadow-lg shadow-red-500/20";
    case "warning":
      return "bg-amber-500 shadow-lg shadow-amber-500/20";
    default:
      return "bg-emerald-500 shadow-lg shadow-emerald-500/20";
  }
};

const getHighlightGradient = (idx: number) => {
  const gradients = [
    "from-indigo-600/10 via-purple-500/5 to-transparent",
    "from-cyan-500/10 via-teal-400/5 to-transparent",
    "from-green-600/10 via-emerald-500/5 to-transparent",
  ];
  return gradients[idx % 3];
};

const getHighlightColor = (idx: number) => {
  const colors = ["from-indigo-500 to-purple-500", "from-cyan-500 to-teal-400", "from-green-500 to-emerald-400"];
  return colors[idx % 3];
};

const KeyInsights: React.FC<KeyInsightsProps> = ({ insights, periodHighlights }) => {
  const hasContent = (insights && insights.length > 0) || (periodHighlights && periodHighlights.length > 0);

  if (!hasContent) {
    return null;
  }

  return (
    <div className="space-y-5">
      {/* Insights Section */}
      {insights && insights.length > 0 && (
        <div className="space-y-3">
          {insights.map((insight) => {
            const gradientClass = getSeverityGradient(insight.severity);
            const dotClass = getSeverityDot(insight.severity);

            return (
              <div
                key={insight.id}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br ${gradientClass} p-5 backdrop-blur-md transition-all duration-300 hover:border-slate-300/80 hover:shadow-lg`}
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute -inset-full animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>

                <div className="relative flex items-start gap-4">
                  {/* Severity indicator dot */}
                  <div className={`mt-1 flex size-2.5 shrink-0 rounded-full ${dotClass}`} />

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold tracking-tight text-slate-900">{insight.title}</h4>
                        {insight.description && (
                          <p className="mt-2 text-xs leading-relaxed text-slate-600">{insight.description}</p>
                        )}
                      </div>
                      {insight.severity && (
                        <div className="shrink-0">
                          <HealthBadge status={insight.severity} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Divider */}
      {/* {insights && insights.length > 0 && periodHighlights && periodHighlights.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Recommendations</span>
          <div className="h-px flex-1 bg-gradient-to-l from-slate-200 to-transparent" />
        </div>
      )} */}

      {/* Period Highlights / Recommendations Section */}
      {periodHighlights && periodHighlights.length > 0 && (
        <div className="space-y-3">
          {periodHighlights.map((highlight, idx) => {
            const highlightGradient = getHighlightGradient(idx);
            const colorGradient = getHighlightColor(idx);

            return (
              <div
                key={`${highlight}-${idx}`}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br ${highlightGradient} p-5 backdrop-blur-md transition-all duration-300 hover:border-slate-300/80 hover:shadow-lg`}
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute -inset-full animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>

                <div className="relative flex items-start gap-4">
                  {/* Gradient numbered badge */}
                  <div
                    className={`mt-1 flex size-3 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${colorGradient} text-xs font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
                  ></div>

                  <p className="flex-1 pt-0.5 text-sm font-bold leading-relaxed text-slate-700">{highlight}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KeyInsights;
