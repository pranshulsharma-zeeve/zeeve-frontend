import React, { useState } from "react";
import Image from "next/image";
import { useServiceStore } from "@/store/vizion/service";
import { withBasePath } from "@/utils/helpers";
import RPCEndpoint from "@/app/manage/nodes/validator/[id]/_components/details/rpc-endpoint";

interface ServiceMetric {
  fieldType: string;
  lastvalue: string | number;
}

interface ServiceData {
  [key: string]: ServiceMetric[];
}

export default function CoreRollupServices() {
  const [showAll, setShowAll] = useState(false);
  const service = useServiceStore((state) => state.service);
  const serviceData = {
    Prover: [
      {
        lastvalue: "4",
        fieldType: "Health status",
      },
    ],
    Zksync: [
      {
        lastvalue: "4",
        fieldType: "Health status",
      },
    ],
  };
  const excludedKeys = ["dac"];

  const entries = Object.entries(serviceData || {}).filter(([key]) => {
    const formattedKey = key.replace(/^\/+/, "").toLowerCase();
    return !excludedKeys.includes(formattedKey);
  });

  const filteredEntries = entries.filter(([key]) => {
    const formattedKey = key.replace(/^\/+/, "").toLowerCase();
    return !excludedKeys.includes(formattedKey);
  });

  const visibleEntries = showAll ? filteredEntries : filteredEntries.slice(0, 4);

  return (
    <div className="flex h-full min-h-52 flex-col overflow-hidden rounded-3xl border border-[#E1E1E1] text-black">
      {/* Header with translucent background */}
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-sm font-semibold">Core Rollup Services</h2>
        {/* {entries.length > 4 && (
          <button
            className="rounded-md border border-[#0DC0FA] px-2 py-1 text-sm font-normal text-[#0DC0FA]"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )} */}
      </div>

      {/* Body with solid background */}
      <div
        className="flex grow flex-col space-y-4 bg-[#F5F5F5] p-4"
        style={{
          backgroundImage: "url(/assets/images/protocol/light-bg1.svg)",
          backgroundSize: "stretch",
          backgroundPosition: "bottom right",
          backgroundRepeat: "no-repeat",
        }}
      >
        {visibleEntries.flatMap(([serviceName, metrics]) => {
          const rpcItem = metrics.find((item) => item.fieldType === "Health status");

          return (
            <div key={serviceName} className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="text-sm font-medium">{serviceName}</div>
              {rpcItem?.lastvalue === "4" ? (
                <Image
                  src={withBasePath(`/assets/images/protocol/runningLight.svg`)}
                  alt="status"
                  width={74}
                  height={84}
                />
              ) : (
                <Image src={withBasePath("/assets/images/protocol/stopped.svg")} alt="status" width={74} height={84} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
