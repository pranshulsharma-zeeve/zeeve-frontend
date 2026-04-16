import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  getOpStackDemoHost,
  getOpStackDemoVizionToken,
  getOpStackDemoVizionUrl,
  isOpStackDemoNetwork,
} from "../demo-vizion";
import Alerts from "./alerts";

import HTTP_STATUS from "@/constants/http";
import { getCookie } from "@/utils/cookies";
import { withBasePath } from "@/utils/helpers";
import CardTable from "@/components/vizion/card-table";
import useVisionService from "@/services/vision/use-vision-service";
import { useVisionUserStore } from "@/store/vizionUser";
import ROUTES from "@/routes";

interface AlertsCardProps {
  className?: string;
  recordsPerPage?: number;
  headerFontSize?: string;
  rowFontSize?: string;
  rowPadding?: string;
  headerPadding?: string;
}

interface AlertProps {
  eventid: string;
  name: string;
  severity: string;
  acknowledged: string;
  clock: string;
  opdata?: string;
  status: string;
}

const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

const parseAlertClock = (clock: string): number | null => {
  if (!clock) {
    return null;
  }
  const numericValue = Number(clock);
  if (!Number.isNaN(numericValue)) {
    return numericValue < 1e12 ? numericValue * 1000 : numericValue;
  }
  const parsed = Date.parse(clock);
  return Number.isNaN(parsed) ? null : parsed;
};

const filterRecentAlerts = (alerts: AlertProps[]) => {
  const cutoff = Date.now() - FIFTEEN_DAYS_MS;
  return alerts.filter((alert) => {
    const timestamp = parseAlertClock(alert.clock);
    return timestamp !== null && timestamp >= cutoff;
  });
};

