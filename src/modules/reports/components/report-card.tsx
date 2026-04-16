"use client";

import type { ReactNode } from "react";
import { Card, tx, Tooltip } from "@zeeve-platform/ui";
import { IconInfoCircle } from "@zeeve-platform/icons/essential/outline";

interface ReportCardProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

const ReportCard = ({ title, description, action, children, className }: ReportCardProps) => {
  return (
    <Card
      className={tx(
        "rounded-2xl border border-[#E2E6F3] bg-white/90 p-5 shadow-[0_16px_34px_rgba(15,23,42,0.08)]",
        className,
      )}
    >
      {(title || description || action) && (
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-2">
            {title ? (
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-[#0B1220]">{title}</h3>
                {description && (
                  <Tooltip text={description} placement="top">
                    <div className="inline-flex">
                      <IconInfoCircle className="size-4 cursor-help text-slate-400 transition-colors hover:text-slate-600" />
                    </div>
                  </Tooltip>
                )}
              </div>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      {children}
    </Card>
  );
};

export default ReportCard;
