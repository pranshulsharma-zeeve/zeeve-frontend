import { AxiosResponse } from "axios";
import { backendAxiosInstance } from "@/utils/axios";
import ROUTES from "@/routes";
import { getConfig } from "@/config";

interface RequestPayload {
  filter: Array<{
    fieldName: string;
    compare: "equal" | "greater" | "less" | "strictEqual" | string;
    val: string;
  }>;
  sort: Array<{
    fieldName: string;
    orderBy: "desc" | "asc" | string;
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
  status: string;
  alertName: string;
  job: string;
  severity: string;
  alertType: string;
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

const useAlertListAPI = () => {
  const config = getConfig();
  const url = `${config?.url?.external?.oas?.backend}${ROUTES.OAS.API.ALERTS}/list`;

  const request = backendAxiosInstance.post<ResponsePayload, AxiosResponse<ResponsePayload>, RequestPayload>;

  return {
    url,
    request,
  };
};

export type { Alert };
export default useAlertListAPI;
