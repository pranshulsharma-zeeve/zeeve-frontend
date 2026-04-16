import useSWRImmutable from "swr/immutable";
import { PlatformServiceError } from "../types";
import useFetcher from "@/hooks/use-fetcher";
import { useConfigStore } from "@/store/config";

interface UserDetails {
  success: boolean;
  token: string;
  hostData: HostData[];
  username: string;
}

interface HostData {
  protocolName?: string;
  nodeName: string;
  hostIds: string[];
  indentifierType?: string;
  protocolType: string;
  primaryHost: string;
}

interface UserInfoResponse {
  userDetails: UserDetails;
}

/** hook to use api */
const useVisionUserInfoAPI = () => {
  const config = useConfigStore((state) => state.config);

  const url = `${config?.url?.internal?.backend}/vizion/get-user`;

  const fetcher = useFetcher();

  const request = useSWRImmutable<UserInfoResponse, PlatformServiceError>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { UserDetails, HostData, UserInfoResponse };
export default useVisionUserInfoAPI;
