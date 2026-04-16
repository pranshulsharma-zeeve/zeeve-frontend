"use client";
import { Card, Heading } from "@zeeve-platform/ui";

const offerings = [
  "A Nitro node for L3",
  "Smart contracts (Deployed on L2 & L3)",
  "An Arbitrum Sepolia node for L2 is provided",
  "An Ethereum Sepolia node for L1 is provided",
  "A bridge UI to do asset transactions between Layer L1, L2, and L3",
  "Block explorer to see transactions",
  "A DAS server in case of AnyTrust only",
];

export default function OfferingInfoCard() {
  return (
    <Card className="content-evenly gap-3 border border-brand-cyan p-3 text-brand-dark bg-brand-gradient-10 lg:gap-3 lg:p-3">
      <Heading as="h6" className="text-brand-red">
        What you get
      </Heading>
      <div className="px-1">
        {offerings.map((offering, index) => {
          return (
            <p key={index} className="flex flex-row items-center gap-3 text-sm">
              <span className="rounded-full bg-brand-primary p-1"></span>
              <span>{offering}.</span>
            </p>
          );
        })}
      </div>
    </Card>
  );
}
