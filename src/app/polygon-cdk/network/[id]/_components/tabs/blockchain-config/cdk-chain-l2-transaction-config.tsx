"use client";
import { usePolygonCdkDashboard } from "../dashboard-context";
import InfoRow from "@/modules/arbitrum-orbit/components/info-row";

const CdkChainL2TransactionConfig = () => {
  const { normalized, isLoading } = usePolygonCdkDashboard();
  const transactionConfig = normalized?.blockchainConfig as Record<string, any> | undefined;

  const tokenInfoItems = [
    {
      label: "Sequencer Block Seal Time",
      value: transactionConfig?.blockSealTime,
      textAlign: "left" as const,
    },
    {
      label: "Sequencer Batch Seal Time",
      value: transactionConfig?.batchSealTime,
      textAlign: "sm:right" as const,
    },
    {
      label: "Allow Free Transactions",
      value: transactionConfig?.allowFreeTransactions,
      textAlign: "left" as const,
    },
    {
      label: "Allow Pre-eip 155 Transactions",
      value: transactionConfig?.allowPreEip155Transactions,
      textAlign: "sm:right" as const,
    },
  ];

  return (
    <div className="col-span-12 flex flex-col lg:col-span-12">
      <div className="grid grid-cols-1 gap-5 px-3 pb-4 sm:grid-cols-2">
        {tokenInfoItems.map((item) => (
          <InfoRow
            key={item.label}
            label={item.label}
            value={item.value ?? "NA"}
            isLoading={isLoading}
            textAlign={item.textAlign}
          />
        ))}
      </div>
    </div>
  );
};

export default CdkChainL2TransactionConfig;
