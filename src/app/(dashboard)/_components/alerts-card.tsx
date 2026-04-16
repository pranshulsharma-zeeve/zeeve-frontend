import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import moment from "moment";

import CardTable from "@/components/vizion/card-table";
import HTTP_STATUS from "@/constants/http";
import { getCookie } from "@/utils/cookies";
import { withBasePath } from "@/utils/helpers";
import usePlatformService from "@/services/platform/use-platform-service";
import { useVisionUserStore } from "@/store/vizionUser";
import { filterAlertsWithinDays } from "@/utils/alerts";
import Alerts from "@/app/manage/nodes/validator/[id]/_components/infrastructure-dashboard/alerts/alerts";

interface AlertsCardProps {
  className?: string;
}

interface AlertProps {
  eventid: string;
  name: string;
  severity: string;
  acknowledged: string;
  acknowledgedStatus?: string;
  clock: string;
  opdata?: string;
  status: string;
}

const normalizeAlertClock = (clock: string) => {
  if (!clock) return clock;

  const numericClock = Number(clock);
  if (!Number.isNaN(numericClock)) {
    const asMoment = clock.length <= 10 ? moment.unix(numericClock) : moment(numericClock);
    if (asMoment.isValid()) {
      return asMoment.format("M/D/YYYY, hh:mm:ss A");
    }
  }

  return clock;
};

