import { AxiosResponse } from "axios";
import ROUTES from "@/routes";
import { backendAxiosInstance } from "@/utils/axios";

type OauthLoginResponse = {
  success: boolean;
  data: {
    authorization_url: string;
  };
  message: string;
};

const useOauthLoginAPI = () => {
  /** api url */
  const url = `${ROUTES.AUTH.API.OAUTH_LOGIN}`;

  /** api request */
  const request = backendAxiosInstance.get<OauthLoginResponse, AxiosResponse<OauthLoginResponse>>;

  return {
    url,
    request,
  };
};

export type { OauthLoginResponse };
export default useOauthLoginAPI;
