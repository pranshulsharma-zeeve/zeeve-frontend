"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import Card from "@/components/vizion/card";
import KeyValue from "@/components/vizion/key-value";
import { getLastIntervalDate, withBasePath } from "@/utils/helpers";
import usePlatformService from "@/services/platform/use-platform-service";
import { useVisionUserStore } from "@/store/vizionUser";
import { useNodeUptimeStore } from "@/store/nodeUptime";
import { getCookie } from "@/utils/cookies";
import HTTP_STATUS from "@/constants/http";
import { SecurityMonitorStatusResponse } from "@/services/vizion/security-monitoring";
import { Monitor, useMonitorRpcStore } from "@/store/vizion/monitorRpc";

export interface ChainData {
  totalBlock?: string;
  avgBlocktime?: number;
  gasTracker?: number;
  totalTransaction?: string;
  walletAddress?: string;
  latestBlock?: string | null;
  relativeLinks?: { name: string; url: string }[];
}
type PeriodicDates = {
  weekly: Date;
  monthly: Date;
  quarterly: Date;
};

const SecurityRpcMonitoringCard = ({
  className,
  createdAt,
  plan,
}: {
  className?: string;
  createdAt: string;
  plan?: string;
}) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const planType = searchParams.get("planType") ?? "";
  const networkId = params.id as string;
  const [monitor, setMonitor] = useState<Monitor>();
  const vizionUser = useVisionUserStore((state) => state.visionUser);
  const nodeStatus = useNodeUptimeStore((state) => state.nodeStatuses[`${networkId}-node1`]);
  const queryToken = useSearchParams().get("token");
  const token = queryToken ?? getCookie("token");

  const { request: monitoringReuest, url: monitoringUrl } = usePlatformService().vizion.monitoring();
  const dashboard = useMonitorRpcStore((state) => state.monitorRpc);

  const getMonitorDetails = async () => {
    try {
      if (!vizionUser) {
        console.warn("[SecurityRpcMonitoringCard] Missing vizion user context, skip fetch.", { networkId });
        setMonitor(undefined);
        return;
      }
      const hostList = Array.isArray(vizionUser.hostData) ? vizionUser.hostData : [];
      if (!hostList.length) {
        console.warn("[SecurityRpcMonitoringCard] vizion user has no host data", { vizionUser, networkId });
      }
      const coreumHost = hostList.find((host) => host.networkId === networkId);
      if (!coreumHost) {
        console.warn("[SecurityRpcMonitoringCard] Unable to locate host entry for network", { networkId, hostList });
      }
      const coreumPrimaryHost = coreumHost?.primaryHost;
      const coreumHostIds = coreumHost?.hostIds;
      const hostIds = coreumHostIds ?? [""];
      const primaryHost = coreumPrimaryHost ?? "";
      const response = await axios.post(
        monitoringUrl,
        {
          hostIds,
          primaryHost,
        },
        {
          headers: {
            Authorization: `Bearer ${vizionUser?.token ?? token ?? ""}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === HTTP_STATUS.OK) {
        setMonitor(response.data);
      }
    } catch (error) {
      console.log(error, "in error Monitor details");
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const dates: PeriodicDates = getLastIntervalDate(createdAt && createdAt.trim() !== "" ? createdAt : new Date());
  useEffect(() => {
    getMonitorDetails();
  }, [isLoading]);

  return (
    <div className={`${className} col-span-10 rounded-2xl border border-[#E1E1E1]`}>
      <Card
        className={`${className} col-span-10 grid grid-cols-10 gap-3 overflow-hidden rounded-2xl bg-white font-semibold lg:gap-6`}
        title="Security & Monitoring"
      >
        {/* Chain Data */}
        <div className="col-span-10 grid grid-cols-10 gap-5 lg:gap-8">
          {/* RPC Load Balancer Section - Left */}
          <div className={`col-span-10 lg:col-span-5`}>
            <div className="rounded-3xl border border-[#E1E1E1] bg-[#F5F5F5]">
              {/* Header */}
              <div className="flex items-center justify-between rounded-t-3xl bg-white px-6 py-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src={withBasePath("/assets/images/vizion/loadbalancer.svg")}
                    alt="Load balancer"
                    width={44}
                    height={24}
                  />
                  <h2 className="text-sm font-semibold text-[#09122D]">HA Failover</h2>
                </div>
                {plan === "Enterprise" ? (
                  <Image
                    src={withBasePath("/assets/images/vizion/active.svg")}
                    alt="HA Failover"
                    width={55}
                    height={24}
                  />
                ) : (
                  <Image
                    src={withBasePath("/assets/images/vizion/disabled.svg")}
                    alt="HA Failover"
                    width={75}
                    height={30}
                  />
                )}
              </div>

              {/* Load Balancer Nodes */}
              <div className="rounded-b-3xl p-6">
                <div className="mb-4 border-b border-[#E1E1E1] pb-4">
                  <span className="flex items-center justify-between text-sm font-medium text-[#09122D]">
                    Node 1
                    {nodeStatus === "active" ? (
                      <Image
                        src={withBasePath("/assets/images/vizion/active.svg")}
                        alt="active"
                        width={55}
                        height={24}
                        className="inline-block"
                      />
                    ) : nodeStatus === "standby" ? (
                      <div className="rounded-md bg-brand-yellow p-1.5 text-center text-xs font-bold text-brand-light">
                        Standby
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">...loading</span>
                    )}
                  </span>
                </div>
                <div className="mb-4 border-b border-[#E1E1E1] pb-4">
                  <span className="flex items-center justify-between text-sm font-medium text-[#09122D]">
                    Node 2
                    {nodeStatus ? (
                      <Image
                        src={withBasePath("/assets/images/vizion/disabled.svg")}
                        alt="disabled"
                        width={70}
                        height={24}
                        className="inline-block"
                      />
                    ) : (
                      <span className="text-sm text-gray-400">...loading</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Monitoring Section - Right */}
          <div className={`relative col-span-10 grid grid-cols-2 gap-3 rounded-3xl lg:col-span-5 lg:gap-3`}>
            <Image
              src={withBasePath("/assets/images/vizion/security-monitoring-bg.svg")}
              alt="Security Monitoring"
              width={579}
              height={255}
              className="pointer-events-none absolute right-0 z-0"
            />
            <div className={` flex items-center gap-3`}>
              <Image
                src={
                  monitor?.data?.secureAccess
                    ? withBasePath("/assets/images/vizion/secureAccess.svg")
                    : withBasePath("/assets/images/vizion/inactive-secure-access.svg")
                }
                alt="secureAccess"
                width={60}
                height={30}
              />
              <KeyValue
                isLoading={isLoading}
                label=""
                labelClassName="text-[#696969]"
                value="Secure Access"
                valueClassName="text-base font-semibold"
                valueFour={monitor?.data?.secureAccess === true ? "enabledlight" : "inactive"}
              />
            </div>
            <div className={` flex items-center gap-3`}>
              <Image
                src={
                  monitor?.data?.firewall
                    ? withBasePath("/assets/images/vizion/firewall.svg")
                    : withBasePath("/assets/images/vizion/inactive-firewall.svg")
                }
                alt="Firewall"
                width={60}
                height={30}
              />
              <KeyValue
                isLoading={isLoading}
                label=""
                value="Firewall"
                valueClassName="text-base font-semibold"
                valueFour={monitor?.data?.firewall ? monitor.data.firewall.toLocaleLowerCase() : "inactive"}
              />
            </div>
            <div className={` flex items-center gap-3`}>
              {/* //TODO update the image dyanamically */}
              <Image
                src={
                  monitor?.data?.ddosProtection
                    ? withBasePath("/assets/images/vizion/ddosPro.svg")
                    : withBasePath("/assets/images/vizion/inactive-ddosPro.svg")
                }
                alt="DDoS Protection"
                width={60}
                height={30}
              />
              <KeyValue
                isLoading={isLoading}
                label=""
                value="DDoS Protection"
                valueClassName="text-base font-semibold"
                valueFour={monitor?.data?.ddosProtection === true ? "enabledlight" : "inactive"}
              />
            </div>
            {monitor?.data?.loadBalancer && (
              <div className={` flex items-center gap-3`}>
                <Image
                  src={
                    monitor?.data?.loadBalancer
                      ? withBasePath("/assets/images/vizion/loadbalancer.svg")
                      : withBasePath("/assets/images/vizion/inactive-loadbalancer.svg")
                  }
                  alt="Load balancer"
                  width={54}
                  height={24}
                />
                <KeyValue
                  isLoading={isLoading}
                  label=""
                  value="Load Balancer"
                  // valueTwo="running"
                  valueClassName="text-sm font-semibold"
                  valueFour={monitor?.data?.ddosProtection === true ? "running" : "inactive"}
                />
              </div>
            )}
            {/* <div className={`flex items-center gap-3`}>
              <Image
                src={
                  planType?.toLowerCase().includes("enterprise")
                    ? withBasePath("/assets/images/vizion/standbyHardware.svg")
                    : withBasePath("/assets/images/vizion/inactive-standbyHardware.svg")
                }
                alt="Standby Hardware"
                width={60}
                height={30}
              />
              <KeyValue
                isLoading={isLoading}
                label=""
                value="Standby Hardware"
                valueClassName="text-base font-semibold"
                valueFour={planType?.toLowerCase().includes("enterprise") ? "enabledlight" : "inactive"}
              />
            </div> */}
            <div className={` flex items-center gap-3`}>
              <Image
                src={
                  monitor?.data?.intrusionDetection
                    ? withBasePath("/assets/images/vizion/intrution.svg")
                    : withBasePath("/assets/images/vizion/inactive-intrution.svg")
                }
                alt="Intrusion Detection"
                width={60}
                height={30}
              />
              <KeyValue
                isLoading={isLoading}
                label=""
                value="Intrusion Detection"
                valueFour={monitor?.data?.intrusionDetection === true ? "enabledlight" : "inactive"}
                valueClassName="text-base font-semibold"
              />
            </div>
            <div className={` flex items-center gap-3`}>
              <Image
                src={
                  monitor?.data?.malwareProtection
                    ? withBasePath("/assets/images/vizion/malware.svg")
                    : withBasePath("/assets/images/vizion/inactive-malware.svg")
                }
                alt="Malware protection"
                width={60}
                height={30}
              />
              <KeyValue
                isLoading={isLoading}
                label=""
                value="Malware protection"
                valueFour={monitor?.data?.malwareProtection === true ? "enabledlight" : "inactive"}
                valueClassName="text-sm font-semibold"
              />
            </div>
          </div>

          {/* Explorer Section - Full Width Below */}
          <div className={`col-span-10 grid grid-cols-4 gap-6 text-base font-semibold text-[#09122D]`}>
            <div className={`border-b border-[#E1E1E1]`}>
              <span>DDoS Logs Analysed</span>
              <div className={`flex justify-between text-sm font-normal text-[#696969]`}>
                <span>Last scanned</span>
                <span>{dayjs(dates.monthly).format("DD MMM YYYY")}</span>
              </div>
            </div>
            <div className={`border-b border-[#E1E1E1]`}>
              <span>Unauthorised Access Analysed</span>
              <div className={`flex justify-between text-sm font-normal text-[#696969]`}>
                <span>Last scanned</span>
                <span>{dayjs(dates.weekly).format("DD MMM YYYY")}</span>
              </div>
            </div>
            <div className={`border-b border-[#E1E1E1]`}>
              <span>Software Upgrades/Updates</span>
              <div className={`flex justify-between text-sm font-normal text-[#696969]`}>
                <span>Last updated</span>
                <span>{dayjs(dates.weekly).format("DD MMM YYYY")}</span>
              </div>
            </div>
            <div className={`border-b border-[#E1E1E1]`}>
              <span>Security Package Updates</span>
              <div className={`flex justify-between text-sm font-normal text-[#696969]`}>
                <span>Last updated</span>
                <span>{dayjs(dates.weekly).format("DD MMM YYYY")}</span>
              </div>
            </div>
            <div className={`border-b border-[#E1E1E1]`}>
              <span>Malware Scan</span>
              <div className={`flex justify-between text-sm font-normal text-[#696969]`}>
                <span>Last scanned</span>
                <span>{dayjs(dates.weekly).format("DD MMM YYYY")}</span>
              </div>
            </div>
            <div className={`border-b border-[#E1E1E1]`}>
              <span>Endpoint PEN Test</span>
              <div className={`flex justify-between text-sm font-normal text-[#696969]`}>
                <span>Last scanned</span>
                <span>{dayjs(dates.quarterly).format("DD MMM YYYY")}</span>
              </div>
            </div>
            <div className={`border-b border-[#E1E1E1]`}>
              <span>Backup</span>
              <div className={`flex justify-between text-sm font-normal text-[#696969]`}>
                <span>Last backup</span>
                <span>{dayjs(dates.weekly).format("DD MMM YYYY")}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SecurityRpcMonitoringCard;
