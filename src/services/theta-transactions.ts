import useSWRImmutable from "swr/immutable";
import useFetcher from "@/hooks/use-fetcher";
import { withApiBasePath } from "@/constants/api";
import { ThetaTransactionsResponse } from "@/types/theta-transactions";

export interface ThetaTransactionsParams {
  nodeId: string;
  type?: number;
  pageNumber?: number;
  limitNumber?: number;
  isEqualType?: boolean;
  types?: string[];
}

const useThetaTransactionsAPI = (params: ThetaTransactionsParams | null) => {
  const shouldFetch = Boolean(params?.nodeId);

  const queryParams = new URLSearchParams();
  if (params) {
    queryParams.set("nodeId", params.nodeId);
    queryParams.set("type", (params.type ?? -1).toString());
    queryParams.set("pageNumber", (params.pageNumber ?? 1).toString());
    queryParams.set("limitNumber", (params.limitNumber ?? 20).toString());
    queryParams.set("isEqualType", (params.isEqualType ?? true).toString());
    queryParams.set("types", JSON.stringify(params.types ?? ["0", "2", "8", "9"]));
  }

  const url = shouldFetch ? withApiBasePath(`/account/transactions?${queryParams.toString()}`) : null;
  const fetcher = useFetcher();

  const request = useSWRImmutable<ThetaTransactionsResponse>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { ThetaTransactionsResponse };
export default useThetaTransactionsAPI;
