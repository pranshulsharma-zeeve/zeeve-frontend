"use client";
import { useEffect, useRef, useState } from "react";
import { updateTime } from "@/utils/time";
import LogsComponent from "@/app/manage/nodes/full/[id]/_components/details/logs/logsComponent";
import usePlatformService from "@/services/platform/use-platform-service";
import { NodeDetailsResponse } from "@/services/platform/network/node-details";

interface NodeLogsProps {
  nodeDetails?: NodeDetailsResponse;
}

const Logs = ({ nodeDetails }: NodeLogsProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isAutoFetching, setIsAutoFetching] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState({
    endTime: new Date(),
    startTime: updateTime(new Date(), "MINUTE", -5),
  });
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<number>(5);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [canGoForward, setCanGoForward] = useState(false);

  const handleTimestamps = (eventType: "FORWARD" | "BACKWARD"): void => {
    switch (eventType) {
      case "FORWARD":
        const now = new Date();
        const newEnd = updateTime(queryParams.endTime, "MINUTE", selectedTimeFrame);
        setQueryParams({
          startTime: queryParams.endTime,
          endTime: newEnd > now ? now : newEnd, // if the endtime is more than the current time, use now as end time as we can't see future logs
        });
        break;
      case "BACKWARD":
        setQueryParams({
          startTime: updateTime(queryParams.startTime, "MINUTE", -1 * selectedTimeFrame),
          endTime: queryParams.startTime,
        });
        break;
      default:
        break;
    }
  };

  const {
    request: { data, isLoading },
  } = usePlatformService().logs.getNodeLogs({
    networkId: nodeDetails?.data?.node_id as string,
    agentId: nodeDetails?.data?.agent_id as string,
    serviceName: selectedService as string,
    ...queryParams,
  });

  const {
    request: { data: nodeServicesData, isLoading: isNodeServicesLoading },
  } = usePlatformService().logs.getNodeServices({
    networkId: nodeDetails?.data?.node_id as string,
    agentId: nodeDetails?.data?.agent_id as string,
  });

  useEffect(() => {
    // Enable forward only if endTime is before now
    // console.log(queryParams.endTime.getTime());
    const now = new Date();
    // console.log(now.getTime());
    setCanGoForward(queryParams.endTime.getTime() + 1000 < now.getTime());
  }, [queryParams]);

  useEffect(() => {
    setQueryParams({
      endTime: new Date(),
      startTime: updateTime(new Date(), "MINUTE", -1 * selectedTimeFrame),
    });
  }, [selectedService, selectedTimeFrame]);

  useEffect(() => {
    // Clear previous interval always
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (selectedService && isAutoFetching) {
      // Set new interval to fetch logs every minute
      intervalRef.current = setInterval(() => {
        const endTime = new Date();
        const startTime = updateTime(endTime, "MINUTE", -1 * selectedTimeFrame);
        setQueryParams({ startTime, endTime });
      }, 60000); // 1 minute
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAutoFetching, selectedService, selectedTimeFrame]);

  useEffect(() => {
    if (!isNodeServicesLoading && nodeServicesData?.data?.services?.length) {
      setSelectedService(nodeServicesData.data.services[0]);
    }
  }, [isNodeServicesLoading, nodeServicesData]);

  const dataN = {
    logs: [
      ["1757415499254603000", "Sep 09 10:58:19.254 NOTICE │ head is now 21634131, applied in 13.820ms"],
      ["1757415493306679000", "Sep 09 10:58:13.306 NOTICE │ head is now 21634130, applied in 66.744ms"],
      ["1757415492291234000", "Sep 09 10:58:12.290 NOTICE │ head is now 21634129, applied in 48.608ms"],
      ["1757415486307456000", "Sep 09 10:58:06.306 NOTICE │ head is now 21634128, applied in 79.952ms"],
      ["1757415481255659000", "Sep 09 10:58:01.255 NOTICE │ head is now 21634127, applied in 37.746ms"],
      ["1757415479273124000", "Sep 09 10:57:59.272 NOTICE │ head is now 21634126, applied in 54.081ms"],
      ["1757415473256196000", "Sep 09 10:57:53.255 NOTICE │ head is now 21634125, applied in 43.155ms"],
      ["1757415467272857000", "Sep 09 10:57:47.272 NOTICE │ head is now 21634124, applied in 68.487ms"],
      ["1757415461252586000", "Sep 09 10:57:41.252 NOTICE │ head is now 21634123, applied in 62.892ms"],
      ["1757415459239840000", "Sep 09 10:57:39.239 NOTICE │ head is now 21634122, applied in 56.414ms"],
      ["1757415453219636000", "Sep 09 10:57:33.219 NOTICE │ head is now 21634121, applied in 22.989ms"],
      ["1757415447217361000", "Sep 09 10:57:27.216 NOTICE │ head is now 21634120, applied in 44.595ms"],
      ["1757415441761736000", "Sep 09 10:57:21.761 NOTICE │ head is now 21634119, applied in 84.386ms"],
      ["1757415439190343000", "Sep 09 10:57:19.190 NOTICE │ head is now 21634118, applied in 38.014ms"],
      ["1757415433209868000", "Sep 09 10:57:13.209 NOTICE │ head is now 21634117, applied in 64.483ms"],
      ["1757415427197939000", "Sep 09 10:57:07.197 NOTICE │ head is now 21634116, applied in 64.312ms"],
      ["1757415422006946000", "Sep 09 10:57:02.006 NOTICE │ head is now 21634115, applied in 363ms"],
      ["1757415421178578000", "Sep 09 10:57:01.178 NOTICE │ head is now 21634114, applied in 58.988ms"],
      ["1757415415191436000", "Sep 09 10:56:55.191 NOTICE │ head is now 21634113, applied in 66.187ms"],
      ["1757415409671307000", "Sep 09 10:56:49.670 NOTICE │ head is now 21634112, applied in 66.605ms"],
      ["1757415407167557000", "Sep 09 10:56:47.167 NOTICE │ head is now 21634111, applied in 59.589ms"],
      ["1757415401664579000", "Sep 09 10:56:41.664 NOTICE │ head is now 21634110, applied in 66.010ms"],
      ["1757415399151616000", "Sep 09 10:56:39.151 NOTICE │ head is now 21634109, applied in 52.894ms"],
      ["1757415393140240000", "Sep 09 10:56:33.139 NOTICE │ head is now 21634108, applied in 42.801ms"],
      ["1757415387128916000", "Sep 09 10:56:27.128 NOTICE │ head is now 21634107, applied in 57.002ms"],
      ["1757415381669704000", "Sep 09 10:56:21.669 NOTICE │ head is now 21634106, applied in 93.725ms"],
      ["1757415378076515000", "Sep 09 10:56:18.076 NOTICE │ head is now 21634105, applied in 30.128ms"],
      ["1757415372632315000", "Sep 09 10:56:12.632 NOTICE │ head is now 21634104, applied in 68.072ms"],
      ["1757415366571790000", "Sep 09 10:56:06.571 NOTICE │ head is now 21634103, applied in 21.162ms"],
      ["1757415361131923000", "Sep 09 10:56:01.131 NOTICE │ head is now 21634102, applied in 89.214ms"],
      ["1757415358558541000", "Sep 09 10:55:58.558 NOTICE │ head is now 21634101, applied in 35.554ms"],
      ["1757415352581453000", "Sep 09 10:55:52.581 NOTICE │ head is now 21634100, applied in 32.439ms"],
      ["1757415346574651000", "Sep 09 10:55:46.574 NOTICE │ head is now 21634099, applied in 51.012ms"],
      ["1757415341047169000", "Sep 09 10:55:41.046 NOTICE │ head is now 21634098, applied in 41.749ms"],
      ["1757415339530656000", "Sep 09 10:55:39.530 NOTICE │ head is now 21634097, applied in 16.745ms"],
      ["1757415333539060000", "Sep 09 10:55:33.538 NOTICE │ head is now 21634096, applied in 49.442ms"],
      ["1757415327511538000", "Sep 09 10:55:27.511 NOTICE │ head is now 21634095, applied in 30.733ms"],
      ["1757415321545603000", "Sep 09 10:55:21.545 NOTICE │ head is now 21634094, applied in 69.799ms"],
      ["1757415318483153000", "Sep 09 10:55:18.482 NOTICE │ head is now 21634093, applied in 19.044ms"],
      ["1757415312482855000", "Sep 09 10:55:12.482 NOTICE │ head is now 21634092, applied in 24.188ms"],
      ["1757415306477957000", "Sep 09 10:55:06.477 NOTICE │ head is now 21634091, applied in 19.353ms"],
      ["1757415301027339000", "Sep 09 10:55:01.027 NOTICE │ head is now 21634090, applied in 65.336ms"],
      ["1757415299468734000", "Sep 09 10:54:59.468 NOTICE │ head is now 21634089, applied in 19.615ms"],
      ["1757415293481743000", "Sep 09 10:54:53.481 NOTICE │ head is now 21634088, applied in 42.056ms"],
      ["1757415287458675000", "Sep 09 10:54:47.458 NOTICE │ head is now 21634087, applied in 45.035ms"],
      ["1757415281455581000", "Sep 09 10:54:41.455 NOTICE │ head is now 21634086, applied in 36.258ms"],
      ["1757415279463695000", "Sep 09 10:54:39.463 NOTICE │ head is now 21634085, applied in 59.579ms"],
      ["1757415273453823000", "Sep 09 10:54:33.453 NOTICE │ head is now 21634084, applied in 50.329ms"],
      ["1757415267497157000", "Sep 09 10:54:27.496 NOTICE │ head is now 21634083, applied in 47.090ms"],
      ["1757415261458344000", "Sep 09 10:54:21.457 NOTICE │ head is now 21634082, applied in 65.823ms"],
    ],
  };

  return (
    <div className="col-span-10 rounded-2xl border p-3 lg:p-6 lg:pt-2">
      <LogsComponent
        logs={data?.data?.logs[0]?.values || []}
        isAutoFetching={isAutoFetching}
        setIsAutoFetching={setIsAutoFetching}
        selectedTimeFrame={selectedTimeFrame}
        setSelectedTimeFrame={setSelectedTimeFrame}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        services={nodeServicesData?.data?.services}
        setQueryParams={setQueryParams}
        canGoForward={canGoForward}
        isLoading={isLoading}
        isNodeServicesLoading={isNodeServicesLoading}
        onNewLogsClick={() => handleTimestamps("FORWARD")}
        onOldLogsClick={() => handleTimestamps("BACKWARD")}
      />
    </div>
  );
};

export default Logs;
