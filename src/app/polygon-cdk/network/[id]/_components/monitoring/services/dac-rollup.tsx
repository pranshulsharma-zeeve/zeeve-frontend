import React, { useState } from "react";
import Image from "next/image";
import { useServiceStore } from "@/store/vizion/service";
import { withBasePath } from "@/utils/helpers";

interface ServiceMetric {
  fieldType: string;
  lastvalue: string | number;
}

interface ServiceData {
  [key: string]: ServiceMetric[];
}

export default function DacRollupServices() {
  const [showAll, setShowAll] = useState(false);
  const service = useServiceStore((state) => state.service);
  const serviceData = service?.data as ServiceData;
  const entries = Object.entries(serviceData || {}).filter(([key]) => key.replace(/^\/+/, "").toLowerCase() === "dac");
  const visibleEntries = showAll ? entries : entries.slice(0, 4);

  return (
    <div className="flex min-h-[350px] flex-col overflow-hidden rounded-3xl border border-[#E1E1E1] text-black">
      {/* Header Section with Darker Background */}
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-sm font-semibold">DAC</h2>
        {entries.length > 4 && (
          <button
            className="rounded-md border border-[#0DC0FA] px-2 py-1 text-sm font-normal text-[#0DC0FA]"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>
      {/* Body Section with Custom Background Color */}
      <div className="space-y-4 bg-[#F5F5F5] p-6">
        {" "}
        {/* Applied #181B3E color to body */}
        {visibleEntries
          .filter(([key]) => key.replace(/^\/+/, "").toLowerCase() === "dac")
          .map(([key]) => {
            const formattedKey = key.replace(/^\/+/, "");

            return (
              <div key={formattedKey} className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="text-sm font-medium"> {formattedKey}</div>
                <Image
                  src={withBasePath(`/assets/images/protocol/runningLight.svg`)}
                  alt="status"
                  width={74}
                  height={84}
                />
              </div>
            );
          })}
      </div>
      {/* Bottom Part with the Same Background Color */}
      <div
        className="grow bg-[#F5F5F5]"
        style={{
          backgroundImage: "url(/assets/images/protocol/light-bg1.svg)",
          backgroundSize: "contain fit",
          backgroundPosition: "bottom right",
          backgroundRepeat: "no-repeat",
        }}
      ></div>{" "}
      {/* Ensures bottom has the same background */}
    </div>
  );
}
