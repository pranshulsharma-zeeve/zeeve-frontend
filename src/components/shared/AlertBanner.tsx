"use client";
import React from "react";

type Kind = "success" | "warning" | "error" | "info";

interface AlertBannerProps {
  kind?: Kind;
  message: React.ReactNode;
  className?: string;
}

const kindClass: Record<Kind, string> = {
  success: "bg-green-500/15 text-green-300",
  warning: "bg-yellow-500/15 text-yellow-300",
  error: "bg-red-500/15 text-red-300",
  info: "bg-blue-500/15 text-blue-300",
};

const AlertBanner = ({ kind = "info", message, className }: AlertBannerProps) => {
  const classes = ["rounded-md px-3 py-2 text-sm", kindClass[kind], className].filter(Boolean).join(" ");
  return <div className={classes}>{message}</div>;
};

export default AlertBanner;
