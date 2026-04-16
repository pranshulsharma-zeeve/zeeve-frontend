"use client";
import React from "react";
import dayjs from "dayjs";
import { useMonitorRpcStore } from "@/store/vizion/monitorRpc";
import Card from "@/components/vizion/card";
import { getLastIntervalDate } from "@/utils/helpers";

type PeriodicDates = {
  weekly: Date;
  monthly: Date;
  quarterly: Date;
};
const LogsCard = ({ className = "", createdAt }: { className?: string; createdAt?: string }) => {
  const monitor = useMonitorRpcStore((state) => state.monitorRpc);
  const dates: PeriodicDates = getLastIntervalDate(createdAt && createdAt.trim() !== "" ? createdAt : new Date());
  return (
    <Card
      className={`${className} bg-white font-semibold`}
      style={{
        // backgroundImage: `url('/assets/images/protocol/chaindatabg.svg')`,
        backgroundSize: "center",
        backgroundPosition: "bottom right",
        backgroundRepeat: "no-repeat",
      }}
      labelTwo={true}
    >
      {/* Chain Data */}
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 text-sm font-semibold text-black sm:grid-cols-2">
        <div className="border-b border-[#0000001A]">
          <span>DDoS Logs Analysed</span>
          <div className="flex justify-between text-xs font-normal text-[#696969]">
            <span>last scanned</span>
            <span>{dayjs(dates.monthly).format("DD MMM YYYY")}</span>
          </div>
        </div>
        <div className="border-b border-[#0000001A] pb-2">
          <span>Unauthorised Access Analysed</span>
          <div className="flex justify-between text-xs font-normal text-[#696969]">
            <span>last scanned</span>
            <span>{dayjs(dates.weekly).format("DD MMM YYYY")}</span>
          </div>
        </div>
        <div className="border-b border-[#0000001A]">
          <span>Software Upgrades/Updates</span>
          <div className="flex justify-between text-xs font-normal text-[#696969]">
            <span>last scanned</span>
            <span>
              {monitor?.data?.softwareUpdates
                ? (() => {
                    const parts = monitor.data.softwareUpdates.trim().split("/");
                    if (parts.length === 3) {
                      const [day, month, year] = parts;
                      const parsed = dayjs(`${year}-${month}-${day}`);
                      return parsed.isValid() ? parsed.format("DD MMM YYYY") : monitor.data.softwareUpdates;
                    }
                    return monitor.data.softwareUpdates;
                  })()
                : "NA"}
            </span>
          </div>
        </div>
        <div className="border-b border-[#0000001A] pb-2">
          <span>Security Package Updates</span>
          <div className="flex justify-between text-xs font-normal text-[#696969]">
            <span>last scanned</span>
            <span>{dayjs(dates.weekly).format("DD MMM YYYY")}</span>
          </div>
        </div>
        <div className="border-b border-[#0000001A] pb-2">
          <span>Malware Scan</span>
          <div className="flex justify-between text-xs font-normal text-[#696969]">
            <span>last scanned</span>
            <span>{dayjs(dates.weekly).format("DD MMM YYYY")}</span>
          </div>
        </div>
        <div className="border-b border-[#0000001A]">
          <span>Endpoint PEN Test</span>
          <div className="flex justify-between text-xs font-normal text-[#696969]">
            <span>last scanned</span>
            <span>{dayjs(dates.quarterly).format("DD MMM YYYY")}</span>
          </div>
        </div>
        <div className="border-b border-[#0000001A] pb-2">
          <span>Backup</span>
          <div className="flex justify-between text-xs font-normal text-[#696969]">
            <span>last scanned</span>
            <span>{dayjs(dates.weekly).format("DD MMM YYYY")}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LogsCard;
