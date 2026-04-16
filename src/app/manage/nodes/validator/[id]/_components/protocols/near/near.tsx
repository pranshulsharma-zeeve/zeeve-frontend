import React from "react";
import CloudInfra from "../../common/cloud-infra";
import GeneralInfo from "./_components/general-info";
import Uptime from "./_components/uptime";
import ValidatingStatus from "./_components/validating-status";
import usePlatformService from "@/services/platform/use-platform-service";
import { NetworkType } from "@/types/common";
import { NetworkInfo } from "@/store/network";
import { RpcNearMetricsDetailsResponse } from "@/services/platform/rpc/near-metrics";

const NearProtocol = ({ data, isLoading }: NetworkInfo) => {
  const agentId = data?.nodes[0]?.agent?.id ?? "";
  const accountId = data?.nodes[0]?.metaData?.accountId ?? "";
  const networkType = data?.nodes[0]?.metaData?.general?.networkType ?? "";
  const { data: rpcData } = usePlatformService().rpc.near(accountId, networkType as NetworkType);
  const { request: metricsData } = usePlatformService().rpc.metrics(
    agentId,
    data?.protocol?.id ?? (data?.protocol.id as string),
  );

  return (
    <div className="grid grid-cols-12 gap-2 text-brand-dark lg:gap-6">
      <GeneralInfo rpcData={rpcData} />
      <Uptime
        colorScheme={"dark"}
        metricsData={metricsData.data as unknown as RpcNearMetricsDetailsResponse}
        isLoading={isLoading}
      />
      <ValidatingStatus
        colorScheme={"dark"}
        metricsData={metricsData.data as unknown as RpcNearMetricsDetailsResponse}
        isLoading={isLoading}
      />
      <CloudInfra />
    </div>
  );
};

export default NearProtocol;
