"use client";
import { useParams } from "next/navigation";
import { Heading, Skeleton, tx } from "@zeeve-platform/ui";
import { useCallback, useEffect, useState } from "react";
import usePolygonValidiumService from "@/services/polygon-validium/use-polygon-validium-service";
import useOASService from "@/services/oas/use-oas-service";
import { useSuperNetStore } from "@/store/super-net";
import HTTP_STATUS from "@/constants/http";

const Health = () => {
  const [health, setHealth] = useState<{ healthStatus?: boolean; numOfFiringAlerts?: number }>();
  const [isLoading, setIsLoading] = useState(true);

  // calling oas api direct for health
  const { request, url } = useOASService().alert.list();
  const superNetInfo = useSuperNetStore((state) => state.superNetInfo);

  const alertList = useCallback(async () => {
    try {
      setIsLoading(true);
      if (superNetInfo.data?.agentId) {
        const response = await request(url, {
          filter: [
            { fieldName: "agentId", compare: "equal", val: superNetInfo.data?.agentId },
            {
              fieldName: "status",
              val: "firing",
              compare: "equal",
            },
          ],
          sort: [{ fieldName: "alertTimestamp", orderBy: "desc" }],
          meta: {
            pageNum: 1,
            numRecords: 10,
          },
        });

        if (response.status === HTTP_STATUS.OK && response.data.success) {
          if (response?.data?.data?.meta) {
            setHealth({
              healthStatus: response?.data?.data?.meta.totalNumRecords === 0,
              numOfFiringAlerts: response?.data?.data?.meta.totalNumRecords,
            });
          }
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching alert list");
    } finally {
      setIsLoading(false);
    }
  }, [request, superNetInfo.data?.agentId, url]);

  useEffect(() => {
    alertList();
  }, [alertList]);

  return (
    <div className="col-span-12 flex h-[8.3rem] flex-col rounded-lg border bg-brand-primary p-7 text-center md:col-span-6 lg:col-span-12">
      {isLoading ? (
        <Skeleton role="status" as="div" className="max-w-sm">
          <div className="mx-auto mb-9 mt-2.5 h-4 max-w-[150px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="mx-auto mb-2.5 h-2.5 max-w-[100px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </Skeleton>
      ) : (
        <>
          {typeof health?.healthStatus === "boolean" ? (
            health.healthStatus ? (
              <div className="mt-2.5 flex items-baseline justify-center">
                <div className="relative mr-1 flex size-3">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-green opacity-75"></span>
                  <span className="relative inline-flex size-3 rounded-full bg-brand-green"></span>
                </div>
                <Heading className="h-12 font-extrabold text-brand-light" as="h5">
                  HEALTHY
                </Heading>
              </div>
            ) : (
              <>
                <div className="mt-2.5 flex items-baseline justify-center">
                  <div className="relative mr-1 flex size-3">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-red opacity-75"></span>
                    <span className="relative inline-flex size-3 rounded-full bg-brand-red"></span>
                  </div>
                  <Heading
                    className={tx("font-extrabold text-brand-light", {
                      "h-12": !health.numOfFiringAlerts,
                    })}
                    as="h5"
                  >
                    UNHEALTHY
                  </Heading>
                </div>
                {health?.numOfFiringAlerts && health?.numOfFiringAlerts > 0 && (
                  <div className="mb-2.5 text-xs text-brand-light ">
                    {health.numOfFiringAlerts} {health?.numOfFiringAlerts > 1 ? "ALERTS" : "ALERT"} FIRING
                  </div>
                )}
              </>
            )
          ) : (
            <div className="mt-2.5 flex items-baseline justify-center">
              <Heading className="h-12 font-extrabold text-brand-light" as="h5">
                NA
              </Heading>
            </div>
          )}
          <p className="text-sm text-brand-light">Network Health</p>
        </>
      )}
    </div>
  );
};

export default Health;
