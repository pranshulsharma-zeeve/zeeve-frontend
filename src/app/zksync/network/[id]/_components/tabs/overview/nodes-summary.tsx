"use client";
import { Heading, useTabsContext, Z4Button, tx } from "@zeeve-platform/ui";
import { useEffect, useState } from "react";
import { useZkSyncDashboard } from "../dashboard-context";
import Z4NetworkNodeStatus from "@/modules/arbitrum-orbit/components/z4-network-node-status";
import type { NodeNetworkStates as OrbitNodeNetworkStates } from "@/modules/arbitrum-orbit/types/node";
import InfoRow from "@/modules/arbitrum-orbit/components/info-row";
import { toShortString } from "@/utils/helpers";

const NodesOverview = ({ className }: { className?: string }) => {
  const { setActiveIndex } = useTabsContext();
  const [isMobile, setIsMobile] = useState(false);
  const { normalized, isLoading } = useZkSyncDashboard();
  const rpcNode = normalized?.rpcNode;
  const rpcConfig = rpcNode?.rpcAccess;
  const nodeCount = normalized?.nodeCount;
  const networkStatus = normalized?.summary?.status as OrbitNodeNetworkStates | undefined;

  useEffect(() => {
    const updateSize = () => setIsMobile(window.innerWidth < 768);
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className={tx(
        "col-span-12 flex flex-col gap-6 rounded-lg bg-white shadow-sm xl:col-span-6 2xl:col-span-5",
        className,
      )}
    >
      <Heading as="h5" className="px-6 pt-6">
        Rollup RPC
      </Heading>
      {/* Table */}
      <div>
        {/* Table Head */}
        <div className="mt-2 grid grid-cols-2 gap-6 px-6 text-sm text-[#696969]">
          <span>Name</span>
          {/* <span className="text-right">Node Type</span> */}
          <span>Status</span>
        </div>
        <div className="my-1 h-px w-full bg-[#E0E0E0] opacity-50"></div>

        {/* Table Row */}
        <div className="mt-2 grid grid-cols-2 items-center gap-6 px-6 text-sm">
          <span>{isLoading ? "Loading..." : (rpcNode?.name ?? "NA")}</span>
          {/* <span className="text-right">{isLoading ? "Loading..." : (capitalizeFirstLetter(nodeType) ?? "NA")}</span> */}
          <div className="flex justify-start">
            <Z4NetworkNodeStatus status={networkStatus} />
          </div>
        </div>
      </div>

      {/* URLs Section */}
      <div className="flex items-center justify-center gap-6 bg-[#E8EBF7] px-6 py-4">
        <InfoRow
          label="HTTPS URL"
          value={
            isLoading
              ? "Loading..."
              : rpcConfig?.http?.endpoint
                ? toShortString(rpcConfig.http.endpoint, isMobile ? 5 : 14, 7)
                : "NA"
          }
          showCopyButton={!isLoading && Boolean(rpcConfig?.http?.endpoint)}
          copyValue={rpcConfig?.http?.endpoint ?? ""}
          className="w-full border-b border-[#CDD4F7] pb-1"
          isLoading={isLoading}
        />
        <InfoRow
          label="WSS URL"
          value={
            isLoading
              ? "Loading..."
              : rpcConfig?.ws?.endpoint
                ? toShortString(rpcConfig.ws.endpoint, isMobile ? 5 : 14, 7)
                : "NA"
          }
          showCopyButton={!isLoading && Boolean(rpcConfig?.ws?.endpoint)}
          copyValue={rpcConfig?.ws?.endpoint ?? ""}
          className="w-full border-b border-[#CDD4F7] pb-1"
          isLoading={isLoading}
        />
      </div>

      <div className="flex flex-row flex-wrap items-center gap-3 px-6 text-sm text-[#696969]">
        {[
          { label: "Total Services", value: nodeCount?.total ?? 0 },
          { label: "RPC", value: nodeCount?.rpc ?? 0 },
          { label: "ZkSync", value: nodeCount?.zksync ?? 0 },
          { label: "Prover", value: nodeCount?.prover ?? 0 },
        ].map((item) => (
          <span key={item.label}>
            {item.label}: <span className="text-black">{isLoading ? "--" : item.value}</span>
          </span>
        ))}
        <Z4Button
          variant="ghost"
          colorScheme={"blue"}
          className="border-none text-sm"
          onClick={() => setActiveIndex(2)}
        >
          View all
        </Z4Button>
      </div>
    </div>
  );
};

export default NodesOverview;
