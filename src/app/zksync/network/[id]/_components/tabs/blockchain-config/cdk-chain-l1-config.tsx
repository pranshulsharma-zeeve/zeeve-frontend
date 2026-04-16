"use client";
import React from "react";
import { Heading } from "@zeeve-platform/ui";
import CdkChainL1TransactionConfig from "./cdk-chain-l1-transaction-config";

const CdkChainL1Config = () => {
  return (
    <div className="col-span-12 flex flex-col rounded-lg border bg-[#E8EBF7] p-5">
      <Heading as="h5" className="text-black">
        Transaction Config
      </Heading>
      <CdkChainL1TransactionConfig />
    </div>
  );
};

export default CdkChainL1Config;
