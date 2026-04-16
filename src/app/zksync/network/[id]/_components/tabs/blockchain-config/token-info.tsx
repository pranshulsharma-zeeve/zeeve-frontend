"use client";
import { Heading } from "@zeeve-platform/ui";
import { useZkSyncDashboard } from "../dashboard-context";
import KeyValuePair from "@/components/key-value-pair";
import { formateNumber } from "@/utils/helpers";

const TokenInfo = () => {
  const { normalized, isLoading } = useZkSyncDashboard();
  return (
    <div
      className="col-span-12 flex h-full flex-col rounded-lg border border-brand-outline text-white"
      style={{
        backgroundImage: "linear-gradient(331.97deg, #1832AE 14.04%, #5875FF 103.6%)",
      }}
    >
      <div className="p-4">
        <Heading as="h4" className="text-white">
          Token Info
        </Heading>
      </div>
      <div className="grid grid-cols-12 gap-3 p-4 lg:gap-6">
        <KeyValuePair
          label="Token Name"
          value={
            normalized?.rollupMetadata?.tokenInfo?.customTokenInfo?.name
              ? normalized?.rollupMetadata?.tokenInfo?.customTokenInfo?.name
              : "NA"
          }
          isLoading={isLoading}
          className="border-none font-bold lg:col-span-12"
          labelClassName="text-white font-normal"
        />
        <KeyValuePair
          label="Token Symbol"
          value={
            normalized?.rollupMetadata?.tokenInfo?.customTokenInfo?.symbol
              ? normalized?.rollupMetadata?.tokenInfo?.customTokenInfo?.symbol
              : "NA"
          }
          isLoading={isLoading}
          className="border-none font-bold lg:col-span-12"
          labelClassName="text-white font-normal"
        />
        <KeyValuePair
          label="Token Decimals"
          value={
            normalized?.rollupMetadata?.tokenInfo?.customTokenInfo?.decimal
              ? formateNumber(normalized?.rollupMetadata?.tokenInfo?.customTokenInfo?.decimal, 10, "standard")
              : "NA"
          }
          isLoading={isLoading}
          className="border-none font-bold lg:col-span-12"
          labelClassName="text-white font-normal"
        />
        <KeyValuePair
          label="Token Type"
          value={
            normalized?.rollupMetadata?.tokenInfo?.tokenType ? normalized?.rollupMetadata?.tokenInfo?.tokenType : "NA"
          }
          isLoading={isLoading}
          className="border-none font-bold lg:col-span-12"
          labelClassName="text-white font-normal"
        />
      </div>
    </div>
  );
};

export default TokenInfo;
