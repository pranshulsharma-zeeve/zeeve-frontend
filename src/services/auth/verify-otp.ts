import { AxiosResponse } from "axios";
import ROUTES from "@/routes";
import { authAxiosInstance } from "@/utils/auth-axios";

type VerifyOTPRequest = {
  email: string;
  otp: string;
  client: "mobile";
};

type VerifyOTPResponse = {
  success: boolean;
  data?: {
    message?: string;
    user_id?: number;
    access_token?: string;
  };
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
};

const useVerifyOTPAPI = () => {
  const url = ROUTES.AUTH.API.VERIFY_OTP;

  const request = authAxiosInstance.post<VerifyOTPResponse, AxiosResponse<VerifyOTPResponse>, VerifyOTPRequest>;

  return {
    url,
    request,
  };
};

export type { VerifyOTPRequest, VerifyOTPResponse };
export default useVerifyOTPAPI;
