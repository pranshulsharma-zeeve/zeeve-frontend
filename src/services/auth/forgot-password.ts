import { AxiosResponse } from "axios";
import { authAxiosInstance } from "@/utils/auth-axios";
import ROUTES from "@/routes";

type ForgotPasswordRequest = {
  email: string;
  client: "mobile";
  recaptcha?: string;
};

type ForgotPasswordResponse = {
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
};

const useForgotPasswordAPI = () => {
  const url = ROUTES.AUTH.API.FORGOT_PASSWORD;

  const request = authAxiosInstance.post<
    ForgotPasswordResponse,
    AxiosResponse<ForgotPasswordResponse>,
    ForgotPasswordRequest
  >;

  return {
    url,
    request,
  };
};

export type { ForgotPasswordRequest, ForgotPasswordResponse };
export default useForgotPasswordAPI;
