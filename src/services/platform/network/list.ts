import useSWRImmutable from "swr/immutable";
import ROUTES from "@/routes";
import useAxios from "@/hooks/use-axios";
import type {
  SubscriptionListResponse,
  SubscriptionListData,
  SubscriptionRecord,
} from "@/services/platform/subscription/list";

type NetworkListResponseData = SubscriptionRecord;
type NodesListResponseData = SubscriptionListData;
type NodeListResponse = SubscriptionListResponse;

const useNetworkListAPI = (type: "validator" | "full" | "archive", page: number, size: number) => {
  const { backendAxiosInstance } = useAxios();
  const nodeTypeParam = type === "full" ? "rpc" : type;
  const url = `${ROUTES.PLATFORM.API.NODE_SUBSCRIPTION_LIST}?node_type=${nodeTypeParam}&page=${page}&size=${size}`;

  const request = useSWRImmutable<NodeListResponse>(
    url,
    async (key: string) => {
      const { data } = await backendAxiosInstance.get<NodeListResponse>(key);
      return data;
    },
    { shouldRetryOnError: false },
  );

  return { url, request };
};

export type { NetworkListResponseData, NodesListResponseData, NodeListResponse };
export default useNetworkListAPI;
