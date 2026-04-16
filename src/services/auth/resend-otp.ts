import { AxiosResponse } from "axios";
import { authAxiosInstance } from "@/utils/auth-axios";
import ROUTES from "@/routes";

type ResendOTPRequest = {
  email: string;
  client: "mobile";
};

/** optional, check for status code */
type ResendOTPResponse = {
  success: boolean;
};

const useResendOTPAPI = () => {
  const url = ROUTES.AUTH.API.RESEND_OTP;

  const request = authAxiosInstance.post<ResendOTPResponse, AxiosResponse<ResendOTPResponse>, ResendOTPRequest>;

  return {
    url,
    request,
  };
};

export type { ResendOTPRequest, ResendOTPResponse };
export default useResendOTPAPI;
