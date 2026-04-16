"use client";

import React from "react";
import { Card, Heading } from "@zeeve-platform/ui";
import KeyValuePair from "@/components/key-value-pair";
import { divideValueByDecimals, formateNumber } from "@/utils/helpers";
import { Worker as WorkerType } from "@/types/worker";

const Delegators = ({ worker }: { worker: WorkerType | undefined }) => {
  return (
    <Card className="col-span-12 flex flex-col gap-0 p-0 lg:gap-0 lg:p-0 xl:col-span-12 2xl:col-span-6">
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h4">Delegation</Heading>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 p-4 lg:gap-6">
        <KeyValuePair label="Delegators" value={worker?.delegationCount ?? "NA"} />
        <KeyValuePair
          label={"Total Delegations"}
          value={
            worker?.totalDelegation == null ? "NA" : `${divideValueByDecimals(worker?.totalDelegation, 18, 6)} SQD`
          }
        />
        <KeyValuePair
          label={"Delegation APR"}
          value={worker?.stakerApr ? `${formateNumber(worker.stakerApr, 2)}%` : "NA"}
        />
        <KeyValuePair
          label={"Delegation Rewards"}
          value={
            worker?.totalDelegationRewards == null
              ? "NA"
              : `${divideValueByDecimals(worker?.totalDelegationRewards, 18, 6)} SQD`
          }
        />
      </div>
    </Card>
  );
};

export default Delegators;
