"use client";
import React from "react";

type PillStatus = "success" | "warning" | "error" | "idle" | "info";

interface StatusPillProps {
  status: PillStatus;
  label?: string;
  className?: string;
}

const colorMap: Record<PillStatus, string> = {
  success: "bg-green-500/15 text-green-400",
  warning: "bg-yellow-500/15 text-yellow-400",
  error: "bg-red-500/15 text-red-400",
  idle: "bg-gray-500/15 text-gray-300",
  info: "bg-blue-500/15 text-blue-300",
};

const StatusPill = ({ status, label, className }: StatusPillProps) => {
  const classes = ["inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", colorMap[status], className]
    .filter(Boolean)
    .join(" ");
  return <span className={classes}>{label ?? status}</span>;
};

export default StatusPill;
