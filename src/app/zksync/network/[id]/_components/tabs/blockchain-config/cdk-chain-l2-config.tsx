"use client";
import { Heading, Z4DashboardCard } from "@zeeve-platform/ui";
import CdkChainL2TransactionConfig from "./cdk-chain-l2-transaction-config";
import CdkChainL2GasConfig from "./cdk-chain-l2-gas-config";

const CdkChainL2Config = () => {
  return (
    <div className="col-span-12 grid grid-cols-12 items-stretch gap-5">
      <Z4DashboardCard
        cardType="mainnet"
        className="col-span-12 flex h-full flex-col rounded-lg text-white lg:col-span-6"
      >
        <div className="p-4">
          <Heading as="h4" className="text-white">
            Transactions
          </Heading>
        </div>
        <div className="grid flex-1 grid-cols-12 gap-3 px-4 pb-4 pt-2 lg:gap-6">
          <CdkChainL2GasConfig />
        </div>
      </Z4DashboardCard>
      <div className="col-span-12 flex h-full flex-col gap-5 rounded-lg border border-brand-outline p-5 text-black lg:col-span-6">
        <div className="p-4">
          <Heading as="h4">Sequencer</Heading>
        </div>
        <div className="grid flex-1 grid-cols-12 gap-3 p-4 lg:gap-6">
          <CdkChainL2TransactionConfig />
        </div>
      </div>
    </div>
  );
};

export default CdkChainL2Config;
