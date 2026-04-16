"use client";

import React from "react";
import { ButtonProps, Card, tx } from "@zeeve-platform/ui";
import CardKeyValuePair from "@/components/card-key-value-pair";
import { RpcNearMetricsDetailsResponse } from "@/services/platform/rpc/near-metrics";

interface ValidatingStatusProps {
  isLoading?: boolean;
  colorScheme?: ButtonProps["colorScheme"];
  metricsData?: RpcNearMetricsDetailsResponse;
  classNames?: {
    main?: string;
    card?: string;
  };
}

const ValidatingStatus = ({ isLoading, colorScheme, classNames, metricsData }: ValidatingStatusProps) => {
  return (
    <Card
      className={tx(
        "col-span-12 flex flex-col gap-2 p-0 border-0 lg:gap-3 lg:p-0 xl:col-span-6 2xl:col-span-3",
        classNames?.main,
      )}
    >
      <CardKeyValuePair
        colorScheme={colorScheme}
        label={"Validating Status"}
        value={metricsData?.validatingStatus ?? "NA"}
        isLoading={isLoading}
        className={tx("lg:gap-3 p-6 w-full", classNames?.card)}
        as="h5"
      />
      <CardKeyValuePair
        colorScheme={colorScheme}
        label={"Peers"}
        value={metricsData?.peer ?? "NA"}
        isLoading={isLoading}
        className={tx("lg:gap-3 p-6 w-full", classNames?.card)}
        as="h5"
      />
    </Card>
  );
};

export default ValidatingStatus;
