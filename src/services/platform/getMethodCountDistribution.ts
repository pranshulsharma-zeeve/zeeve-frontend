import useSWRImmutable from "swr/immutable";
import axios from "axios";

const BEARER_TOKEN = process.env.NEXT_PUBLIC_NODE_METRICS_BEARER_TOKEN || "";
export interface MethodCountDistributionResponse {
  method_name: string;
  count: number;
}

export const useGetMethodCountDistribution = (nodeName: string, range: number, isOptimisticUser?: boolean) => {
  const shouldFetch = Boolean(nodeName && range) && isOptimisticUser;

  const { data, error, isLoading } = useSWRImmutable<MethodCountDistributionResponse[]>(
    shouldFetch ? `/api/method-count?node_name=${nodeName}&range=${range}` : null,
    async (url: string) => {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });
      return response.data?.data?.method_counts;
    },
  );

  return { data, error, isLoading };
};
