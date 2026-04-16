import useSWRImmutable from "swr/immutable";
import axios from "axios";

const BEARER_TOKEN = process.env.NEXT_PUBLIC_NODE_METRICS_BEARER_TOKEN || "";
export interface NodeMethodCount {
  node_name: string;
  method_count_sum: number;
  node_created_date: string;
}

export const useGetNodeMethodCounts = (range: number, isOptimisticUser?: boolean) => {
  const shouldFetch = Boolean(range) && isOptimisticUser;

  const { data, error, isLoading } = useSWRImmutable<NodeMethodCount[]>(
    shouldFetch ? `/api/method-count?range=${range}` : null,
    async (url: string) => {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });
      return response.data?.data?.nodes;
    },
  );

  return { data, error, isLoading };
};
