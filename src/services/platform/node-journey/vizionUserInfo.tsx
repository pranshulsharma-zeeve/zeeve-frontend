import useSWRImmutable from "swr/immutable";
import useFetcher from "@/hooks/use-fetcher";
import { useConfigStore } from "@/store/config";

interface GetUserResponse {
  userDetails: {
    success: boolean;
    result: {
      jsonrpc: string;
      result: {
        userid: string;
        username: string;
      }[];
      id: number;
    };
  };
}

/** hook to call the get-user API */
const useVizionUserInfoAPI = () => {
  console.log("token----", localStorage.getItem("authToken")); // should log a real token
  const config = useConfigStore((state) => state.config);
  const url = `${config?.url?.external?.platformOld?.backend}/api/vizion/get-user-id`;
  const fetcher = useFetcher();

  /** api request */
  const request = useSWRImmutable<GetUserResponse>(url, fetcher, {
    shouldRetryOnError: false,
  });
  return {
    url,
    request,
  };
};

export default useVizionUserInfoAPI;
export type { GetUserResponse };
