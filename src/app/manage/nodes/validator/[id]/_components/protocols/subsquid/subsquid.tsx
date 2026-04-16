import React from "react";
import { useSuspenseQuery } from "@apollo/client";
import CloudInfra from "../../common/cloud-infra";
import DataServed from "./_components/data-served";
import Delegators from "./_components/delegators";
import Uptime from "./_components/uptime";
import GeneralInfo from "./_components/general-info";
import { WorkerQueryResponse } from "@/types/worker";
import workerQuery from "@/services/platform/queries";
import { NetworkInfo } from "@/store/network";

const SubsquidProtocol = ({ data }: NetworkInfo) => {
  const peerId = data?.nodes[0].metaData.peerId ?? "NA";
  const { data: workerData } = useSuspenseQuery<WorkerQueryResponse>(workerQuery(peerId));
  const worker = workerData.workers[0];

  return (
    <div className="grid grid-cols-12 gap-2 text-brand-dark lg:gap-6">
      <GeneralInfo worker={worker} />
      <Uptime colorScheme={"dark"} worker={worker} />
      <DataServed colorScheme={"dark"} worker={worker} />
      <Delegators worker={worker} />
      <CloudInfra />
    </div>
  );
};

export default SubsquidProtocol;
