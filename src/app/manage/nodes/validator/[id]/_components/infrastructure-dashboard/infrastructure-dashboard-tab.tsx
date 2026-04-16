"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import NodeMetricsCard from "../infrastructure-dashboard/node-metrics/node-metrics-card";
import SecurityRpcMonitoringCard from "./security-monitoring/security";
import AlertsRpcCard from "./alerts/alerts-card";
import GeneralInfo from "./general-info/general-info";
import type { ValidatorDetailResponse } from "@/services/vizion/validator-details";
import type { ValidatorNodeResponse } from "@/services/vizion/validator-node-details";
import type { RestakeInfoResponse } from "@/services/vizion/restake-info";
import type { NodeDetailsResponse } from "@/services/platform/network/node-details";
import type { ProtocolDataResponse } from "@/services/vizion/protocol-latest-data";
import usePlatformService from "@/services/platform/use-platform-service";
import { useVisionUserStore } from "@/store/vizionUser";
import { getCookie } from "@/utils/cookies";
import HTTP_STATUS from "@/constants/http";

interface InfrastructureDashboardTabProps {
  protocolName?: string;
  createdAt?: string;
  validatorData?: ValidatorDetailResponse;
  validatorNodeDetails?: ValidatorNodeResponse;
  restakeDataRequest?: RestakeInfoResponse;
  nodeDetails?: NodeDetailsResponse;
  isLoading: boolean;
}

const InfrastructureDashboardTab = ({
  protocolName,
  createdAt,
  validatorData,
  validatorNodeDetails,
  restakeDataRequest,
  nodeDetails,
  isLoading,
}: InfrastructureDashboardTabProps) => {
  const params = useParams();
  const networkId = params.id as string;
  const [protocolData, setProtocolData] = useState<ProtocolDataResponse>();
  const vizionUser = useVisionUserStore((state) => state.visionUser);
  const queryToken = useSearchParams().get("token");
  const token = queryToken ?? getCookie("token");
  const networkCreatedAt = createdAt ?? "";

  const { url: protocolDataUrl } = usePlatformService().vizion.protocolData(protocolName);

  const buildInfraRequestDetails = () => {
    if (!vizionUser) {
      console.warn("[InfrastructureDashboard] Missing vizion user context, skip data fetch.", { networkId });
      return null;
    }
    const hostList = Array.isArray(vizionUser.hostData) ? vizionUser.hostData : [];
    if (!hostList.length) {
      console.warn("[InfrastructureDashboard] vizion user has no host data", { vizionUser, networkId });
      return null;
    }
    const protocolHost = hostList.find((host) => host.networkId === networkId);
    if (!protocolHost) {
      console.warn("[InfrastructureDashboard] Unable to locate host entry for network", { networkId, hostList });
      return null;
    }
    const hostIds = (protocolHost.hostIds ?? []).filter(Boolean);
    const primaryHost = protocolHost.primaryHost;
    if (!hostIds.length || !primaryHost) {
      console.warn("[InfrastructureDashboard] Missing host identifiers for vizion data fetch", {
        networkId,
        hostIdsLength: hostIds.length,
        primaryHost,
      });
      return null;
    }

    return {
      payload: {
        hostIds,
        primaryHost,
        range: "24h",
        currentTime: new Date().toISOString(),
      },
      headers: {
        Authorization: `Bearer ${vizionUser?.token ?? token ?? ""}`,
        "Content-Type": "application/json",
      },
      context: {
        networkId,
        hostIdsLength: hostIds.length,
        primaryHost,
      },
    };
  };

  const getProtocolData = async () => {
    try {
      if (!protocolDataUrl) {
        console.warn("[InfrastructureDashboard] Missing protocol data url, skip fetch.", { networkId });
        return;
      }
      const requestDetails = buildInfraRequestDetails();
      if (!requestDetails) return;
      const { payload, headers, context } = requestDetails;

      const response = await axios.post(protocolDataUrl, payload, {
        headers,
      });
      if (response.status === HTTP_STATUS.OK) {
        setProtocolData(response.data);
      }
    } catch (error) {
      console.log(error, "in error fetching protocol data");
    }
  };

  useEffect(() => {
    getProtocolData();
    console.log("Fetching protocol data for network:", networkId);
  }, [networkId, vizionUser, protocolDataUrl, token]);

  // Transform nodeDetails to match GeneralInfo expected structure
  const generalInfoData = nodeDetails
    ? {
        name: nodeDetails.data?.node_name || "N/A",
        networkType: nodeDetails?.data?.network_type || "N/A",
        ownedBy: "N/A",
        createdAt: nodeDetails.data?.created_on || "N/A",
        status: nodeDetails.data?.status || "N/A",
      }
    : undefined;

  const planType = nodeDetails?.data?.plan_name;

  return (
    <div className="flex flex-col gap-6">
      {/* <RenderProtocol
        protocolName={protocolName}
        validatorData={validatorData}
        validatorNodeDetails={validatorNodeDetails}
        restakeDataRequest={restakeDataRequest}
      /> */}
      {generalInfoData && <GeneralInfo data={generalInfoData} isLoading={isLoading} />}
      <div className="grid grid-cols-10 gap-2 text-brand-dark lg:gap-5">
        <NodeMetricsCard protocolData={protocolData} networkId={networkId} protocol={protocolName} />
        <SecurityRpcMonitoringCard createdAt={networkCreatedAt} plan={planType} />
        <AlertsRpcCard />
      </div>
    </div>
  );
};
export default InfrastructureDashboardTab;
