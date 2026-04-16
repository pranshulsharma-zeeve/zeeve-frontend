import React from "react";
import { ButtonProps, Card, tx } from "@zeeve-platform/ui";
import CardKeyValuePair from "@/components/card-key-value-pair";
import { RpcNearMetricsDetailsResponse } from "@/services/platform/rpc/near-metrics";
import { removeDecimals } from "@/utils/helpers";

interface UptimeProps {
  isLoading?: boolean;
  metricsData?: RpcNearMetricsDetailsResponse;
  colorScheme?: ButtonProps["colorScheme"];
  classNames?: {
    main?: string;
    card?: string;
  };
}

const Uptime = ({ isLoading, colorScheme, classNames, metricsData }: UptimeProps) => {
  const formattedUptime = metricsData?.uptime === null ? "NA" : removeDecimals(metricsData?.uptime as string);
  return (
    <Card
      className={tx(
        "col-span-12 flex flex-col gap-2 p-0 border-0 lg:gap-3 lg:p-0 xl:col-span-6 2xl:col-span-3",
        classNames?.main,
      )}
    >
      <CardKeyValuePair
        colorScheme={colorScheme}
        label={"Node Uptime (In Seconds)"}
        value={formattedUptime}
        isLoading={isLoading}
        className={tx("lg:gap-3 p-6 w-full", classNames?.card)}
        as="h5"
      />
      <CardKeyValuePair
        colorScheme={colorScheme}
        label={"Block Height"}
        value={metricsData?.blockHeight ?? "NA"}
        isLoading={isLoading}
        className={tx("lg:gap-3 p-6 w-full", classNames?.card)}
        as="h5"
      />
    </Card>
  );
};

export default Uptime;
