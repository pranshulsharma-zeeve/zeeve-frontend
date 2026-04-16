"use client";
import React from "react";
import { Heading, Tooltip, Z4CopyButton } from "@zeeve-platform/ui";
import { useParams } from "next/navigation";
import { OVERVIEW_INFO } from "@orbit/types/overview";
import { toShortString } from "@orbit/utils/helpers";
import InfoRow from "@orbit/components/info-row";
import { getWallets } from "@orbit/utils/network-overview";

type GeneralProps = {
  data: OVERVIEW_INFO | undefined;
  isLoading: boolean;
};
const AddressInfo = ({ data, isLoading }: GeneralProps) => {
  useParams();
  const wallets = getWallets(data);

  const items = [
    { label: "Batch Poster", key: "batchPoster" as const },
    { label: "Staker", key: "staker" as const },
    { label: "Owner", key: "owner" as const },
    { label: "Native Token", key: "nativeToken" as const },
  ];

  const renderValue = (val?: string) => {
    if (!val) return "NA";

    return (
      <Tooltip text={val} placement="top-start">
        <div className="flex items-center gap-2">
          {toShortString(val, 7, 10)}
          <Z4CopyButton text={val} />
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="flex h-full flex-col rounded-lg bg-white p-6 shadow-sm">
      <Heading as="h5">Address Info</Heading>

      {/* 1 col on small screens, 2 cols from md+ */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {items.map(({ label, key }) => (
          <InfoRow
            key={key}
            label={label}
            value={renderValue(wallets?.[key])}
            isLoading={isLoading}
            className="col-span-1"
          />
        ))}
      </div>
    </div>
  );
};

export default AddressInfo;
