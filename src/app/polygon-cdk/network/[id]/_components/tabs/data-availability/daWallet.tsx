"use client";
import React from "react";
import { CopyButton, Heading, Tooltip } from "@zeeve-platform/ui";
import KeyValuePair from "@/components/key-value-pair";
import { toShortString } from "@/utils/helpers";
import usePolygonValidiumService from "@/services/polygon-validium/use-polygon-validium-service";

interface DAWalletProp {
  address: string;
}

const DAWallet = ({ address }: DAWalletProp) => {
  const {
    request: { data: walletBalanceApiData, isLoading: isWalletBalanceAPILoading },
  } = usePolygonValidiumService().supernet.dAWalletBalance(address);

  return (
    <div className="col-span-12 flex flex-col rounded-lg border border-brand-outline xl:col-span-6 2xl:col-span-5">
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h4">DA Wallet</Heading>
        </div>
      </div>
      <div className="grid grid-cols-12 flex-col gap-3 p-4 lg:gap-6">
        <KeyValuePair
          label="Address"
          value={
            walletBalanceApiData ? (
              <Tooltip text={address} placement="top-start">
                <div className="flex items-center gap-2">
                  {toShortString(address, 7, 7)} <CopyButton text={address} />
                </div>
              </Tooltip>
            ) : (
              "NA"
            )
          }
          isLoading={isWalletBalanceAPILoading}
        />
        <KeyValuePair
          label="Balance"
          value={
            walletBalanceApiData ? (
              <Tooltip text={`${walletBalanceApiData.data.balance}`} placement={"top-start"}>
                <div>{`${walletBalanceApiData.data.balance} AVAIL`}</div>
              </Tooltip>
            ) : (
              "NA "
            )
          }
          isLoading={isWalletBalanceAPILoading}
        />
      </div>
    </div>
  );
};

export default DAWallet;
