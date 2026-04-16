"use client";
import React from "react";
import Image from "next/image";
import LogsCard from "./logs";
import { withBasePath } from "@/utils/helpers";
import { useMonitorRpcStore } from "@/store/vizion/monitorRpc";
import KeyValue from "@/components/vizion/key-value";
import Card from "@/components/vizion/card";

const SecurityMonitoringCard = ({ createdAt, className }: { createdAt?: string; className?: string }) => {
  const monitor = useMonitorRpcStore((state) => state.monitorRpc);
  const isLoading = false;

  return (
    <div
      className={`${className ?? ""} col-span-12 flex flex-col gap-0 rounded-2xl border border-[#89BBF54D] lg:flex-row lg:gap-0`}
    >
      <Card
        className="w-full rounded-2xl bg-white font-semibold lg:w-1/2 lg:rounded-l-2xl lg:rounded-r-none"
        style={{
          backgroundImage: `url('/assets/images/protocol/sec.svg')`,
          backgroundSize: "center",
          backgroundPosition: "bottom right",
          backgroundRepeat: "no-repeat",
        }}
        title="Security & Monitoring"
      >
        {/* Chain Data */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Image
              src={withBasePath("/assets/images/protocol/secureAccess.svg")}
              alt="secureAccess"
              width={54}
              height={24}
            />
            <KeyValue
              isLoading={isLoading}
              labelClassName="text-[#696969]"
              label="API Key based"
              value="Secure Access"
              valueClassName="text-sm font-semibold"
              valueFour={monitor?.data?.secureAccess === true ? "enabledlight" : "disabled"}
            />
          </div>
          <div className="flex items-center gap-2">
            <Image src={withBasePath("/assets/images/protocol/firewall.svg")} alt="Firewall" width={54} height={24} />
            <KeyValue
              isLoading={isLoading}
              label=""
              labelClassName="text-[#696969]"
              value="Firewall"
              valueClassName="text-sm font-semibold"
              valueFour={monitor?.data?.firewall.toLocaleLowerCase() || "inactive"}
            />
          </div>
          <div className="flex items-center gap-2">
            <Image
              src={withBasePath("/assets/images/protocol/ddosPro.svg")}
              alt="DDoS Protection"
              width={54}
              height={24}
            />
            <KeyValue
              isLoading={isLoading}
              label=""
              labelClassName="text-[#696969]"
              value="DDoS Protection"
              valueClassName="text-sm font-semibold"
              valueFour={monitor?.data?.ddosProtection === true ? "enabledlight" : "disabled"}
            />
          </div>
          <div className="flex items-center gap-2">
            <Image
              src={withBasePath("/assets/images/protocol/balancer.svg")}
              alt="Load balancer"
              width={54}
              height={24}
            />
            <KeyValue
              isLoading={isLoading}
              labelClassName="text-[#696969]"
              label=""
              value="Load Balancer"
              valueFour={monitor?.data?.loadBalancer?.status.toLocaleLowerCase() === "running" ? "running" : "stopped"}
              valueClassName="text-sm font-semibold"
            />
          </div>

          <div className="flex items-center gap-2">
            <Image
              src={withBasePath("/assets/images/protocol/intrution.svg")}
              alt="Intrusion Detection"
              width={54}
              height={24}
            />
            <KeyValue
              isLoading={isLoading}
              label=""
              labelClassName="text-[#696969]"
              value="Intrusion Detection"
              valueFour={monitor?.data?.intrusionDetection === true ? "enabledlight" : "disabled"}
              valueClassName="text-sm font-semibold"
            />
          </div>
          <div className="flex items-center gap-2">
            <Image
              src={withBasePath("/assets/images/protocol/malware.svg")}
              alt="Malware protection"
              width={54}
              height={24}
            />
            <KeyValue
              isLoading={isLoading}
              label=""
              labelClassName="text-[#696969]"
              value="Malware protection"
              valueFour={monitor?.data?.malwareProtection === true ? "enabledlight" : "disabled"}
              valueClassName="text-sm font-semibold"
            />
          </div>
        </div>
        {/* Explorer Section */}
        <div className="mt-4 pt-2">
          <h6 className="mb-2 mt-4 text-[#AAABB8]">{""}</h6>
          <div className="flex flex-wrap items-center gap-4"></div>
        </div>
      </Card>
      <LogsCard
        className="w-full rounded-2xl bg-white font-semibold lg:w-1/2 lg:rounded-l-none"
        createdAt={createdAt}
      />
    </div>
  );
};

export default SecurityMonitoringCard;
