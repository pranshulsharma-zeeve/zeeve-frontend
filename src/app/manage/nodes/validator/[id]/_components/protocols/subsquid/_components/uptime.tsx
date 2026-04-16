"use client";

import React from "react";
import { ButtonProps, Card, tx } from "@zeeve-platform/ui";
import CardKeyValuePair from "@/components/card-key-value-pair";
import { Worker } from "@/types/worker";
import { formateNumber } from "@/utils/helpers";

interface UptimeProps {
  isLoading?: boolean;
  colorScheme?: ButtonProps["colorScheme"];
  worker?: Worker;
  classNames?: {
    main?: string;
    card?: string;
  };
}

const Uptime = ({ worker, isLoading, colorScheme, classNames }: UptimeProps) => {
  return (
    <Card
      className={tx(
        "col-span-12 flex flex-col gap-2 p-0 border-0 lg:gap-3 lg:p-0 xl:col-span-6 2xl:col-span-3",
        classNames?.main,
      )}
    >
      <CardKeyValuePair
        colorScheme={colorScheme}
        label={"Uptime, 24h / 90d"}
        value={
          worker?.uptime24Hours && worker.uptime90Days
            ? `${formateNumber(worker.uptime24Hours, 2)}% / ${formateNumber(worker.uptime90Days, 2)}%`
            : "NA"
        }
        isLoading={isLoading}
        className={tx("lg:gap-3 p-6 w-full", classNames?.card)}
        as="h5"
      />
      <CardKeyValuePair
        colorScheme={colorScheme}
        label={"Queries, 24h / 90d"}
        value={
          worker?.queries24Hours && worker.queries90Days ? `${worker?.queries24Hours} / ${worker?.queries90Days}` : "NA"
        }
        isLoading={isLoading}
        className={tx("lg:gap-3 lg:p-6", classNames?.card)}
        as="h5"
      />
    </Card>
  );
};

export default Uptime;
