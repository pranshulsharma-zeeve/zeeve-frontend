import { AxiosResponse } from "axios";
import ROUTES from "@/routes";
import { backendAxiosInstance } from "@/utils/axios";
import { getConfig } from "@/config";

interface RequestPayload {
  filter: Array<{
    fieldName: "blockchainProtocol" | "agentId";
    compare: "equal" | "greater" | "less" | "strictEqual";
    val: string;
  }>;
  sort: Array<{
    fieldName: "alertTimestamp";
    orderBy: "desc" | "asc";
  }>;
  meta: {
    pageNum: number;
    numRecords: number;
  };
}

type Alert = {
  alertId: number;
  userId: string;
  networkId: string;
  nodeId: string;
  agentId: string;
  status: "firing" | "resolved";
  alertName: string;
  job: string;
  severity: "warning" | "critical" | "info";
  alertType: "blockchainProtocol" | "system";
  blockchainProtocol: string;
  component: null | string;
  description: null | string;
  summary: string;
  startAt: string;
  endAt: string;
  alertTimestamp: string;
};

interface ResponsePayload {
  success: boolean;
  data: {
    results: Array<Alert>;
    meta: {
      pageNum: number;
      numRecords: number;
      totalNumRecords: number;
      hasMoreRecords: boolean;
    };
  };
}

/** hook to use alert list api */
const useAlertListAPI = () => {
  const config = getConfig();

  const url = `${config.url?.external?.oas?.backend}${ROUTES.OAS.API.ALERTS}/list`;
  const request = backendAxiosInstance.post<ResponsePayload, AxiosResponse<ResponsePayload>, RequestPayload>;

  return {
    url,
    request,
  };
};

export type { Alert };
export default useAlertListAPI;
