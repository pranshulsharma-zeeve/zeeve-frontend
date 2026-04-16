import useSWRImmutable from "swr/immutable";
import { PlatformServiceError } from "../types";
import ROUTES from "@/routes";
import useFetcher from "@/hooks/use-fetcher";

interface UserInfoResponseData {
  first_name: string;
  last_name: string;
  usercred: string;
  email?: string | null;
  image_url?: string | null;
}

interface UserInfoResponse {
  success: boolean;
  data: UserInfoResponseData;
}

/** hook to use api */
const useUserInfoAPI = (isAuthenticated: boolean) => {
  const url = ROUTES.PLATFORM.API.USER_INFO;

  const fetcher = useFetcher();

  const request = useSWRImmutable<UserInfoResponse, PlatformServiceError>(isAuthenticated ? url : null, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { UserInfoResponseData, UserInfoResponse };
export default useUserInfoAPI;
