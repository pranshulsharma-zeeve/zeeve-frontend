"use client";
import Image from "next/image";
import React from "react";
import { Heading, Tooltip } from "@zeeve-platform/ui";
import { IconBoxSquare } from "@zeeve-platform/icons/delivery/outline";
import KeyValuePair from "@/components/key-value-pair";
import { toCapitalize, toShortString, withBasePath } from "@/utils/helpers";
import { explorerUrl } from "@/constants/dataAvailability";

const DataAvailabilityInfo = () => {
  const partner = "avail";

  return (
    <div className="col-span-12 flex flex-col rounded-lg border border-brand-outline md:col-span-6 lg:col-span-6 xl:col-span-5">
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h4">Data Availability Info</Heading>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 p-4 lg:gap-6">
        <KeyValuePair
          label="DA Name/Layer"
          value={
            <div className="flex flex-row items-center gap-3">
              <Image
                src={withBasePath(`/assets/images/protocol/partners/${partner}.png`)}
                alt={partner}
                width={15}
                height={15}
              />
              {toCapitalize(partner)}
            </div>
          }
          className="col-span-12 lg:col-span-6"
        />
        <KeyValuePair label="Network Type" value={"Turing testnet"} className="col-span-12 lg:col-span-6" />
        <KeyValuePair label="App ID" value={"16"} className="col-span-12 lg:col-span-6" />
        <KeyValuePair
          label={
            <span className="flex items-center space-x-2">
              <div className="text-sm text-gray-500">Explorer</div>
              <IconBoxSquare className="mr-2 text-brand-gray" />
            </span>
          }
          value={
            <Tooltip text={explorerUrl} placement="top-start">
              <div className="flex items-center gap-2">
                <a href={explorerUrl} target="_blank">
                  {toShortString(explorerUrl, 15, 11)}{" "}
                </a>
              </div>
            </Tooltip>
          }
          className="col-span-12 lg:col-span-6"
        />
      </div>
    </div>
  );
};

export default DataAvailabilityInfo;
