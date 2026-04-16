"use client";
import React, { useMemo } from "react";
import { Heading } from "@zeeve-platform/ui";
import { useZkSyncDashboard } from "../dashboard-context";
import KeyValuePair from "@/components/key-value-pair";
import { formateNumber } from "@/utils/helpers";

const RpcConfig = () => {
  const { normalized, isLoading } = useZkSyncDashboard();
  const generalConfig = normalized?.rollupMetadata?.generalConfig;
  const rpcConfig = generalConfig?.rpcConfig;
  const apiNamespaceList = useMemo(() => {
    const namespaces = generalConfig?.apiNamespaces ?? rpcConfig?.apiNamespaces;
    if (Array.isArray(namespaces)) {
      return namespaces.map((item) => String(item).trim()).filter(Boolean);
    }
    if (typeof namespaces === "string") {
      const trimmed = namespaces.trim();
      if (!trimmed) return [];
      return trimmed
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return [];
  }, [generalConfig?.apiNamespaces, rpcConfig?.apiNamespaces]);
  const apiNamespaces =
    apiNamespaceList.length > 0 ? (
      <div className="mt-1 flex flex-wrap gap-2">
        {apiNamespaceList.map((namespace) => (
          <span key={namespace} className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            {namespace}
          </span>
        ))}
      </div>
    ) : (
      "NA"
    );
  const formatScale = (value?: string | number) => {
    if (value === undefined || value === null || value === "") return "NA";
    if (typeof value === "number") return formateNumber(value, 6, "standard");
    const trimmed = value.trim();
    if (!trimmed) return "NA";
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? trimmed : formateNumber(parsed, 6, "standard");
  };

  return (
    <div className="col-span-12 flex h-full flex-col rounded-lg border border-brand-outline">
      <div className="p-4">
        <Heading as="h4">RPC Config</Heading>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <KeyValuePair className="border-none" label="API Namespaces" value={apiNamespaces} isLoading={isLoading} />
        <KeyValuePair
          className="border-none"
          label="Gas Price Scale Factor"
          value={formatScale(generalConfig?.gasPriceScaleFactor ?? rpcConfig?.gasPriceScaleFactor)}
          isLoading={isLoading}
        />
        <KeyValuePair
          className="border-none"
          label="Estimate Gas Scale Factor"
          value={formatScale(generalConfig?.estimateGasScaleFactor ?? rpcConfig?.estimateGasScaleFactor)}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default RpcConfig;
