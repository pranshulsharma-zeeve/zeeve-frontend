import { AxiosResponse } from "axios";
import { authAxiosInstance } from "@/utils/auth-axios";
import ROUTES from "@/routes";

type LoginRequest = {
  email: string;
  password: string;
  client: "mobile";
  recaptcha?: string;
  serviceURL?: string;
};

type LoginResponseData = {
  access_token?: string;
  accessToken?: string;
  token?: string;
  bearer_token?: string;
  bearerToken?: string;
  refreshtoken?: string;
  refresh_token?: string;
};

type LoginResponse = {
  success: boolean;
  message?: string;
  data?: LoginResponseData;
  error?: {
    code: string;
    message: string;
  };
};

const useLoginAPI = () => {
  const url = ROUTES.AUTH.API.LOGIN;

  const request = authAxiosInstance.post<LoginResponse, AxiosResponse<LoginResponse>, LoginRequest>;

  return {
    url,
    request,
  };
};

export type { LoginRequest, LoginResponse, LoginResponseData };
export default useLoginAPI;
