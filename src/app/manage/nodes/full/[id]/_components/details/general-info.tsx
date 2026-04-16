"use client";

import React from "react";
import NetworkNodeStatus from "@/components/status/status";
import type { NodeNetworkStates } from "@/types/node";
import { formatDate } from "@/utils/date";
import { toCapitalize } from "@/utils/helpers";
import { useUserStore } from "@/store/user";

interface GeneralInfoProps {
  data?: {
    node_name: string;
    status: string;
    created_on: string;
    network_type: string;
  };
  isLoading: boolean;
}

const GeneralInfo = ({ data, isLoading }: GeneralInfoProps) => {
  const user = useUserStore((s) => s.user);
  const ownedBy = user?.usercred || "NA";
  const createdOn = formatDate(data?.created_on) || "NA";
  const networkType = data?.network_type ? toCapitalize(String(data?.network_type)) : "NA";
  const generalName = data?.node_name || "NA";

  return (
    <div className="col-span-10 flex flex-col rounded-2xl border border-[#E1E1E14D] bg-white shadow-sm">
      <div className="flex items-center justify-between px-5 py-3 lg:px-6">
        <span className="text-[18px] font-semibold text-[#09122D]">General Information</span>
      </div>
      <div className="h-px w-full border-b border-[#E1E1E14D]" />

      <div className="grid grid-cols-1 gap-y-5 px-5 py-4 md:grid-cols-2 lg:grid-cols-5 lg:gap-y-0 lg:px-6 lg:py-5">
        <div className="min-w-0">
          <div className="text-sm font-medium text-[#7C8DB5]">Name</div>
          <div className="mt-1 truncate text-sm font-semibold text-[#09122D]">
            {isLoading ? "Loading..." : generalName}
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-[#7C8DB5]">Network Type</div>
          <div className="mt-1 truncate text-sm font-semibold text-[#09122D]">
            {isLoading ? "Loading..." : networkType}
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-[#7C8DB5]">Status</div>
          <div className="mt-1 flex items-center text-sm font-semibold text-[#09122D]">
            {isLoading ? "Loading..." : <NetworkNodeStatus status={data?.status as NodeNetworkStates} type="icon" />}
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-[#7C8DB5]">Owned By</div>
          <div className="mt-1 truncate text-sm font-semibold text-[#09122D]">{isLoading ? "Loading..." : ownedBy}</div>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-[#7C8DB5]">Created On</div>
          <div className="mt-1 truncate text-sm font-semibold text-[#09122D]">
            {isLoading ? "Loading..." : createdOn}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;
