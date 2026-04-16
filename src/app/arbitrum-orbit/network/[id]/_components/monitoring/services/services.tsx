"use client";
import React from "react";
import AlertsCard from "../alerts/alerts-card";
import CoreRollupServices from "./core-rollup-services";
import DacRollupServices from "./dac-rollup";
import RpcRollupServices from "./rpc-rollup";
import ToolsRollupServices from "./tools-rollup";

const ServiceCard = ({ className }: { className?: string }) => {
  return (
    <div className={`${className} h-full rounded-2xl border border-[#E1E1E1] bg-white p-0 font-semibold`}>
      <p className="px-7 pb-2 pt-5 text-xl font-medium text-black lg:text-xl">Services Status</p>

      {/* Scrollable Content Wrapper */}
      <div className="h-full p-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
          <div className="flex-[2]">
            <CoreRollupServices />
          </div>
          <div className="flex-[2]">
            <RpcRollupServices />
          </div>
          <div className="flex">
            <ToolsRollupServices />
          </div>
          {/* <div className="flex-1">
            <DacRollupServices />
          </div> */}
        </div>
        {/* <div className="mt-4 flex flex-col lg:flex-row">
          <ToolsRollupServices />
        </div> */}
        <div className="mx-1 mt-8 border-t border-[#E1E1E1]" />
        <AlertsCard
          className="col-span-12"
          recordsPerPage={5}
          headerFontSize="text-sm"
          rowFontSize="text-xs"
          rowPadding="px-4 py-3"
          headerPadding="px-4 py-2"
        />
      </div>
    </div>
  );
};

export default ServiceCard;
