"use client";
import { Card } from "@zeeve-platform/ui";
import WalletCard from "./wallet-card";

const Wallets = () => {
  const wallets = [
    { name: "Admin", address: "0x8764...16B33A", l1Balance: "0.4998" },
    { name: "Batcher", address: "0x7016...C84402", l1Balance: "0.4952" },
    { name: "Proposer", address: "0x97826...aad548B", l1Balance: "0.4753" },
    { name: "Sequencer", address: "0x2a982...30cc012", l1Balance: "0" },
  ];
  return (
    <div className="grid grid-cols-12 gap-3 lg:gap-6">
      <Card className="col-span-12 border border-brand-yellow bg-brand-yellow/5 p-3 text-sm">
        This is a fully functional demo zkSync hyperchain testnet. This instance is available to all users.
      </Card>
      {wallets.map((w) => (
        <WalletCard key={w.name} {...w} />
      ))}
    </div>
  );
};

export default Wallets;
