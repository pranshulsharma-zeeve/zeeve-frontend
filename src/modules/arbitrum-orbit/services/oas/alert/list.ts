import { AxiosResponse } from "axios";
import { backendAxiosInstance } from "@orbit/utils/axios";
import ROUTES from "@orbit/routes";
import { getConfig } from "@/config";

interface RequestPayload {
  filter: Array<{
    fieldName: "blockchainProtocol" | "agentId" | string;
    compare: "equal" | "greater" | "less" | "strictEqual" | string;
    val: string;
  }>;
  sort: Array<{
    fieldName: "alertTimestamp";
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
  status: "firing" | "resolved" | string;
  alertName: string;
  job: string;
  severity: "warning" | "critical" | "info" | string;
  alertType: "blockchainProtocol" | "system" | string;
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

  /** api url */
  const url = `${config?.url?.external?.oas?.backend}${ROUTES.OAS.API.ALERTS}/list`;
  // const { backendAxiosInstance } = useAxios();

  /** api request */
  const request = backendAxiosInstance.post<ResponsePayload, AxiosResponse<ResponsePayload>, RequestPayload>;

  return {
    url,
    request,
  };
};

export type { Alert };
export default useAlertListAPI;
