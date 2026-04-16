"use client";

import { tx } from "@zeeve-platform/ui";

interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

const EmptyState = ({ title, description, className }: EmptyStateProps) => {
  return (
    <div
      className={tx(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center",
        className,
      )}
    >
      <div className="text-sm font-semibold text-slate-700">{title}</div>
      {description ? <div className="mt-1 text-xs text-slate-500">{description}</div> : null}
    </div>
  );
};

export default EmptyState;
