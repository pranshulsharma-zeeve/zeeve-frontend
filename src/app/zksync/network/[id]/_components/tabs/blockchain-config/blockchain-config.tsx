"use client";
import React from "react";
// import DemoSupernetInfo from "@/components/demo-supernet-info";
import RpcConfig from "../overview/rpc-config";
import TransactionMempool from "../overview/transaction-mempool";
import GeneralConfig from "./general-config";
import TokenInfo from "./token-info";
import BlockConfig from "./block-config";
import TransactionConfig from "./transaction-config";

const BlockchainConfig = () => {
  return (
    <div className="grid grid-cols-12 gap-3 text-brand-dark lg:gap-6">
      {/* <DemoSupernetInfo /> */}
      {/* <CdkChainL2Config />
      <CdkChainL1Config /> */}
      <div className="col-span-12 flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-6">
        <div className="size-full lg:flex-1">
          <TokenInfo />
        </div>
        <div className="size-full lg:flex-1">
          <GeneralConfig />
        </div>
        <div className="size-full lg:flex-1">
          <RpcConfig />
        </div>
        <div className="size-full lg:flex-1">
          <BlockConfig />
        </div>
      </div>
      <div className="col-span-12 flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-6">
        <div className="size-full lg:w-1/2">
          <TransactionConfig />
        </div>
        <div className="size-full lg:w-1/2">
          <TransactionMempool />
        </div>
      </div>
    </div>
  );
};

export default BlockchainConfig;
