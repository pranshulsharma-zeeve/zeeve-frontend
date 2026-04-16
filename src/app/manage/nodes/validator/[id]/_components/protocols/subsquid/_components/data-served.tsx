"use client";

import React from "react";
import { ButtonProps, Card, tx } from "@zeeve-platform/ui";
import CardKeyValuePair from "@/components/card-key-value-pair";
import { Worker } from "@/types/worker";
import { divideValueByDecimals } from "@/utils/helpers";

interface DataServedProps {
  isLoading?: boolean;
  colorScheme?: ButtonProps["colorScheme"];
  worker?: Worker;
  classNames?: {
    main?: string;
    card?: string;
  };
}

const DataServed = ({ worker, isLoading, colorScheme, classNames }: DataServedProps) => {
  return (
    <Card
      className={tx(
        "col-span-12 flex flex-col gap-2 p-0 border-0 lg:gap-3 lg:p-0 xl:col-span-6 2xl:col-span-3",
        classNames?.main,
      )}
    >
      <CardKeyValuePair
        colorScheme={colorScheme}
        label={"Data served, 24h / 90d"}
        value={
          worker?.servedData24Hours && worker.servedData90Days
            ? `${divideValueByDecimals(worker.servedData24Hours, 9, 0)} GB / ${divideValueByDecimals(
                worker?.servedData90Days,
                9,
                0,
              )} GB`
            : "NA"
        }
        isLoading={isLoading}
        className={tx("lg:gap-3 lg:p-6", classNames?.card)}
        as="h5"
      />
      <CardKeyValuePair
        colorScheme={colorScheme}
        label={"Data stored"}
        value={worker?.storedData ? `${divideValueByDecimals(worker.storedData, 9, 0)} GB` : "NA"}
        isLoading={isLoading}
        className={tx("lg:gap-3 lg:p-6", classNames?.card)}
        as="h5"
      />
    </Card>
  );
};

export default DataServed;
