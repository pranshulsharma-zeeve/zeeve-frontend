"use client";
import React from "react";
import DemoSupernetInfo from "@/components/demo-supernet-info";

const NotAvailable = () => {
  return (
    <div className="grid grid-cols-12 gap-3 text-brand-dark lg:gap-6">
      <DemoSupernetInfo />
      <div className="col-span-12 p-4 text-center text-brand-gray">Unavailable in testnet</div>
    </div>
  );
};

export default NotAvailable;
