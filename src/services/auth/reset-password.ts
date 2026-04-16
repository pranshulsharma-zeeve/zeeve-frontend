import { AxiosResponse } from "axios";
import { authAxiosInstance } from "@/utils/auth-axios";
import ROUTES from "@/routes";

type ResetPasswordRequest = {
  client: "mobile";
  password: string;
  confirmpass: string;
  otp: string;
};

type ResetPasswordResponse = {
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
};

const useResetPasswordAPI = () => {
  const url = ROUTES.AUTH.API.RESET_PASSWORD;

  const request = authAxiosInstance.post<
    ResetPasswordResponse,
    AxiosResponse<ResetPasswordResponse>,
    ResetPasswordRequest
  >;

  return {
    url,
    request,
  };
};

export type { ResetPasswordRequest, ResetPasswordResponse };
export default useResetPasswordAPI;
