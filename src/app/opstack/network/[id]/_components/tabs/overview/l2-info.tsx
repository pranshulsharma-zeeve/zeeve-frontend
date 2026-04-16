"use client";
import React from "react";
import TokenInfo from "./token-info";
import { OVERVIEW_INFO } from "@orbit/types/overview";

type GeneralProps = {
  data: OVERVIEW_INFO | undefined;
  isLoading: boolean;
};
const L2Info = ({ data, isLoading }: GeneralProps) => {
  return (
    <div className="col-span-12 flex h-full flex-col rounded-lg shadow-sm xl:col-span-7 2xl:col-span-7">
      {/* <div
        className="rounded-t-lg bg-[#CDD4F7] p-6"
        style={{
          position: "relative",
        }}
      >
        <Image
          src={withBasePath(`/assets/images/protocol/l2-info-background.svg`)}
          alt="Background Image"
          width={75}
          height={120}
          className="absolute bottom-0 right-0 h-[120px] w-[75px]"
        />
        <Heading as="h5">Arbitrum Sepolia (L2) Info</Heading>
        <div className="mt-6 flex flex-col gap-2">
          <div className="grid grid-cols-12 gap-3 lg:gap-6">
            <InfoRow label="Name" value={data?.L2Info?.name} className="col-span-12 md:col-span-6 lg:col-span-4" />
            <InfoRow
              label="Chain ID"
              value={data?.L2Info?.chainId}
              className="col-span-12 md:col-span-6 lg:col-span-4"
            />
            <InfoRow
              label="Chain Type"
              value={data?.L2Info?.chainType ? toCapitalize(data?.L2Info?.chainType) : "NA"}
              isLoading={isLoading}
              className="col-span-12 md:col-span-6 lg:col-span-4"
            />
            <InfoRow
              label="Network Type"
              value={
                data?.generalInfo.environment
                  ? data?.generalInfo.environment == "devnet"
                    ? "TESTNET"
                    : toCapitalize(data?.generalInfo.environment, "all")
                  : "NA"
              }
              isLoading={isLoading}
              className="col-span-12 md:col-span-6 lg:col-span-4"
            />
            <InfoRow
              label="Block Time"
              value={data?.L2Info.blockTime ?? "NA"}
              isLoading={isLoading}
              className="col-span-12 md:col-span-6 lg:col-span-4"
            />
            <InfoRow
              label="Confirm Period in Block"
              value={data?.L2Info.confirmPeriodInBLock ?? "NA"}
              isLoading={isLoading}
              className="col-span-12 md:col-span-6 lg:col-span-4"
            />
          </div>
        </div>
      </div> */}
      <div className="h-full">
        <TokenInfo data={data} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default L2Info;
