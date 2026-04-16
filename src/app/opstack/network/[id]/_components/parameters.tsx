"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { formatNumber, toCapitalize, withBasePath } from "@orbit/utils/helpers";
import { useNetworkStore } from "@orbit/store/network";
import useOpStackService from "@orbit/services/arbitrum-orbit/use-arbitrum-orbit-service";
import { getNetworkStatus } from "@orbit/utils/network-overview";

interface ParametersProps {
  chain?: "l3";
  colorScheme?: "dark" | "primary";
}

interface HealthState {
  status: "healthy" | "unhealthy" | "NA";
  colorClass: string;
}

const Parameters: React.FC<ParametersProps> = ({ colorScheme = "primary", chain }) => {
  const params = useParams();
  const networkId = params.id as string;

  const [health, setHealth] = useState<HealthState>({
    status: "NA",
    colorClass: "text-brand-light",
  });

  const {
    request: { data, isLoading },
  } = useOpStackService().network.blockNumber(networkId);

  const networkInfo = useNetworkStore((state) => state.networkInfo);

  const networkStatus = getNetworkStatus(networkInfo.data);

  useEffect(() => {
    if (data?.data?.blockHeight && networkStatus === "ready") {
      setHealth({
        status: "healthy",
        colorClass: "#2ec589",
      });
    } else if (networkStatus === "ready") {
      setHealth({
        status: "unhealthy",
        colorClass: "#c12c2c",
      });
    } else {
      setHealth({
        status: "NA",
        colorClass: "#f8fafa",
      });
    }
  }, [data?.data?.blockHeight, networkStatus]);

  const textClass = colorScheme === "dark" ? "text-[#F8FAFC]" : "text-white";
  const blockHeight =
    typeof data?.data?.blockHeight === "string" && !isLoading
      ? formatNumber(parseInt(data.data.blockHeight), "standard")
      : isLoading
        ? "Loading..."
        : "NA";

  return (
    <div className="col-span-12 flex flex-col xl:col-span-4 2xl:col-span-2">
      <div className="flex h-full flex-row justify-between space-y-4 rounded-xl p-6 shadow-lg bg-mainnet-gradient xl:flex-col">
        {/* Content */}
        <div>
          <p className={`font-bold ${textClass}`}>{blockHeight}</p>
          <p
            className={`mb-4 text-sm font-medium ${textClass}`}
          >{`${chain ? `${toCapitalize(chain)} ` : ""}Block Height`}</p>

          <p className={`font-bold ${textClass}`}>
            <div className="flex flex-row items-center justify-start">
              {(health.status === "healthy" || health.status === "unhealthy") && (
                <svg className="relative mr-1 size-3" viewBox="0 0 12 12" fill="none">
                  {/* Pulsing Effect */}
                  <circle className="animate-ping" cx="6" cy="6" r="5" fillOpacity="0.5" />
                  {/* Solid Circle */}
                  <circle cx="6" cy="6" r="3" fill={health.colorClass} />
                </svg>
              )}
              {toCapitalize(health.status, "all")}
            </div>
          </p>
          <p className={`text-sm font-medium ${textClass}`}>{`${chain ? `${toCapitalize(chain)} ` : ""}Health`}</p>
        </div>

        {/* Image at Bottom */}
        <div className="flex items-end justify-end sm:justify-start xl:justify-end">
          <Image
            src={withBasePath(`/assets/images/protocol/node-health.svg`)}
            alt="Node health"
            width={150}
            height={150}
            className="size-[150px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Parameters;
