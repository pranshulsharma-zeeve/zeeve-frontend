"use client";
import React from "react";
import GenesisFile from "./genesis-file";
import CdkChainL2Config from "./cdk-chain-l2-config";
import CdkChainL1Config from "./cdk-chain-l1-config";
import DemoSupernetInfo from "@/components/demo-supernet-info";

const BlockchainConfig = () => {
  return (
    <div className="grid grid-cols-12 gap-3 text-brand-dark lg:gap-6">
      {/* <DemoSupernetInfo /> */}
      <CdkChainL2Config />
      {/* <CdkChainL1Config /> */}
      {/* <GenesisFile /> */}
    </div>
  );
};

export default BlockchainConfig;
