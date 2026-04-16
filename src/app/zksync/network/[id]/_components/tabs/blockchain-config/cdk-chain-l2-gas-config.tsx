/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Heading } from "@zeeve-platform/ui";
import { useZkSyncDashboard } from "../dashboard-context";
import InfoRow from "@/modules/arbitrum-orbit/components/info-row";

const CdkChainL2GasConfig = () => {
  const { normalized, isLoading } = useZkSyncDashboard();
  const l2Metadata = normalized?.rollupMetadata?.l2 as Record<string, any> | undefined;
  const gasConfigFromMetadata =
    (l2Metadata?.config as Record<string, any> | undefined) ??
    (l2Metadata?.configuration as Record<string, any> | undefined) ??
    (l2Metadata?.configs as Record<string, any> | undefined) ??
    (l2Metadata?.settings as Record<string, any> | undefined) ??
    l2Metadata;

  const gasConfig = (normalized?.blockchainConfig as Record<string, any> | undefined) ?? gasConfigFromMetadata;

  const gasConfigItems = [
    {
      label: "Default Gas Price",
      value: gasConfig?.defaultGasPrice,
      textAlign: "left" as const,
    },
    {
      label: "Gas Price Factor",
      value: gasConfig?.gasPriceFactor,
      textAlign: "right" as const,
    },
    // {
    //   label: "MinAllowed Gas Price Interval",
    //   value: gasConfig?.minAllowedGasPriceInterval,
    //   textAlign: "left" as const,
    // },
    // {
    //   label: "Poll Min Allowed Gas Price Interval",
    //   value: gasConfig?.pollMinAllowedGasPriceInterval,
    //   textAlign: "right" as const,
    // },
    // {
    //   label: "Interval To Refresh Gas Prices",
    //   value: gasConfig?.intervalToRefreshGasPrices,
    //   textAlign: "left" as const,
    // },
  ];

  return (
    <div className="col-span-12 flex flex-col gap-2 lg:col-span-12">
      {/* <div className="px-4 pt-2">
        <Heading as="h5" className="text-white">
          Gas Config
        </Heading>
      </div> */}
      <div className="grid grid-cols-1 gap-5 px-4 pb-4 pt-0 sm:grid-cols-2">
        {gasConfigItems.map((item) => (
          <InfoRow
            key={item.label}
            label={item.label}
            value={item.value ?? "NA"}
            isLoading={isLoading}
            textAlign={item.textAlign}
            valueClassName="text-white"
            labelClassName="text-white"
          />
        ))}
      </div>
    </div>
  );
};

export default CdkChainL2GasConfig;
