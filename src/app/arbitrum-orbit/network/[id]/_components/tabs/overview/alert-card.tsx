"use client";
import React from "react";
import { tx } from "@zeeve-platform/ui";
import { useParams } from "next/navigation";
import { formatDate } from "@orbit/utils/helpers";
import InfoRow from "@orbit/components/info-row";
import { Alert } from "@orbit/services/oas/alert/list";

type GeneralProps = {
  data: Alert | undefined;
  isLoading: boolean;
};

const AlertCard = ({ data, isLoading }: GeneralProps) => {
  useParams();
  return (
    <div className="mx-4 mb-4 flex flex-col rounded-lg border border-brand-outline bg-white p-6 shadow-sm">
      <div className="grid grid-cols-12 flex-col gap-3">
        <InfoRow label="Alert Id" value={data?.alertId} isLoading={isLoading} className="col-span-6" />
        <InfoRow
          label="Alert Name"
          textAlign="right"
          value={data?.alertName}
          isLoading={isLoading}
          className="col-span-6"
        />
        <InfoRow
          label="Status"
          value={
            <div
              className={tx(
                "rounded-md w-min px-1.5 py-1 text-center text-xs font-normal",
                { "bg-[#FF9292]": data?.status === "firing" },
                { "bg-brand-green": data?.status === "resolved" },
                { " text-brand-light": data?.status },
              )}
            >
              {data?.status ? data?.status.toUpperCase() : "NA"}
            </div>
          }
          isLoading={isLoading}
          className="col-span-6"
        />
        <InfoRow
          label="Alert Type"
          className="col-span-6"
          textAlign="right"
          value={data?.alertType}
          isLoading={isLoading}
        />
        <InfoRow
          label="Severity"
          value={
            <div
              className={tx(
                "rounded-md w-min px-1.5 py-1 text-center text-xs font-normal",
                {
                  "bg-[#FFC107]": data?.severity === "warning",
                },
                {
                  "bg-[#FF9292]": data?.severity === "critical",
                },
                {
                  "text-brand-light": data?.severity,
                },
                {
                  "bg-brand-primary": data?.severity === "info",
                },
              )}
            >
              {data?.severity ? data?.severity.toUpperCase() : "NA"}
            </div>
          }
          isLoading={isLoading}
          className="col-span-6"
        />
        <InfoRow
          label="Alert Timestamp"
          className="col-span-6"
          textAlign="right"
          value={formatDate(data?.alertTimestamp)}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AlertCard;
