"use client";
import React from "react";
import { Heading } from "@zeeve-platform/ui";
import { useZkSyncDashboard } from "../dashboard-context";
import KeyValuePair from "@/components/key-value-pair";
import { formateNumber } from "@/utils/helpers";

const TransactionMempool = () => {
  const { normalized, isLoading } = useZkSyncDashboard();
  const generalConfig = normalized?.rollupMetadata?.generalConfig;
  const mempool = generalConfig?.transactionMempool;
  const formatValue = (value?: string | number) => {
    if (value === undefined || value === null || value === "") return "NA";
    if (typeof value === "number") return formateNumber(value, 10, "standard");
    const trimmed = value.trim();
    if (!trimmed) return "NA";
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? trimmed : formateNumber(parsed, 10, "standard");
  };
  const timeoutMs = (() => {
    if (mempool?.stuckTransactionsTimeoutMs !== undefined && mempool.stuckTransactionsTimeoutMs !== null) {
      return mempool.stuckTransactionsTimeoutMs;
    }
    const timeoutRoot = generalConfig?.stuckTxTimeout;
    if (timeoutRoot !== undefined && timeoutRoot !== null && timeoutRoot !== "") {
      const parsed = typeof timeoutRoot === "number" ? timeoutRoot : Number(timeoutRoot);
      return Number.isNaN(parsed) ? timeoutRoot : parsed * 1000;
    }
    const fallback = mempool?.stuckTransactionsTimeoutSec;
    if (fallback === undefined || fallback === null || fallback === "") return undefined;
    const parsed = typeof fallback === "number" ? fallback : Number(fallback);
    return Number.isNaN(parsed) ? fallback : parsed * 1000;
  })();
  const removeStuckLabel = (() => {
    if (typeof generalConfig?.removeStuckTxs === "boolean") {
      return generalConfig.removeStuckTxs ? "Enabled" : "Disabled";
    }
    if (typeof mempool?.removeStuckTransactions === "boolean") {
      return mempool.removeStuckTransactions ? "Enabled" : "Disabled";
    }
    return "NA";
  })();

  return (
    <div className="col-span-12 flex flex-col rounded-lg border border-brand-outline md:col-span-6 lg:col-span-6 xl:col-span-6">
      <div className="p-4">
        <Heading as="h4">Transactions Mempool</Heading>
      </div>
      <div className="grid grid-cols-12 gap-3 p-4 lg:gap-6">
        <KeyValuePair
          className="col-span-12 border-none md:col-span-6"
          label="Stuck Transactions Timeout (ms)"
          value={formatValue(timeoutMs)}
          isLoading={isLoading}
        />
        <KeyValuePair
          className="col-span-12 border-none md:col-span-6"
          label="Remove Stuck Transactions"
          value={removeStuckLabel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default TransactionMempool;
