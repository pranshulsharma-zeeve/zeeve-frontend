"use client";

import React from "react";
import { formatDate } from "@/utils/date";
import KeyValuePair from "@/components/key-value-pair";
import { NetworkDetailsResponse } from "@/services/platform/protocol/details";
import NetworkNodeStatus from "@/components/status/status";
import type { NodeNetworkStates } from "@/types/node";
import { toCapitalize } from "@/utils/helpers";

interface GeneralInfoProps {
  data: NetworkDetailsResponse;
  isLoading: boolean;
}

const COREUM_PROTOCOL_ID = "60b0b934-a067-410e-a60f-c2a2c73b9b49";

const GeneralInfo = ({ data, isLoading }: GeneralInfoProps) => {
  const general = data?.nodes?.[0]?.metaData?.general;
  const networkMeta = data?.nodes?.[0]?.metaData?.network;
  const networkStatus = data?.network?.status as NodeNetworkStates | undefined;
  const paymentStatus = data?.network?.paymentStatus;
  const paymentText = paymentStatus === true ? "Success" : paymentStatus === false ? "Failed" : "NA";
  const ownedBy = networkMeta?.ownedBy || "NA";
  const createdOn = formatDate(data?.nodes?.[0]?.createdAt) || "NA";
  const networkType = general?.networkType ? toCapitalize(general.networkType) : "NA";

  return (
    <div className="col-span-10 flex flex-col rounded-2xl border border-[#E1E1E14D] bg-white shadow-sm">
      <div className="mt-2 flex items-center justify-between px-4 py-2">
        <span className="text-xl font-medium text-[#09122D]">General Information</span>
      </div>
      <div className="mb-2.5 flex flex-wrap justify-between p-3">
        <KeyValuePair
          label={"Name"}
          value={general?.name || "NA"}
          isLoading={isLoading}
          className="lg:col-span-6"
          enableBorder={false}
        />
        <KeyValuePair label={"Payment Status"} value={paymentText} isLoading={isLoading} enableBorder={false} />
        {data?.protocol?.id === COREUM_PROTOCOL_ID ? (
          <KeyValuePair label={"Network Type"} value={networkType} isLoading={isLoading} enableBorder={false} />
        ) : null}
        <KeyValuePair
          label={"Status"}
          value={<NetworkNodeStatus status={networkStatus} type="icon" />}
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
