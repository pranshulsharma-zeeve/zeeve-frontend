"use client";
import { Card, Button } from "@zeeve-platform/ui";

const BalanceChip = ({ eth }: { eth: string }) => (
  <span className="rounded border border-rose-400 bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600">
    {eth} ETH
  </span>
);

const WalletCard = ({ name, address, l1Balance }: { name: string; address: string; l1Balance: string }) => {
  return (
    <Card className="col-span-12 rounded-xl border border-brand-outline p-0 shadow-xl md:col-span-6 lg:col-span-4">
      <div className="flex flex-col gap-2 p-4">
        <div className="text-sm text-black/70">Name</div>
        <div className="text-base font-semibold">{name}</div>

        <div className="mt-2 text-sm text-black/70">Address</div>
        <div className="text-sm">{address}</div>

        <div className="mt-2 text-sm text-black/70">L1 Balance</div>
        <div>
          <BalanceChip eth={l1Balance} />
        </div>
      </div>
      <div className="rounded-b-xl bg-gradient-to-r from-[#5D13DF] to-[#1D1AE1] p-3 text-center text-white">
        <span className="font-medium">View on Explorer</span>
        <span className="ml-2 rounded border border-white/40 px-1.5 py-0.5 text-[10px]">L1</span>
      </div>
    </Card>
  );
};

export default WalletCard;