const AlertsCard = ({
  className,
  recordsPerPage = 3,
  headerFontSize = "text-xs",
  rowFontSize = "text-xs",
  rowPadding = "px-2 py-2",
  headerPadding = "px-2 py-2",
}: AlertsCardProps) => {
  const { id } = useParams();
  const networkId = id as string;
  const isDemoNetwork = isOpStackDemoNetwork(networkId);
  const { request: alertsRequest, url: alertsUrlConfig } = useVisionService().mainPage.alerts();
  const alertsUrl = isDemoNetwork ? getOpStackDemoVizionUrl(ROUTES.VISION.API.ALERTS) : alertsUrlConfig;
  const [isLoading, setIsLoading] = useState(true);
  const [alertData, setAlertData] = useState<AlertProps[]>([]);
  const [alertDataNew, setAlertDataNew] = useState<AlertProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AlertProps;
    direction: string;
  } | null>(null);

  const user = useVisionUserStore((state) => state.visionUser);
  const token = isDemoNetwork ? getOpStackDemoVizionToken() : (user?.token ?? getCookie("token"));

  const selectedHost = useMemo(() => {
    if (isDemoNetwork) {
      return getOpStackDemoHost();
    }
    if (!user?.hostData || user.hostData.length === 0) {
      return null;
    }
    return user.hostData.find((host) => host.networkId === networkId) ?? user.hostData[0];
  }, [isDemoNetwork, user?.hostData, networkId]);

  const fetchAlertsData = useCallback(async () => {
    if (!selectedHost || !token) {
      return;
    }
    setIsLoading(true);
    try {
      const { hostIds, primaryHost } = selectedHost;
      const data = await alertsRequest(
        alertsUrl,
        { hostIds, primaryHost },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (data.status === HTTP_STATUS.OK && Array.isArray(data.data.data)) {
        const filteredAlerts = filterRecentAlerts(data.data.data);
        setAlertData(filteredAlerts);
        setAlertDataNew(filteredAlerts);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error fetching rollup data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [alertsRequest, alertsUrl, selectedHost, token]);

  // useEffect(() => {
  //   if (!selectedHost || !token) {
  //     return;
  //   }
  //   void fetchAlertsData();
  //   const interval = setInterval(() => {
  //     void fetchAlertsData();
  //   }, isRefreshInterval);

  //   return () => clearInterval(interval);
  // }, [fetchAlertsData, isRefreshInterval, selectedHost, token]);

  useEffect(() => {
    void fetchAlertsData();
  }, [fetchAlertsData]);

  const sortData = (key: keyof AlertProps) => {
    let direction = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...alertDataNew].sort((a, b) => {
      const valueA = a[key] ?? ""; // Default to an empty string (or another appropriate default)
      const valueB = b[key] ?? "";

      if (valueA < valueB) return direction === "asc" ? -1 : 1;
      if (valueA > valueB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setAlertDataNew(sortedData);
  };

  const totalPages = Math.ceil(alertData.length / recordsPerPage);
  const currentData = alertDataNew.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);
  const updateData = (filter: string) => {
    if (filter === "0") {
      setAlertDataNew(alertData);
    } else {
      const filteredData = alertData.filter((alert) => alert.severity === filter);
      setAlertDataNew(filteredData);
    }
  };

  return (
    <CardTable
      isLoading={isLoading}
      className={`${className} font-medium lg:pb-0`}
      title="Alerts"
      updateData={updateData}
    >
      {/* Desktop View - Original Design */}
      <div className="hidden overflow-x-auto md:block">
        {isLoading ? (
          <div className="py-4 text-center">Loading...</div>
        ) : (
          <div className="w-full overflow-hidden rounded-lg border border-[#E1E1E1]">
            <table className="w-full">
              <thead className="w-full text-left">
                <tr className={`${headerFontSize} font-normal text-[#09122D]`}>
                  {[
                    { key: "eventid", label: "Alert ID" },
                    { key: "name", label: "Alert Name" },
                    { key: "status", label: "Status" },
                    { key: "severity", label: "Severity" },
                    { key: "clock", label: "Alert Timestamp", alignRight: true },
                  ].map(({ key, label, alignRight }) => (
                    <th
                      key={key}
                      className={`w-1/6 cursor-pointer ${headerPadding} font-normal ${alignRight ? "text-right" : "text-left"}`}
                      onClick={() => sortData(key as keyof AlertProps)}
                    >
                      <div className={`flex items-center space-x-1 ${alignRight ? "justify-end" : ""}`}>
                        <span>{label}</span>
                        {sortConfig?.key === key ? (
                          sortConfig.direction === "asc" ? (
                            <Image
                              src={withBasePath(`/assets/images/protocol/up.svg`)}
                              onError={(e) => (e.currentTarget.src = withBasePath("/assets/images/protocol/up.svg"))}
                              alt="up"
                              width={10}
                              height={10}
                            />
                          ) : (
                            <Image
                              src={withBasePath(`/assets/images/protocol/down.svg`)}
                              onError={(e) => (e.currentTarget.src = withBasePath("/assets/images/protocol/down.svg"))}
                              alt="down"
                              width={10}
                              height={10}
                            />
                          )
                        ) : (
                          <Image
                            src={withBasePath(`/assets/images/protocol/up.svg`)}
                            onError={(e) => (e.currentTarget.src = withBasePath("/assets/images/protocol/up.svg"))}
                            alt="up"
                            width={10}
                            height={10}
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-normal">
                {currentData.length > 0 ? (
                  currentData.map((obj, index) => (
                    <Alerts key={index} {...obj} rowFontSize={rowFontSize} rowPadding={rowPadding} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-[#09122D]">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile View - Card Layout */}
      <div className="block md:hidden">
        {isLoading ? (
          <div className="py-4 text-center">Loading...</div>
        ) : currentData.length > 0 ? (
          <div className="space-y-3">
            {currentData.map((obj, index) => (
              <div key={index} className="rounded-lg border border-[#E1E1E1] bg-white p-3">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Alert ID</p>
                    <p className="truncate text-sm font-normal text-[#09122D]">{obj.eventid}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Alert Name</p>
                    <p className="line-clamp-2 text-sm font-normal text-[#09122D]">{obj.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium text-slate-500">Status</p>
                      <p className="text-sm font-normal text-[#09122D]">{obj.status.toLocaleUpperCase() || "NA"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Severity</p>
                      <div className="mt-1">
                        <Alerts {...obj} rowFontSize="text-xs" rowPadding="p-0" isMobileCard={true} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Alert Timestamp</p>
                    <p className="text-sm font-normal text-[#09122D]">{obj.clock}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-[#09122D]">No data available</div>
        )}
      </div>

      {/* Desktop Pagination - Original Design */}
      <div className="mb-4 mt-6 hidden w-full justify-end px-4 text-xs font-normal text-[#09122D] md:flex">
        <div className="flex items-center rounded-md border border-[#E1E1E1] bg-[#F5F5F5]">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || alertDataNew.length === 0}
            className={`border-r border-[#E1E1E1] px-2 py-1 font-normal ${
              currentPage === 1 || alertDataNew.length === 0
                ? "cursor-not-allowed text-[#9E9E9E] opacity-50"
                : "text-[#09122D]"
            }`}
          >
            Previous
          </button>

          {/* Page Numbers (Only 3 pages shown at a time) */}
          {[...Array(3)].map((_, index) => {
            const pageNumber = Math.max(1, currentPage - 1) + index;
            if (pageNumber > totalPages) return null;

            return (
              <button
                key={index}
                onClick={() => setCurrentPage(pageNumber)}
                disabled={alertDataNew.length === 0}
                className={`border-r border-[#E1E1E1] px-2 py-1 ${
                  currentPage === pageNumber ? "bg-[#0DCAF0] text-black" : "text-[#09122D]"
                } ${alertDataNew.length === 0 ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || alertDataNew.length === 0}
            className={`border-r border-[#E1E1E1] px-2 py-1 font-normal ${
              currentPage === totalPages || alertDataNew.length === 0
                ? "cursor-not-allowed text-[#9E9E9E] opacity-50"
                : "text-[#09122D]"
            }`}
          >
            Next
          </button>
        </div>
        <div className="ml-4 flex items-center space-x-2 font-normal text-[#09122D]">
          <span>Entries Per Page</span>
          <div className="flex items-center rounded-md border border-[#E1E1E1] bg-[#F5F5F5] px-3 py-1">
            <p className="text-xs">{currentData.length}</p>
          </div>
        </div>
      </div>

      {/* Mobile Pagination */}
      <div className="mb-4 mt-6 block md:hidden">
        <div className="flex flex-col gap-4 px-2 text-xs font-normal text-[#09122D]">
          <div className="flex items-center justify-center overflow-x-auto rounded-md border border-[#E1E1E1] bg-[#F5F5F5]">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || alertDataNew.length === 0}
              className={`border-r border-[#E1E1E1] px-2 py-1 text-xs font-normal ${
                currentPage === 1 || alertDataNew.length === 0
                  ? "cursor-not-allowed text-[#9E9E9E] opacity-50"
                  : "text-[#09122D]"
              }`}
            >
              Prev
            </button>

            {/* Page Numbers */}
            {[...Array(Math.min(3, totalPages))].map((_, index) => {
              const pageNumber = Math.max(1, currentPage - 1) + index;
              if (pageNumber > totalPages) return null;

              return (
                <button
                  key={index}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`border-r border-[#E1E1E1] px-2 py-1 text-xs ${
                    currentPage === pageNumber ? "bg-[#0DCAF0] text-black" : "text-[#09122D]"
                  } ${alertDataNew.length === 0 ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || alertDataNew.length === 0}
              className={`px-2 py-1 text-xs font-normal ${
                currentPage === totalPages || alertDataNew.length === 0
                  ? "cursor-not-allowed text-[#9E9E9E] opacity-50"
                  : "text-[#09122D]"
              }`}
            >
              Next
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 font-normal text-[#09122D]">
            <span className="text-xs">Entries Per Page</span>
            <div className="flex items-center rounded-md border border-[#E1E1E1] bg-[#F5F5F5] px-3 py-1">
              <p className="text-xs">{currentData.length}</p>
            </div>
          </div>
        </div>
      </div>
    </CardTable>
  );
};

export default AlertsCard;