const AlertsRpcCard = ({ className }: AlertsCardProps) => {
  const recordsPerPage = 5;
  const { request: historicalAlertsRequest, url: historicalAlertsUrl } = usePlatformService().alerts.historical();
  const params = useParams();
  const networkId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [alertData, setAlertData] = useState<AlertProps[]>([]);
  const [alertDataNew, setAlertDataNew] = useState<AlertProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const vizionUser = useVisionUserStore((state) => state.visionUser);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AlertProps;
    direction: string;
  } | null>(null);

  const token = vizionUser?.token ?? getCookie("token");

  const fetchAlertsData = async () => {
    try {
      if (!vizionUser) {
        console.warn("[AlertsRpcCard] Missing vizion user context, aborting fetch.", { networkId });
        setIsLoading(false);
        return;
      }
      const hostList = Array.isArray(vizionUser.hostData) ? vizionUser.hostData : [];
      if (!hostList.length) {
        console.warn("[AlertsRpcCard] vizion user has no host data", { vizionUser, networkId });
      }
      const hostIds = hostList
        .map((host) => host?.primaryHost || host?.hasLB)
        .filter((id): id is string => Boolean(id) && id !== "no");

      if (!hostIds.length) {
        console.warn("[AlertsRpcCard] No host identifiers derived from vizion user", { vizionUser, networkId });
        setIsLoading(false);
        return;
      }

      const response = await historicalAlertsRequest(
        historicalAlertsUrl,
        { hostIds, range: "7d", currentTime: new Date().toISOString() },
        {
          headers: {
            Authorization: `Bearer ${vizionUser?.token ?? token ?? ""}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === HTTP_STATUS.OK) {
        let alertsArray: AlertProps[] = [];

        // Handle both array format and object format (grouped by hostId)
        if (Array.isArray(response?.data?.data)) {
          alertsArray = response.data.data;
        } else if (typeof response?.data?.data === "object" && response?.data?.data !== null) {
          // Flatten object format: { hostId: [...alerts], hostId2: [...alerts] }
          alertsArray = Object.values(response.data.data).flat();
        }

        if (alertsArray.length > 0) {
          const normalizedAlerts = alertsArray.map((alert) => ({
            ...alert,
            status:
              alert.status ??
              alert.acknowledgedStatus ??
              (alert.acknowledged === "1" ? "Acknowledged" : "Not Acknowledged"),
            clock: normalizeAlertClock(alert.clock),
          }));

          const filteredAlerts = filterAlertsWithinDays(normalizedAlerts);
          setAlertData(filteredAlerts);
          setAlertDataNew(filteredAlerts);
          setCurrentPage(1);
        } else {
          console.warn("[AlertsRpcCard] No alerts received from API");
        }
      } else {
        console.error("Error fetching alerts:", response?.status);
      }
    } catch (error) {
      console.error("Error fetching rollup data:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
  const hasAlerts = alertData.length > 0;
  const updateData = (filter: string) => {
    if (filter === "0") {
      setAlertDataNew(alertData);
    } else {
      const filteredData = alertData.filter((alert) => alert.severity === filter);
      setAlertDataNew(filteredData);
    }
  };

  useEffect(() => {
    fetchAlertsData();
  }, []);

  return (
    <CardTable
      isLoading={isLoading}
      className={`${className}col-span-10 text-sm font-medium text-[#0E2B6E]`}
      title={<span className="text-sm font-medium text-[#0E2B6E] dark:text-white">Alerts</span>}
      updateData={updateData}
    >
      <div className="overflow-x-auto rounded-xl border border-[#E1E1E1] bg-[#FFFFFF99]">
        {isLoading ? (
          <div className="py-4 text-center text-[#696969]">Loading...</div>
        ) : hasAlerts ? (
          <>
            <table className="w-full">
              <thead className="w-full text-left font-normal">
                <tr className="text-xs text-[#696969]">
                  {[
                    { key: "eventid", label: "Alert ID" },
                    { key: "name", label: "Alert Name" },
                    { key: "status", label: "Alert Type" },
                    { key: "severity", label: "Severity" },
                    { key: "clock", label: "Alert Timestamp", alignRight: true },
                  ].map(({ key, label, alignRight }) => (
                    <th
                      key={key}
                      className={`w-1/6 cursor-pointer p-4 font-normal ${alignRight ? "text-right" : "text-left"}`}
                      onClick={() => sortData(key as keyof AlertProps)}
                    >
                      <div className={`flex items-center space-x-1 ${alignRight ? "justify-end" : ""}`}>
                        <span>{label}</span>
                        {sortConfig?.key === key ? (
                          sortConfig.direction === "asc" ? (
                            <Image
                              src={withBasePath(`/assets/images/vizion/up.svg`)}
                              onError={(e) => (e.currentTarget.src = withBasePath("/assets/images/up.svg"))}
                              alt="up"
                              width={10}
                              height={10}
                            />
                          ) : (
                            <Image
                              src={withBasePath(`/assets/images/vizion/down.svg`)}
                              onError={(e) => (e.currentTarget.src = withBasePath("/assets/images/down.svg"))}
                              alt="down"
                              width={10}
                              height={10}
                            />
                          )
                        ) : (
                          <Image
                            src={withBasePath(`/assets/images/vizion/up.svg`)}
                            onError={(e) => (e.currentTarget.src = withBasePath("/assets/images/up.svg"))}
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
              <tbody className="text-sm font-normal">
                {currentData.length > 0 ? (
                  currentData.map((obj, index) => (
                    <Alerts
                      key={index}
                      {...obj}
                      className="[&>td:first-child]:border-l-[16px] [&>td:first-child]:border-l-transparent [&>td:first-child]:pl-4 [&>td:last-child]:border-r-[16px] [&>td:last-child]:border-r-transparent [&>td:last-child]:pr-4 [&>td]:border-t [&>td]:border-[#E2F1FF]"
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#09122D]">
                      No matching alerts found for the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination section now inside the same container */}
            <div className="flex w-full justify-end border-[#E1E1E1] p-4 text-xs">
              <div className="flex items-center rounded-[4px] border border-[#0000001A] text-[#696969]">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="border-r border-[#0000001A] p-2 font-normal disabled:opacity-50"
                >
                  Previous
                </button>

                {[...Array(3)].map((_, index) => {
                  const pageNumber = Math.max(1, currentPage - 1) + index;
                  if (pageNumber > totalPages) return null;

                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`border-r border-[#0000001A] p-2 ${
                        currentPage === pageNumber ? "bg-[#4054B2] text-white" : "text-[#AEB9E1]"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 font-normal disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="ml-4 flex items-center space-x-2">
                <span className="font-normal text-[#696969]">Entries Per Page</span>
                <div className="flex items-center rounded-[3px] border border-[#0000001A] px-2 py-1">
                  <p className="text-sm font-normal text-[#696969]">{currentData.length}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-6 rounded-xl bg-[#EEF2FF] p-6 text-[#0E2B6E] md:flex-row md:items-center md:justify-between">
            <div className="max-w-md space-y-2">
              <p className="text-base font-bold text-[#0E2B6E]">Nothing running yet</p>
              <p className="text-xs font-normal text-[#53607F]">
                Once you deploy a service, it will appear here. We&apos;ll help you every step of the way.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src={withBasePath(`/assets/images/vizion/no-alerts.svg`)}
                width={180}
                height={150}
                alt="No alerts illustration"
                priority
              />
            </div>
          </div>
        )}
      </div>
    </CardTable>
  );
};

export default AlertsRpcCard;
