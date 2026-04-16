"use client";
import React, { useEffect, useState } from "react";
import { Heading } from "@zeeve-platform/ui";
import { OVERVIEW_INFO } from "@orbit/types/overview";
import Z4NetworkNodeStatus from "@orbit/components/z4-network-node-status";
import InfoRow from "@orbit/components/info-row";
import { toShortString } from "@orbit/utils/helpers";
import { getNetworkStatus, getRpcNodeInfo } from "@orbit/utils/network-overview";

type GeneralProps = {
  data: OVERVIEW_INFO | undefined;
  isLoading: boolean;
};

const NodesOverview = ({ data, isLoading }: GeneralProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateSize = () => setIsMobile(window.innerWidth < 768);
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const { name, httpEndpoint, wsEndpoint, jsonRpcApiMethods } = getRpcNodeInfo(data);
  const networkStatus = getNetworkStatus(data);

  return (
    <div className="col-span-12 flex flex-col gap-4 rounded-lg bg-white shadow-sm xl:col-span-5 2xl:col-span-5">
      <Heading as="h5" className="px-6 pt-6">
        RPC
      </Heading>
      {/* Table */}
      <div>
        {/* Table Head */}
        <div className="mt-2 grid grid-cols-2 gap-6 px-6 text-sm text-[#696969]">
          <span>Name</span>
          <span>Status</span>
        </div>
        <div className="my-1 h-px w-full bg-[#E0E0E0] opacity-50"></div>

        {/* Table Row */}
        <div className="mt-2 grid grid-cols-2 items-center gap-6 px-6 text-sm">
          <span>{isLoading ? "Loading..." : (name ?? "NA")}</span>
          <div className="flex justify-start">
            <Z4NetworkNodeStatus status={networkStatus} />
          </div>
        </div>
      </div>

      {/* URLs Section */}
      <div className="flex items-center justify-center gap-6 bg-[#E8EBF7] px-6 py-4">
        <InfoRow
          label="HTTPs URL"
          value={isLoading ? "Loading..." : httpEndpoint ? toShortString(httpEndpoint, isMobile ? 5 : 20, 10) : "NA"}
          showCopyButton={!isLoading && Boolean(httpEndpoint)}
          copyValue={httpEndpoint}
          className="w-full border-b border-[#CDD4F7] pb-1"
          isLoading={isLoading}
        />
        <InfoRow
          label="Wss URL"
          value={isLoading ? "Loading..." : wsEndpoint ? toShortString(wsEndpoint, isMobile ? 5 : 20, 10) : "NA"}
          showCopyButton={!isLoading && Boolean(wsEndpoint)}
          copyValue={wsEndpoint}
          className="w-full border-b border-[#CDD4F7] pb-1"
          isLoading={isLoading}
        />
      </div>

      {/* <div className="flex flex-row items-center justify-between px-6 text-sm">
        <span className="text-[#696969]">
          Nodes:{" "}
          <span className="text-black">
            {isLoading
              ? "--"
              : (Number(data?.nodeCount.arbitrumDA) || 0) +
                (Number(data?.nodeCount.arbitrumSepoliaNode) || 0) +
                (Number(data?.nodeCount.ethereumSepoliaNode) || 0) +
                (Number(data?.nodeCount.nitroNode) || 0)}
          </span>
        </span>
        <Z4Button
          variant="ghost"
          colorScheme={"blue"}
          className="border-none text-sm"
          onClick={() => setActiveIndex(1)}
        >
          View all
        </Z4Button>
      </div> */}

      <div className="-mt-4 flex h-full flex-col items-start justify-start rounded-b-lg bg-[#E8EBF7] px-6 pt-6">
        <span className="mb-2 block text-sm text-[#696969]">Enabled JSON-RPC API Methods</span>
        <div className="flex flex-wrap gap-2 rounded-lg">
          {(isLoading ? [] : (jsonRpcApiMethods ?? [])).map((method) => (
            <span key={method} className="rounded-md border border-brand-green px-2 py-0.5 text-sm text-brand-green">
              {method}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NodesOverview;
