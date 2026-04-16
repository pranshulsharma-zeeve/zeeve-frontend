import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getZkSyncDemoHost, isZkSyncDemoNetwork } from "../demo-vizion";
import { getExpiryDateFromLifetime, truncateMiddle, withBasePath } from "@/utils/helpers";

import { useSslRpcStore } from "@/store/vizion/sslRpc";
import CopyButton from "@/components/vizion/copy-button";
import { useVisionUserStore } from "@/store/vizionUser";
import { useMonitorRpcStore } from "@/store/vizion/monitorRpc";

interface ServiceMetric {
  fieldType: string;
  lastvalue: string | number;
  lifetime: string;
  url: string;
}

interface ServiceData {
  [key: string]: ServiceMetric[];
}

export default function RpcRollupServices() {
  const { id } = useParams();
  const networkId = id as string;
  const [showAll, setShowAll] = useState(false);
  const user = useVisionUserStore((state) => state.visionUser);
  const sslRpc = useSslRpcStore((state) => state.sslRpc);
  const monitor = useMonitorRpcStore((state) => state.monitorRpc);
  const isDemoNetwork = isZkSyncDemoNetwork(networkId);

  const selectedHost = useMemo(() => {
    if (isDemoNetwork) {
      return getZkSyncDemoHost();
    }
    if (!user?.hostData || user.hostData.length === 0) {
      return null;
    }
    return user.hostData.find((host) => host?.networkId === networkId) ?? user.hostData[0];
  }, [isDemoNetwork, user?.hostData, networkId]);

  const serviceData = sslRpc?.data as ServiceData;

  const entries = Object.entries(serviceData || {}).filter(([key]) => key.replace(/^\/+/, "").toLowerCase() === "rpc");
  const visibleEntries = showAll ? entries : entries.slice(0, 4);

  return (
    <div className="flex min-h-52 w-full flex-col overflow-hidden rounded-3xl border border-[#E1E1E1] text-black">
      {/* Header with translucent background */}
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-sm font-semibold">RPC</h2>
        {entries.length > 4 && (
          <button
            className="rounded-md border border-[#0DC0FA] px-2 py-1 text-sm font-normal text-[#0DC0FA]"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>
      {/* Body and filler with solid #181B3E background */}
      <div className="flex grow flex-col bg-[#F5F5F5] p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {visibleEntries.flatMap(([serviceName, metrics], nodeIndex) => {
            const rpcItem = metrics.find((item) => item.fieldType === "rpc");
            const rpcSslItem = metrics.find((item) => item.fieldType === "ssl");

            const primaryRpc = selectedHost?.RPC?.[0];
            if (!primaryRpc) return [];

            return (
              <div key={`${serviceName}-${nodeIndex}`} className="min-w-0 p-1">
                <div className="flex items-center justify-between gap-2 overflow-hidden">
                  <span className="truncate text-sm font-medium text-black">{serviceName}</span>
                  {rpcItem?.lastvalue === "UP" ? (
                    <Image
                      src={withBasePath(`/assets/images/protocol/runningLight.svg`)}
                      alt="status"
                      width={74}
                      height={64}
                    />
                  ) : (
                    <Image
                      src={withBasePath("/assets/images/protocol/stopped.svg")}
                      alt="status"
                      width={74}
                      height={64}
                      className="w-8 sm:w-12"
                    />
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-black">
                  <span className="inline-flex items-center text-sm font-normal">
                    SSL&nbsp;
                    <Image src={withBasePath("/assets/images/protocol/lock.svg")} alt="status" width={10} height={10} />
                  </span>

                  <span className="flex items-center gap-1 whitespace-nowrap text-xs font-normal">
                    Expiry{" "}
                    <span
                      className={`text-xs font-normal ${
                        Number(rpcSslItem?.lastvalue) < 5
                          ? "text-[#DE4841]"
                          : Number(rpcSslItem?.lastvalue) <= 15
                            ? "text-[#CEB940]"
                            : "text-[#0BB63B]"
                      }`}
                    >
                      {getExpiryDateFromLifetime(rpcSslItem?.lastvalue as string) || "N/A"}
                    </span>
                  </span>
                </div>

                <div className="mt-3 flex flex-row items-center justify-between gap-2 text-sm text-black">
                  <span className="whitespace-nowrap text-xs font-normal">HTTPS Endpoint</span>

                  <span className="flex items-center gap-2 overflow-visible text-xs font-normal">
                    <span title={monitor?.data?.httpEndpoint} className="max-w-[160px] truncate sm:max-w-[200px]">
                      {monitor?.data?.httpEndpoint ? truncateMiddle(monitor.data.httpEndpoint, 15) : "N/A"}
                    </span>

                    {monitor?.data?.httpEndpoint && <CopyButton text={String(monitor.data.httpEndpoint)} />}
                  </span>
                </div>
                <div className="mt-3 flex flex-row items-center justify-between gap-2 text-sm text-black">
                  <span className="whitespace-nowrap text-xs font-normal">WSS Endpoint</span>

                  <span className="flex items-center gap-2 overflow-visible text-xs font-normal">
                    <span title={monitor?.data?.wssEndpoint} className="max-w-[160px] truncate sm:max-w-[200px]">
                      {monitor?.data?.wssEndpoint ? truncateMiddle(monitor.data.wssEndpoint, 15) : "N/A"}
                    </span>

                    {monitor?.data?.wssEndpoint && <CopyButton text={String(monitor.data.wssEndpoint)} />}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
