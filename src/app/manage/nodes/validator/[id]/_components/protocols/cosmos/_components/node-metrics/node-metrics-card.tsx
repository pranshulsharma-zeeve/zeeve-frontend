"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation"; // Import Next.js router
import Image from "next/image";
import FinancialsTransactionsArea from "../financials/financials-transactions-area";
import Card from "@/components/vizion/card";
import KeyValueEvm from "@/components/vizion/key-value-evm";
import UptimeIcon from "@/components/icons/uptime";
import CopyButton from "@/components/vizion/copy-button";
import { convertMicroToUnit, toShortString, withBasePath } from "@/utils/helpers";
import { PROTOCOL_MAPPING } from "@/constants/protocol";
import { StakingValidatorRequestResponse } from "@/services/vizion/staking-validator";
import { ValidatorDetailResponse } from "@/services/vizion/validator-details";
import { ValidatorNodeResponse } from "@/services/vizion/validator-node-details";

const NodeMetricsCard = ({
  className,
  stakingDetails,
  validatorData,
  validatorNodeDetails,
}: {
  className?: string;
  stakingDetails?: StakingValidatorRequestResponse;
  validatorData?: ValidatorDetailResponse;
  validatorNodeDetails: ValidatorNodeResponse | undefined;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const status =
    stakingDetails?.data?.nodeInfo?.bondStatus === "1" && stakingDetails?.data?.nodeInfo?.jailedStatus === "1"
      ? "Active"
      : "Inactive";

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className={`col-span-10 grid grid-cols-10 rounded-2xl border border-[#E1E1E1] ${className}`}>
      <Card
        className={`col-span-10 gap-6 rounded-l-2xl border border-[#89BBF54D]/30 p-6 font-medium text-white lg:col-span-4`}
        style={{
          background: `
          linear-gradient(165.43deg, rgba(30, 41, 60, 0.5) 29.94%, rgba(87, 76, 227, 0.5) 103.23%),
          url('/assets/images/vizion/nodebg1.svg'),
          linear-gradient(to bottom, #1E293C, #574CE3)
        `,
          backgroundSize: "cover, auto, cover",
          backgroundPosition: "center, 100% 100%, center",
          backgroundRepeat: "no-repeat, no-repeat, no-repeat",
        }}
        isTheme={true}
        IconTwo={UptimeIcon}
        title="Validator Details"
      >
        <span className="mt-4 inline-flex items-center gap-1.5">
          <Image src={withBasePath("/assets/images/vizion/chainEth.svg")} alt="Protocol Icon" width={20} height={20} />
          <span className="text-sm font-normal text-[#ffffff]">Chain ID</span>{" "}
          <span className="text-sm font-semibold">102145545</span>
        </span>
        {/* Make two columns that are flex-col so we can push items down */}
        <div className="grid grid-cols-2 gap-4">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4">
            <KeyValueEvm
              isLoading={isLoading}
              horizontal={false}
              valueClassName="text-white font-semibold text-xl"
              label="Block Height"
              labelClassName="text-sm font-normal text-[#AAABB8]"
              value={stakingDetails?.data?.nodeInfo?.name || ""}
            />

            <KeyValueEvm
              isLoading={isLoading}
              horizontal={false}
              valueClassName="text-white font-semibold text-xl"
              label="Syncing Status"
              labelClassName="text-sm font-normal text-[#AAABB8]"
              value={validatorNodeDetails?.data?.[0]?.inputs?.email || ""}
            />
            <KeyValueEvm
              isLoading={isLoading}
              horizontal={false}
              valueClassName="text-white font-semibold text-xl"
              label="Peer Count"
              labelClassName="text-sm font-normal text-[#AAABB8]"
              value={validatorNodeDetails?.data?.[0]?.inputs?.website || ""}
            />
            <div className="">
              <span className="block text-sm font-semibold text-[#FFFFFF]">PROTOCOL VERSION</span>
              <span className="block text-xs font-medium text-[#2EC589]">2.11</span>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            {/* <KeyValueEvm
              isLoading={isLoading}
              horizontal={false}
              valueClassName="text-sm font-semibold text-white text-right"
              label="Rank"
              labelClassName="text-sm font-normal text-[#AAABB8] text-right"
              value={stakingDetails?.data?.nodeInfo?.rank + "/64" || "ddss"}
            /> */}
            <div className="flex justify-end">
              <div className="flex flex-col items-center gap-2">
                <Image
                  src={withBasePath("/assets/images/vizion/healthy.svg")}
                  alt="Severity 1"
                  width={74}
                  height={74}
                />
                <span className="whitespace-nowrap text-sm font-normal text-[#ffffff]">Health Check</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="col-span-10 p-5 lg:col-span-6">
        <FinancialsTransactionsArea />
      </div>
    </div>
  );
};

export default NodeMetricsCard;
