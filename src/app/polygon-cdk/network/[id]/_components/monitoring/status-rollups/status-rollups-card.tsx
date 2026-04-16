"use client";
import React from "react";
import Image from "next/image";
import { Button, Link } from "@zeeve-platform/ui";
import FinancialsTransactionsCard from "../financials/financials-transactions-card";

import { usePolygonCdkDashboard } from "../../tabs/dashboard-context";
import { withBasePath } from "@/utils/helpers";
import { useDashboardStore } from "@/store/vizion/dashboard";
import UptimeIcon from "@/components/icons/uptime";
import Card from "@/components/vizion/card";

const StatusRollupsCard = ({ className }: { className?: string }) => {
  const dashboard = useDashboardStore((state) => state.dashboard);
  const { normalized, isLoading } = usePolygonCdkDashboard();

  return (
    <div className={`${className} col-span-12 flex flex-col rounded-2xl border border-[#89BBF54D] lg:flex-row`}>
      <Card
        className={`w-full rounded-l-xl rounded-r-none border border-[#1c2b62] p-4 text-xl font-medium text-white lg:w-2/5 lg:px-5`}
        style={{
          backgroundImage: `url('/assets/images/protocol/rollupnew.svg'), linear-gradient(165.43deg, #1E293C 29.94%, #574CE3 103.23%)`,
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundSize: "fit",
          backgroundPosition: "right bottom",
        }}
        title="Rollup Status"
        isTheme={true}
        IconTwo={UptimeIcon}
        alignHeaderExtrasRight
      >
        <div className="relative mt-8 flex justify-center">
          {/* L1 badge */}
          <div className="absolute -top-3 z-10 rounded-md bg-[#6C00F6B2] px-3 py-1 text-lg font-bold text-white shadow-md">
            L1
          </div>

          {/* Gradient BORDER wrapper */}
          <div className="w-full rounded-xl bg-gradient-to-b from-[rgba(108,0,246,0.4)] via-[rgba(108,0,246,0.15)] to-transparent p-2">
            {/* Gradient BACKGROUND content */}
            <div className="rounded-xl bg-[linear-gradient(180deg,rgba(108,0,246,0.2)_0%,rgba(108,0,246,0)_32.57%,rgba(108,0,246,0)_99.63%)] px-6 py-7 text-center">
              <div className="text-4xl font-semibold text-white">
                {dashboard?.data?.rollUpStatus?.lastVerifiedBatch ?? "NA"}
              </div>
              <div className="mt-1 text-sm font-normal text-[#AAABB8]">Last Sequence No.</div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <label className="size-3 flex-1 whitespace-nowrap text-[10px] font-normal text-[#AAABB8] sm:text-xs">
                TIME SINCE LAST VERIFIED BATCH
              </label>
              <span className="ml-2 whitespace-nowrap text-right text-xs font-normal">
                {dashboard?.data?.rollUpStatus?.lastVerfiedTime || "NA"}
              </span>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 text-left">
              <div className="flex min-w-0 flex-col break-words">
                <label className="mb-1 whitespace-nowrap text-[10px] font-normal text-[#AAABB8] sm:text-xs">
                  TIME SINCE LAST SEQUENCED BATCH
                </label>
                <span className="text-xs font-normal">{dashboard?.data?.rollUpStatus?.timeSinceLastBatch || "NA"}</span>
              </div>
              <div className="flex min-w-0 flex-col break-words text-right">
                <label className="mb-1 whitespace-normal text-[10px] font-normal text-[#AAABB8] sm:text-xs">
                  NEXT UPDATE IN
                </label>
                <span className="text-xs font-normal">{dashboard?.data.rollUpStatus?.nextUpdateIn || "NA"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-lg p-3 text-center text-2xl font-semibold">
          <div className="mt-6">
            <Link
              as={"a"}
              target="_blank"
              rel="noopener noreferrer"
              href={normalized?.rollupMetadata?.l1?.explorerUrl || "#"}
            >
              <Button
                isDisabled={isLoading}
                className="mt-2 w-auto border border-[#AAABB8] bg-transparent px-3 py-1 text-xs font-medium text-[#AAABB8]"
              >
                View on Explorer
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-row justify-between pt-5">
          <div className="flex items-center justify-between text-sm font-normal text-[#AAABB8]">
            <div className="flex items-center gap-2">
              <Image src={withBasePath("/assets/images/protocol/proof.svg")} alt="proof" width={34} height={24} />
              <div className="">
                <span className="block text-sm font-semibold text-[#FFFFFF]">PROOFS</span>
                <span className="block text-xs font-medium text-[#0BB63B]">Full Execution Proofs (Zk)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm font-normal text-[#AAABB8]">
            <div className="flex items-center gap-2">
              <Image src={withBasePath("/assets/images/protocol/protocol.svg")} alt="protocol" width={34} height={24} />
              <div className="">
                <span className="block text-sm font-semibold text-[#FFFFFF]">PROTOCOL VERSION</span>
                <span className="block text-xs font-medium text-[#0BB63B]">ForkID12</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <FinancialsTransactionsCard className="w-full" />
    </div>
  );
};

export default StatusRollupsCard;
