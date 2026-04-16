"use client";

import Image from "next/image";
import { Skeleton } from "@zeeve-platform/ui";
import { withBasePath } from "@/utils/helpers";

interface ValidatorDashboardHeaderProps {
  validatorName: string;
  validatorAddress?: string;
  protocolName?: string;
  protocolIcon?: string;
  isLoading?: boolean;
  status?: "active" | "inactive";
  statusLabel?: string;
  connectionStatus?: "connected" | "disconnected" | "unknown";
  jailed?: boolean;
  networkType?: string;
}

const ValidatorDashboardHeader = ({
  validatorName,
  validatorAddress,
  protocolName,
  protocolIcon = "/assets/images/protocols/coreum.svg",
  isLoading = false,
  status,
  statusLabel,
  connectionStatus,
  jailed = false,
  networkType,
}: ValidatorDashboardHeaderProps) => {
  const statusText = statusLabel ?? (status ? status.charAt(0).toUpperCase() + status.slice(1) : undefined);
  const statusClasses =
    status === "active"
      ? "bg-green-100 text-green-700"
      : status === "inactive"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-600";

  const connectionClasses =
    connectionStatus === "connected"
      ? "bg-green-100 text-green-700"
      : connectionStatus === "disconnected"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-600";

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-[#f7f2ff] to-[#f0f8ff] p-6">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-md">
            <Image
              src={withBasePath(protocolIcon)}
              alt={`${protocolName ?? "Protocol"} icon`}
              width={40}
              height={40}
              className="size-10"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-[#09122D] lg:text-2xl">{validatorName}</h2>
            {isLoading ? (
              <Skeleton role="status" as="div" className="h-4 w-40 rounded bg-white/60" />
            ) : (
              <span className="font-mono text-xs text-[#5C5F80] lg:text-sm">{validatorAddress ?? "—"}</span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isLoading ? (
            <Skeleton role="status" as="div" className="h-6 w-24 rounded bg-white/60" />
          ) : (
            <>
              {statusText ? (
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusClasses}`}
                >
                  {statusText}
                </span>
              ) : null}
              {connectionStatus ? (
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${connectionClasses}`}
                >
                  {connectionStatus === "unknown"
                    ? "Connection Unknown"
                    : connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
                </span>
              ) : null}
              {jailed ? (
                <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                  Jailed
                </span>
              ) : null}
              {networkType ? (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium capitalize text-blue-700">
                  {networkType.toLowerCase()}
                </span>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidatorDashboardHeader;
