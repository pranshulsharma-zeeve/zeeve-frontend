import React, { useState } from "react";
import Image from "next/image";
import { useSslRpcStore } from "@/store/vizion/sslRpc";
import { getExpiryDateFromLifetime, truncateMiddle, withBasePath } from "@/utils/helpers";

import CopyButton from "@/components/vizion/copy-button";

export default function ToolsRollupServices() {
  const [showAll, setShowAll] = useState(false);
  const sslRpc = useSslRpcStore((state) => state.sslRpc);
  const imageMapping: Record<"explorer" | "faucet" | "bridge", string> = {
    explorer: "/assets/images/protocol/trace.svg",
    faucet: "/assets/images/protocol/faucet.svg",
    bridge: "/assets/images/protocol/bridge.svg",
  };

  // Convert the data object into an array of entries
  const serviceEntries = sslRpc?.data ? Object.entries(sslRpc.data) : [];

  return (
    <div className="flex min-h-52 w-full flex-col overflow-hidden rounded-3xl border border-[#E1E1E1] text-black">
      {/* Header with translucent background */}
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-sm font-semibold">Tools</h2>
        {serviceEntries.length > 4 && (
          <button
            className="rounded-md border border-[#0DC0FA] px-2 py-1 text-sm font-normal text-[#0DC0FA]"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {/* Body with consistent background */}
      <div className="grid h-full grid-cols-1 bg-[#F5F5F5] p-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 lg:gap-32">
        {serviceEntries.map(([serviceName, items], nodeIndex) => {
          if (serviceName.toLocaleLowerCase() !== "rpc" && serviceName.toLocaleLowerCase() !== "faucet") {
            const rpcItem = items.find((item) => item.fieldType === "rpc");
            const rpcSslItem = items.find((item) => item.fieldType === "ssl");
            const imagePath =
              imageMapping[serviceName.toLocaleLowerCase() as keyof typeof imageMapping] ||
              "/assets/images/protocol/trace.svg";

            return (
              <div key={nodeIndex} className="min-w-[200px] bg-[#F5F5F5] px-0 py-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold">
                    <div className="flex items-center gap-1">
                      <Image src={withBasePath(imagePath)} alt="status" width={24} height={84} />
                      {/* <span className="ml-2 text-sm font-medium">{serviceName}</span> */}
                      <a
                        href={rpcItem?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-500"
                      >
                        <span className="mx-2 text-sm font-medium text-black">{serviceName}</span>
                        <Image src="/assets/images/protocol/linkBlue.svg" alt="Link" width={12} height={12} />
                      </a>
                    </div>
                  </span>
                  <div className="flex items-center gap-2">
                    {/* {serviceName.toLocaleLowerCase() === "explorer" && (
                      <Image
                        className="ml-8"
                        src="/assets/images/protocol/synced.svg"
                        alt="synced"
                        width={64}
                        height={84}
                      />
                    )} */}
                    <Image
                      src={withBasePath(`/assets/images/protocol/runningLight.svg`)}
                      alt="status"
                      width={74}
                      height={84}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-black">
                  <span className="text-sm font-normal">
                    SSL {}{" "}
                    <Image
                      src={withBasePath("/assets/images/protocol/lock.svg")}
                      alt="status"
                      width={10}
                      height={10}
                      className="inline-block"
                    />
                  </span>
                  <span className="flex items-center gap-1 text-xs font-normal">
                    Expiry{" "}
                    <span
                      className={`text-xs ${
                        Number(rpcSslItem?.lastvalue) < 5
                          ? "text-[#DE4841]"
                          : Number(rpcSslItem?.lastvalue) <= 15
                            ? "text-[#CEB940]"
                            : "text-[#0BB63B]"
                      }`}
                    >
                      {getExpiryDateFromLifetime(rpcSslItem?.lastvalue)}
                    </span>
                    {/* <Image
                      src={withBasePath("/assets/images/protocol/valid.svg")}
                      alt="status"
                      width={64}
                      height={84}
                      className="inline-block"
                    /> */}
                  </span>
                </div>
                {/* <div className="mt-3 flex items-center justify-between text-sm text-black">
                  <span className="text-sm font-normal">https endpoint</span>
                  <span className="flex items-center gap-1 text-xs font-normal">
                    <span>{rpcItem?.url ? truncateMiddle(rpcItem.url, 15) : "N/A"}</span>
                    {rpcItem?.url && <CopyButton text={String(rpcItem?.url)} />}{" "}
                  </span>
                </div> */}

                {/* <div className="mt-3 flex items-center justify-between gap-x-16 text-sm font-normal text-[#AAABB8]">
                  <span>
                    {rpcItem?.url ? truncateMiddle(rpcItem.url, 15) : "N/A"}{" "}
                    {rpcItem?.url && <CopyButton text={String(rpcItem?.url)} />}
                  </span>
                </div> */}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
