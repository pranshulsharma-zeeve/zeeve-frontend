"use client";
import { Heading, Skeleton } from "@zeeve-platform/ui";
import { useMemo } from "react";
import { useZkSyncDashboard } from "../dashboard-context";

type TransactionConfigRowProps = {
  label: string;
  value?: string | number | null;
  isLoading: boolean;
};

const TransactionConfigRow = ({ label, value, isLoading }: TransactionConfigRowProps) => {
  const formattedValue = value ?? "NA";

  return (
    <div className="flex flex-col gap-1 bg-[#E8EBF7] px-5 py-4 text-brand-dark sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-[#696969]">{label}</span>
      {isLoading ? (
        <Skeleton role="status" as="div" className="w-32">
          <div className="h-3 w-full rounded-full bg-gray-200"></div>
        </Skeleton>
      ) : (
        <span className="text-sm font-semibold text-brand-dark">{formattedValue}</span>
      )}
    </div>
  );
};

const CdkChainL1TransactionConfig = () => {
  const { normalized, isLoading } = useZkSyncDashboard();
  const transactionConfig = useMemo(() => {
    const toRecord = (value: unknown): Record<string, unknown> | undefined => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return value as Record<string, unknown>;
      }
      return undefined;
    };
    const l1Metadata = toRecord(normalized?.rollupMetadata?.l1);
    const merged = [
      toRecord(l1Metadata?.config),
      toRecord(l1Metadata?.configs),
      toRecord(l1Metadata?.transactionConfig),
      l1Metadata,
      normalized?.blockchainConfig as Record<string, unknown> | undefined,
    ].reduce<Record<string, unknown> | undefined>((acc, candidate) => {
      if (!candidate) return acc;
      return acc ? { ...acc, ...candidate } : { ...candidate };
    }, undefined);
    return merged as Record<string, string | number | undefined> | undefined;
  }, [normalized?.rollupMetadata?.l1, normalized?.blockchainConfig]);

  const transactionConfigItems = [
    {
      label: "Forced Gas",
      value: transactionConfig?.forcedGas,
    },
    {
      label: "Gas Price Margin Factor",
      value: transactionConfig?.gasPriceMarginFactor,
    },
    {
      label: "Max Gas Price Limit",
      value: transactionConfig?.maxGasPriceLimitL1,
    },
    {
      label: "Frequency To Monitor Transactions",
      value: transactionConfig?.frequencyToMonitorTxs,
    },
    {
      label: "Wait Transaction To Be Mined",
      value: transactionConfig?.waitTxToBeMined,
    },
  ];

  return (
    <div className="mt-5 rounded-lg border border-brand-outline bg-white">
      {/* <div className="border-b border-brand-outline/60 bg-[#E8EBF7] px-5 py-3">
        <Heading as="h5" className="text-brand-dark">
          Transaction Config
        </Heading>
      </div> */}
      <div className="divide-y divide-brand-outline/40">
        {transactionConfigItems.map((item) => (
          <TransactionConfigRow key={item.label} label={item.label} value={item.value} isLoading={isLoading} />
        ))}
      </div>
    </div>
  );
};

export default CdkChainL1TransactionConfig;
