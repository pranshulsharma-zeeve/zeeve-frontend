"use client";
import React from "react";
import { Heading } from "@zeeve-platform/ui";
import { useParams } from "next/navigation";
import { OVERVIEW_INFO } from "@orbit/types/overview";
import InfoRow from "@orbit/components/info-row";

type GeneralProps = {
  data: OVERVIEW_INFO | undefined;
  isLoading: boolean;
};
const L1Info = ({ data, isLoading }: GeneralProps) => {
  useParams();
  const l1Info = data?.rollup_metadata?.l1;
  return (
    <div className="flex h-full flex-col rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <Heading as="h5">Ethereum Sepolia (L1) Info</Heading>
      </div>
      <div className="mt-6 grid grid-cols-12 flex-col gap-3 lg:gap-6">
        <InfoRow label="Name" value={l1Info?.name ?? "NA"} isLoading={isLoading} className="col-span-6" />
        <InfoRow
          label="Chain ID"
          textAlign="right"
          value={l1Info?.chainId ?? "NA"}
          isLoading={isLoading}
          className="col-span-6"
        />
      </div>
    </div>
  );
};

export default L1Info;
