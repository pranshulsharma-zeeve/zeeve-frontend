"use client";

import { useEffect, useRef, useState } from "react";
import { Button, tx } from "@zeeve-platform/ui";
import { IconDownload } from "@zeeve-platform/icons/product/outline";
import { IconChevronDown } from "@zeeve-platform/icons/arrow/outline";
import { TimeRangeSelector } from "@/modules/reports/components";
import type { ReportRange } from "@/types/reporting";

interface DownloadAction {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface ReportActionsProps {
  range: ReportRange;
  onRangeChange: (range: ReportRange) => void;
  downloadActions: DownloadAction[];
  disabled?: boolean;
  className?: string;
}

const ReportActions = ({ range, onRangeChange, downloadActions, disabled, className }: ReportActionsProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  }, [isMenuOpen]);

  if (disabled) {
    return null;
  }

  const handleAction = (action: DownloadAction) => {
    if (action.disabled) {
      return;
    }
    setIsMenuOpen(false);
    action.onClick();
  };

  return (
    <div className={tx("flex flex-wrap items-center gap-3", className)}>
      <div className="relative" ref={menuRef}>
        <Button
          variant="outline"
          className="h-9 px-3 text-xs font-semibold text-slate-700"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          iconLeft={<IconDownload />}
          iconRight={<IconChevronDown className="text-[18px]" />}
        >
          Download
        </Button>
        {isMenuOpen ? (
          <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl">
            {downloadActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => handleAction(action)}
                disabled={action.disabled}
                className={tx(
                  "w-full px-4 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50",
                  action.disabled ? "cursor-not-allowed text-slate-400" : undefined,
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <TimeRangeSelector value={range} onChange={onRangeChange} />
    </div>
  );
};

ReportActions.displayName = "ReportActions";

export type { ReportActionsProps };
export { ReportActions };
