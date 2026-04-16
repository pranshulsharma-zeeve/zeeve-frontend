/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { getConfig } from "@/config";
import useAxios from "@/hooks/use-axios";

type FinancialStatusRpcResponse = {
  success: boolean;
  data: {
    "Server Side Errors": GraphItem[];
    // eslint-disable-next-line prettier/prettier
    throughput: GraphItem[];
    "Block Height": GraphItem[];
    "Client Side Errors": GraphItem[];
    "Http Redirection": GraphItem[];
    "Successfull Responses": GraphItem[];
    "Informational Responses": GraphItem[];
  };
};

type GraphItem = {
  itemid: string;
  clock: string;
  value_avg: string;
  timestamp: string;
};

type FinancialRequestPayload = any;

const useFinancialRpcAPI = () => {
  const config = getConfig();
  const url = `${config?.url?.external?.vizion?.backend}/api/history/get-evm-financial-trend`;
  // const url = "https://vision-backend-test.zeeve.net//api/history/get-evm-financial-trend";

  const { backendAxiosInstance } = useAxios();

  /** api request */
  const request = backendAxiosInstance.post<
    FinancialStatusRpcResponse,
    AxiosResponse<FinancialStatusRpcResponse>,
    FinancialRequestPayload
  >;

  return {
    url,
    request,
  };
};

export type { FinancialStatusRpcResponse };
export default useFinancialRpcAPI;
