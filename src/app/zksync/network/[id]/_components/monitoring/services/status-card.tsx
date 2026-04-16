import React from "react";
import Image from "next/image";
import { withBasePath } from "@/utils/helpers";

interface StatusCardProps {
  title: string;
  status: string;
  cpu: string;
  memory: string;
  network: string;
  networkSent: string;
}

export default function StatusCard(props: StatusCardProps) {
  return (
    <div className="min-h-[170px] w-full max-w-sm rounded-2xl border border-[#FFFFFF]/10 p-5 text-white">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{props.title}</h2>
        <span className="shrink-0">
          <Image
            src={withBasePath("/assets/images/protocol/healthy.svg")}
            alt="status"
            width={84} // Adjust size as needed
            height={84}
          />
        </span>
      </div>

      {/* Metrics Section */}
      <div className="mt-4 space-y-3 font-normal text-[#AAABB8]">
        {props.cpu && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src={withBasePath("/assets/images/protocol/service/cpu.svg")} alt="cpu" width={14} height={14} />
              <span>CPU</span>
            </div>
            <span className="text-[#FFFFFF]">{parseFloat(props.cpu)?.toFixed(2)} %</span>
          </div>
        )}
        <div className="mt-4 space-y-3">
          {props.memory && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src={withBasePath("/assets/images/protocol/service/memory.svg")}
                  alt="cpu"
                  width={14}
                  height={14}
                />
                <span>Memory</span>
              </div>
              <span className="text-[#FFFFFF]">{(Number(props.memory) / 1024 ** 3).toFixed(3)} GB</span>{" "}
            </div>
          )}
        </div>
        <div className="mt-4 space-y-3">
          {props.network && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src={withBasePath("/assets/images/protocol/service/network.svg")}
                  alt="cpu"
                  width={14}
                  height={14}
                />
                <span>Network I/O</span>
              </div>
              <span className="text-[#FFFFFF]">
                {((Number(props.networkSent) * 8) / 1_000_000).toFixed(3)} /{" "}
                {((Number(props.network) * 8) / 1_000_000).toFixed(3)} Mbps
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
