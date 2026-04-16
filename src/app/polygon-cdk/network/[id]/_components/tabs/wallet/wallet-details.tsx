"use client";
import React from "react";
import { CopyButton, Heading, IconButton, Tooltip } from "@zeeve-platform/ui";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import KeyValuePair from "@/components/key-value-pair";
import { convertNumber, toShortString } from "@/utils/helpers";

interface WalletDetailsProps {
  data: {
    name: string;
    address?: string;
    description: string;
    balance?: string;
    currency?: string;
    monthlyProjectedSpend?: string;
    explorerUrl?: string;
  };
  isLoading: boolean;
}
const WalletDetails = ({ isLoading, data }: WalletDetailsProps) => {
  return (
    <div className="col-span-12 flex flex-col justify-between rounded-lg border border-brand-outline lg:col-span-6">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Heading as="h4">{data?.name}</Heading>
          <Tooltip text={"View on explorer"} placement="top-start">
            <IconButton
              colorScheme={"primary"}
              variant={"ghost"}
              isDisabled={!data.explorerUrl}
              onClick={() => {
                if (data.explorerUrl) {
                  window.open(data.explorerUrl);
                }
              }}
            >
              <IconArrowUpRightFromSquare className="text-xl" />
            </IconButton>
          </Tooltip>
        </div>
        <p className="mt-1 text-sm text-brand-gray">{data?.description ?? "NA"}</p>
      </div>
      <div className="grid grid-cols-12 gap-3 p-4 lg:gap-6">
        <KeyValuePair
          label="Address"
          value={
            data?.address ? (
              <Tooltip text={data.address} placement="top-start">
                <div className="flex items-center">
                  <div className="mr-2">{toShortString(data.address, 7, 7)}</div>
                  <CopyButton text={data.address} />
                </div>
              </Tooltip>
            ) : (
              "NA"
            )
          }
          isLoading={isLoading}
          className="col-span-6 lg:col-span-5"
        />
        <KeyValuePair
          label="Balance"
          value={
            data?.balance ? (
              <Tooltip text={`${data.balance} ${data.currency}`} placement={"top-start"}>
                <div>
                  {convertNumber(data.balance)} {data.currency}
                </div>
              </Tooltip>
            ) : (
              "NA"
            )
          }
          isLoading={isLoading}
          className="col-span-6 lg:col-span-3"
        />
        <KeyValuePair
          label="Monthly Projected Spent"
          value={data?.monthlyProjectedSpend ? `${data.monthlyProjectedSpend}` : "NA"}
          isLoading={isLoading}
          className="col-span-6 lg:col-span-4"
        />
      </div>
    </div>
  );
};

export default WalletDetails;
