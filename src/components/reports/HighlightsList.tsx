import React from "react";

interface HighlightsListProps {
  items: Array<{
    title: string;
    subtitle: string;
    value: string | number;
    valueLabel: string;
    color?: string;
    secondaryValue?: string | number;
    secondaryLabel?: string;
  }>;
  emptyTitle: string;
  emptyDescription: string;
  colorFrom?: string;
  colorTo?: string;
}

const HighlightsList: React.FC<HighlightsListProps> = ({
  items,
  emptyTitle,
  emptyDescription,
  colorFrom = "from-white",
  colorTo = "to-slate-50",
}) => (
  <div className="space-y-3">
    {items.length ? (
      items.map((item, idx) => (
        <div
          key={item.title + idx}
          className="group relative overflow-hidden rounded-2xl border border-slate-200 p-5 shadow-sm transition-all duration-300 hover:scale-105 hover:border-slate-300 hover:shadow-lg"
        >
          {/* Background gradient layer */}
          <div className={`absolute inset-0 bg-gradient-to-br ${colorFrom} ${colorTo}`} />
          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 transition-all duration-300 group-hover:from-blue-500/5 group-hover:to-purple-500/5" />

          {/* Content */}
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-bold tracking-tight text-[#0B1220]">{item.title}</div>
                {/* <div className="mt-1 text-xs text-slate-500">{item.subtitle}</div> */}
              </div>
              <div className="text-right">
                <div
                  className="bg-gradient-to-r bg-clip-text text-lg font-bold text-transparent"
                  style={{
                    transition: "all 300ms",
                    ...(!item.color
                      ? {
                          backgroundImage: "linear-gradient(135deg, #1e40af, #7c3aed)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }
                      : {
                          backgroundImage: `linear-gradient(135deg, ${item.color}, ${item.color}cc)`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }),
                  }}
                >
                  {item.value}
                </div>
                <div className="mt-1 text-xs font-medium text-slate-500">{item.valueLabel}</div>
              </div>
            </div>

            {item.secondaryValue !== undefined && item.secondaryLabel && (
              <div className="mt-4 border-t border-slate-200/60 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {item.secondaryLabel}
                  </span>
                  <span className="text-sm font-bold text-slate-900">{item.secondaryValue}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))
    ) : (
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
        <div className="text-sm font-semibold text-slate-600">{emptyTitle}</div>
        <div className="mt-2 text-xs text-slate-500">{emptyDescription}</div>
      </div>
    )}
  </div>
);

export default HighlightsList;
