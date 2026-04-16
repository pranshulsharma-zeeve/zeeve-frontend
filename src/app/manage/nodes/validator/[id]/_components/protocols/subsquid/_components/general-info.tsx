"use client";

import React from "react";
import { Card, CopyButton, Heading, Tooltip } from "@zeeve-platform/ui";
import { useParams } from "next/navigation";
import KeyValuePair from "@/components/key-value-pair";
import { divideValueByDecimals, formateNumber, toShortString } from "@/utils/helpers";
import Status from "@/components/status/status";
import { formatDate } from "@/utils/date";
import { Worker as WorkerType } from "@/types/worker";
import usePlatformService from "@/services/platform/use-platform-service";

const GeneralInfo = ({ worker }: { worker: WorkerType | undefined }) => {
  const params = useParams();
  const networkId = params.id as string;

  const {
    request: { data, isLoading },
  } = usePlatformService().network.overViewDetail(networkId);

  return (
    <Card className="col-span-12 flex flex-col gap-0 p-0 lg:gap-0 lg:p-0 xl:col-span-12 2xl:col-span-6">
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h4">General Info</Heading>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 p-4 lg:gap-6">
        <KeyValuePair
          isLoading={isLoading}
          label="Peer ID"
          className="lg:col-span-3"
          value={
            worker?.peerId ? (
              <Tooltip text={worker.peerId} placement={"top-start"}>
                <div className="flex items-center gap-2">
                  {toShortString(worker.peerId)}
                  <CopyButton text={worker.peerId} />
                </div>
              </Tooltip>
            ) : (
              "NA"
            )
          }
        />
        <KeyValuePair
          isLoading={isLoading}
          label={"Bonded"}
          className="lg:col-span-3"
          value={worker?.bond == null ? "NA" : `${divideValueByDecimals(worker?.bond, 18, 0)} SQD`}
        />
        <KeyValuePair
          isLoading={isLoading}
          label={"Worker APR"}
          className="lg:col-span-3"
          value={worker?.apr ? `${formateNumber(worker.apr, 2)}%` : "NA"}
        />
        <KeyValuePair
          isLoading={isLoading}
          label={"Version"}
          className="lg:col-span-3"
          value={worker?.version ?? "NA"}
        />

        <KeyValuePair
          isLoading={isLoading}
          label={"Status"}
          className="lg:col-span-3"
          value={<Status status={data?.network.status} type={"icon"} />}
        />
        <KeyValuePair
          isLoading={isLoading}
          label={"Total Rewards"}
          className="lg:col-span-3"
          value={
            worker?.claimableReward == null ? "NA" : `${divideValueByDecimals(worker?.claimableReward, 18, 5)} SQD`
          }
        />
        <KeyValuePair
          isLoading={isLoading}
          label={"Created On"}
          className="lg:col-span-6"
          value={formatDate(worker?.createdAt)}
        />
      </div>
    </Card>
  );
};

export default GeneralInfo;
