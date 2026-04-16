import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import Alerts from "./alerts";
import CardTable from "@/components/vizion/card-table";
import HTTP_STATUS from "@/constants/http";
import { getCookie } from "@/utils/cookies";
import { withBasePath } from "@/utils/helpers";
import usePlatformService from "@/services/platform/use-platform-service";
import { useVisionUserStore } from "@/store/vizionUser";
import { filterAlertsWithinDays } from "@/utils/alerts";

interface AlertsCardProps {
  className?: string;
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

interface AlertsApiResponse {
  success: boolean;
  data: AlertProps[];
}

const AlertsRpcCard = ({ className }: AlertsCardProps) => {
  const recordsPerPage = 5;
  const { request: alertsRequest, url: alertsUrl } = usePlatformService().vizion.alerts();
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
      const coreumHost = hostList.find((host) => host.networkId === networkId);
      if (!coreumHost) {
        console.warn("[AlertsRpcCard] No host entry matched network", { networkId, hostList });
      }
      const coreumPrimaryHost = coreumHost?.primaryHost;
      const coreumHostIds = coreumHost?.hostIds;
      const hostIds = coreumHostIds ?? [];
      const primaryHost = coreumPrimaryHost ?? "";
      console.log("[AlertsRpcCard] fetching alerts", {
        networkId,
        hostIdsLength: hostIds.length,
        primaryHost,
      });
      const response = await axios.post<AlertsApiResponse>(
        alertsUrl,
        { hostIds, primaryHost },
        {
          headers: {
            Authorization: `Bearer ${vizionUser?.token ?? token ?? ""}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === HTTP_STATUS.OK && Array.isArray(response.data.data)) {
        const filteredAlerts = filterAlertsWithinDays(response.data.data);
        setAlertData(filteredAlerts);
        setAlertDataNew(filteredAlerts);
        setCurrentPage(1);
      } else {
        console.error("Data is not in the expected array format.");
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
      className={`${className} col-span-10 border border-[#E1E1E1] bg-white text-xl font-medium text-[#09122D]`}
      title="Alerts"
      updateData={updateData}
    >
      <div className={`overflow-x-auto rounded-lg border border-[#E1E1E1]`}>
        {isLoading ? (
          <div className="py-4 text-center text-white">Loading...</div>
        ) : (
          <table className={`w-full `}>
            <thead className="w-full text-left font-normal">
              <tr className={`text-xs text-[#696969]`}>
                {[
                  { key: "eventid", label: "Alert ID" },
                  { key: "name", label: "Alert Name" },
                  { key: "status", label: "Alert Type" },
                  { key: "severity", label: "Severity" },
                  { key: "clock", label: "Alert Timestamp", alignRight: true }, // Added alignment flag
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
            <tbody className="text-sm  font-normal">
              {currentData.length > 0 ? (
                currentData.map((obj, index) => <Alerts key={index} {...obj} />)
              ) : (
                <tr>
                  <td colSpan={6} className={` text-center text-[#09122D] `}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <div className="mb-4 mt-6 flex w-full justify-end px-4 text-xs">
        <div className={`flex items-center rounded-[4px] border border-[#0000001A] text-[#696969]`}>
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="border-r border-[#0000001A] p-2 font-normal disabled:opacity-50"
          >
            Previous
          </button>

          {/* Page Numbers (Only 3 pages shown at a time) */}
          {[...Array(3)].map((_, index) => {
            const pageNumber = Math.max(1, currentPage - 1) + index;
            if (pageNumber > totalPages) return null; // Prevent exceeding total pages

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

          {/* Next Button */}
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
          <div className={`flex items-center rounded-[3px] border border-[#0000001A] px-2 py-1`}>
            <p className="text-sm font-normal text-[#696969]">{currentData.length}</p>
          </div>
        </div>
      </div>
    </CardTable>
  );
};

export default AlertsRpcCard;
