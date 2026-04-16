"use client";

import React from "react";
import { formatDate } from "@/utils/date";
import KeyValuePair from "@/components/key-value-pair";
import NetworkNodeStatus from "@/components/status/status";
import type { NodeNetworkStates } from "@/types/node";
import { toCapitalize } from "@/utils/helpers";
import { useUserStore } from "@/store/user";

interface GeneralInfoProps {
  data: {
    name: string;
    networkType: string;
    createdAt: string;
    status: string;
  };
  isLoading: boolean;
}

const GeneralInfo = ({ data, isLoading }: GeneralInfoProps) => {
  const networkType = data.networkType ? toCapitalize(data.networkType) : "NA";
  const createdOn = formatDate(data.createdAt) || "NA";
  const user = useUserStore((s) => s.user);
  const ownedBy = user?.usercred || "NA";

  return (
    <div className="col-span-10 flex flex-col rounded-2xl border border-[#E1E1E14D] bg-white shadow-sm">
      <div className="mt-2 flex items-center justify-between px-4 py-2">
        <span className="text-xl font-medium text-[#09122D]">General Information</span>
      </div>
      <div className="mb-2.5 flex flex-wrap justify-between p-3">
        <KeyValuePair
          label={"Name"}
          value={data.name || "NA"}
          isLoading={isLoading}
          className="lg:col-span-6"
          enableBorder={false}
        />
        <KeyValuePair label={"Network Type"} value={networkType} isLoading={isLoading} enableBorder={false} />
        <KeyValuePair
          label={"Status"}
          value={<NetworkNodeStatus status={data.status as NodeNetworkStates} type="icon" />}
          isLoading={isLoading}
          enableBorder={false}
        />
        <KeyValuePair label={"Owned By"} value={ownedBy} isLoading={isLoading} enableBorder={false} />
        <KeyValuePair label={"Created On"} value={createdOn} isLoading={isLoading} enableBorder={false} />
      </div>
    </div>
  );
};

export default GeneralInfo;
