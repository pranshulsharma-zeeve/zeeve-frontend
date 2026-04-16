"use client";
import { Heading } from "@zeeve-platform/ui";
import { useZkSyncDashboard } from "../dashboard-context";
import KeyValuePair from "@/components/key-value-pair";
import { formateNumber } from "@/utils/helpers";

const GeneralConfig = () => {
  const { normalized, isLoading } = useZkSyncDashboard();
  const generalConfig = normalized?.rollupMetadata?.generalConfig;
  const daClient = generalConfig?.daClient;
  const formatValue = (value?: string | number) => {
    if (value === undefined || value === null || value === "") return "NA";
    if (typeof value === "number") return formateNumber(value, 10, "standard");
    const trimmed = value.trim();
    if (!trimmed) return "NA";
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? trimmed : formateNumber(parsed, 10, "standard");
  };
  const daClientStatus = (() => {
    if (typeof daClient === "string") return daClient;
    if (typeof daClient?.enabled === "boolean") return daClient.enabled ? "Enabled" : "Disabled";
    return "NA";
  })();
  const maxCircuitsValue = formatValue(
    typeof daClient === "string" ? generalConfig?.maxCircuitsPerBatch : daClient?.maxCircuitsPerBatch,
  );
  const pubdataSendingMode = generalConfig?.pubdataSendingMode ? generalConfig.pubdataSendingMode : "NA";
  return (
    <div className="col-span-12 flex h-full flex-col rounded-lg border border-brand-outline 2xl:col-span-6">
      <div className="p-4">
        <Heading as="h4">General Config</Heading>
      </div>
      <div className="flex flex-col gap-4 p-4">
        {/* <KeyValuePair
          label="Fair L2 Gas Price"
          value={
            data?.blockChainConfig?.chainStateKeeperFairL2GasPrice
              ? formatNumber(parseInt(data?.blockChainConfig?.chainStateKeeperFairL2GasPrice), "standard")
              : "NA"
          }
          isLoading={isLoading}
        /> */}
        <KeyValuePair className="border-none" label="DA Client" value={daClientStatus} isLoading={isLoading} />
        <KeyValuePair
          className="border-none"
          label="Max Circuits Per Batch"
          value={maxCircuitsValue}
          isLoading={isLoading}
        />
        <KeyValuePair
          className="border-none"
          label="Pub Data Sending Mode"
          value={pubdataSendingMode}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default GeneralConfig;
