"use client";
import React from "react";
import { Heading, Tooltip, Z4CopyButton } from "@zeeve-platform/ui";
import { OVERVIEW_INFO } from "@orbit/types/overview";
import { toShortString } from "@orbit/utils/helpers";
import InfoRow from "@orbit/components/info-row";
import { getL1TokenInfo, getWallets } from "@orbit/utils/network-overview";

type GeneralProps = {
  data?: OVERVIEW_INFO | undefined;
  isLoading: boolean;
};
const TokenInfo = ({ data, isLoading }: GeneralProps) => {
  const tokenInfo = getL1TokenInfo(data);
  const configuration = data?.user_inputs?.configuration;
  const tokenName = String(configuration?.token_name ?? "").trim() || "NA";
  const tokenSymbol = String(configuration?.token_symbol ?? "").trim() || "NA";
  const premineAmount = tokenInfo?.premineAmount ?? "NA";
  const premineAddress = tokenInfo?.premineAddress;
  const tokenType = tokenInfo?.type ?? "NA";

  // Get wallets data including native token address
  const wallets = getWallets(data);
  const nativeTokenAddress = wallets?.nativeToken;

  const isCustomGas = tokenType?.toLowerCase() === "custom";

  const renderAddressValue = (val?: string) => {
    if (!val || val === "NA") return "NA";

    return (
      <div className="flex gap-x-2">
        <Tooltip text={val} placement="top-start">
          <div className="flex items-center gap-2">{toShortString(val, 7, 10)}</div>
        </Tooltip>
        <Z4CopyButton text={val} />
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col rounded-lg bg-white p-6 lg:col-span-5">
      <Heading as="h5">Token Info</Heading>
      <div className="mt-8 grid grid-cols-12 gap-3 lg:gap-x-6 lg:gap-y-12">
        <InfoRow
          label="Token Name"
          value={tokenName}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6 lg:col-span-4"
        />
        <InfoRow
          label="Token Symbol"
          value={tokenSymbol}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6 lg:col-span-4"
        />
        {/* Show Premine Amount only if token type is Custom Gas */}
        {isCustomGas && (
          <InfoRow
            label="Premine Amount"
            value={premineAmount}
            isLoading={isLoading}
            className="col-span-12 md:col-span-6 lg:col-span-4"
          />
        )}
        {/* Show Premine Address only if token type is Custom Gas */}
        {isCustomGas && (
          <InfoRow
            label="Premine Address"
            value={
              premineAddress && premineAddress !== "NA" ? (
                <div className="flex items-center">
                  <div className="mr-2">{toShortString(premineAddress, 7, 7)}</div>
                  <Z4CopyButton text={premineAddress} />
                </div>
              ) : (
                "NA"
              )
            }
            isLoading={isLoading}
            className="col-span-12 md:col-span-6 lg:col-span-4"
          />
        )}
        <InfoRow
          label="Token Type"
          value={tokenType}
          isLoading={isLoading}
          className="col-span-12 md:col-span-6 lg:col-span-4"
        />
        {/* Show Native Token Address only if token type is Custom Gas */}
        {isCustomGas && (
          <InfoRow
            label="Native Token Address"
            value={renderAddressValue(nativeTokenAddress)}
            isLoading={isLoading}
            className="col-span-12 md:col-span-6 lg:col-span-4"
          />
        )}
      </div>
    </div>
  );
};

export default TokenInfo;
