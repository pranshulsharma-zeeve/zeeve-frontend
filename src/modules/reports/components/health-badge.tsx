"use client";

import { tx } from "@zeeve-platform/ui";
import type { HealthStatus } from "@/types/reporting";
import { getHealthLabel, getHealthStyles } from "@/modules/reports/utils";

interface HealthBadgeProps {
  status?: HealthStatus;
  label?: string;
  className?: string;
}

const HealthBadge = ({ status, label, className }: HealthBadgeProps) => {
  const styles = getHealthStyles(status);
  return (
    <span
      className={tx(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        styles.bg,
        styles.border,
        styles.text,
        className,
      )}
    >
      {label ?? getHealthLabel(status)}
    </span>
  );
};

export default HealthBadge;
