/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@zeeve-platform/ui";
import { IconDocument2Text } from "@zeeve-platform/icons/document/outline";
import { useZkSyncDashboard } from "../../tabs/dashboard-context";
import { useSslRpcStore } from "@/store/vizion/sslRpc";
import { withBasePath } from "@/utils/helpers";
import KeyValue from "@/components/vizion/key-value";
import Card from "@/components/vizion/card";
import { useZksyncDashboardStore } from "@/store/vizion/zksync-dashboard";

const RollupCard = ({ className }: { className?: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [isSecurityCount, setSecurityCount] = useState(0);
  const dashboard = useZksyncDashboardStore((state) => state.zksyncDashboard);
  const { normalized } = useZkSyncDashboard();
  const prividiumValue = normalized?.rollupMetadata?.isPrividium ?? normalized?.overview?.isPrividium;
  const isPrividium =
    typeof prividiumValue === "boolean"
      ? prividiumValue
      : typeof prividiumValue === "string"
        ? prividiumValue.toLowerCase() === "true"
        : false;
  const sslRpc = useSslRpcStore((state) => state.sslRpc);
  const serviceEntries = sslRpc?.data ? Object.entries(sslRpc.data) : [];

  // useEffect(() => {
  //   let status = "healthy"; // Default security status
  //   let count = 0; // Initialize count for security checks
  //   serviceEntries.forEach(([, items]) => {
  //     const rpcItem = items.find((item) => item.fieldType === "rpc");
  //     const sslItem = items.find((item) => item.fieldType === "ssl");
  //     if (rpcItem?.status_codes === "200" && Number(sslItem?.lastvalue) > 15) {
  //       count++; // Increment count for matching conditions
  //       status = "healthy";
  //     } else if (
  //       rpcItem?.status_codes === "200" &&
  //       Number(sslItem?.lastvalue) > 3 &&
  //       Number(sslItem?.lastvalue) <= 15
  //     ) {
  //       count++;
  //       status = "moderate";
  //     } else if (rpcItem?.status_codes !== "200" && Number(sslItem?.lastvalue) < 3) {
  //       count++;
  //       status = "risky";
  //     } else {
  //       status = "risky";
  //     }
  //   });

  //   setSecurityCount(count); // Update count once
  // }, [sslRpc?.data]); // Run when sslRpc.data changes

  return (
    <Card
      className={`${className} h-full rounded-2xl bg-white font-semibold lg:px-0`}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundImage: "url(/assets/images/protocol/light-bg1.svg)",
        backgroundSize: "stretch",
        backgroundPosition: "bottom right",
      }}
      title="Rollup Metrics"
    >
      {isPrividium && (
        <div className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Data is not available since this network is private.
        </div>
      )}
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2 rounded-lg sm:flex-row sm:items-center sm:gap-3">
          <div className="mt-1">
            <Image
              src={withBasePath("/assets/images/protocol/rollups/arrow.svg")}
              alt="Severity 1"
              width={24}
              height={24}
            />
          </div>
          <KeyValue
            isLoading={isLoading}
            labelClassName="text-[#696969]"
            className="col-span-1 text-2xl font-semibold lg:col-span-1"
            label={"Total Transactions"}
            value={isPrividium ? "NA" : dashboard?.data.rollUpAnalysis.totalTransactions || "NA"}
          />
        </div>
        <div className="flex flex-col gap-2 rounded-lg sm:flex-row sm:items-center sm:gap-3">
          <div className="mt-1">
            <Image
              src={withBasePath("/assets/images/protocol/rollups/verifyBadge.svg")}
              alt="Severity 1"
              width={24}
              height={24}
            />
          </div>
          <KeyValue
            labelClassName="text-[#696969]"
            isLoading={isLoading}
            className="col-span-1 text-2xl font-semibold lg:col-span-1"
            label="Verified Smart Contract"
            value={isPrividium ? "NA" : dashboard?.data.rollUpAnalysis.verifiedSmartContracts || "NA"}
          />
        </div>
        <div className="flex flex-col gap-2 rounded-lg p-3 sm:flex-row sm:items-center sm:gap-3">
          <div className="mt-1">
            <Image
              src={withBasePath("/assets/images/protocol/rollups/gas.svg")}
              alt="Severity 1"
              width={24}
              height={24}
            />
          </div>
          <KeyValue
            isLoading={isLoading}
            labelClassName="text-[#696969]"
            className="col-span-1 text-2xl font-semibold lg:col-span-1"
            label="Gas Used"
            value={
              isPrividium
                ? "NA"
                : typeof dashboard?.data?.rollUpAnalysis?.gasUsed === "number"
                  ? dashboard.data.rollUpAnalysis.gasUsed.toFixed(3)
                  : dashboard?.data?.rollUpAnalysis?.gasUsed || "NA"
            }
          />
        </div>
        <div className="flex flex-col gap-2 rounded-lg p-0 sm:flex-row sm:items-center sm:gap-3">
          <div className="mt-1">
            <Image
              src={withBasePath("/assets/images/protocol/rollups/user.svg")}
              alt="Severity 1"
              width={24}
              height={24}
            />
          </div>
          <KeyValue
            isLoading={isLoading}
            className="col-span-1 lg:col-span-1"
            label="Wallet Addresses"
            labelClassName="text-[#696969]"
            value={isPrividium ? "NA" : dashboard?.data.rollUpAnalysis.totalUsers || "NA"}
          />
        </div>
        <div className="flex flex-col gap-2 rounded-lg sm:flex-row sm:items-center sm:gap-3">
          <div className="mt-1">{<IconDocument2Text className="size-6 text-gray-400" />}</div>
          <KeyValue
            labelClassName="text-[#696969]"
            isLoading={isLoading}
            className="col-span-1 text-2xl font-semibold lg:col-span-1"
            label="Total Contracts"
            value={isPrividium ? "NA" : dashboard?.data?.counters?.totalContracts || "NA"}
          />
        </div>
        {/* <div className="flex flex-col gap-3 rounded-lg border border-[#F1F1F1] p-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between xl:col-span-1"> */}
        {/* Left group */}
        {/* <div className="flex items-center gap-2">
            <Image
              src={withBasePath("/assets/images/protocol/rollups/warning.svg")}
              alt="Severity 1"
              width={24}
              height={24}
            />

            <KeyValue
              isLoading={isLoading}
              labelClassName="text-[#696969]"
              className="text-2xl font-semibold"
              label="Alerts"
              value={isSecurityCount}
            />
          </div> */}

        {/* Button */}
        {/* <Link
            href="#alerts-bottom"
            className="mb-2.5 ml-1.5 rounded-md border border-[#405CCE] px-3 py-1 text-xs text-[#405CCE] hover:underline"
          >
            View
          </Link>
        </div> */}
      </div>
    </Card>
  );
};

export default RollupCard;
