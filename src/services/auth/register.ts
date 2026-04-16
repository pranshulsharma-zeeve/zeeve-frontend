import { AxiosResponse } from "axios";
import { authAxiosInstance } from "@/utils/auth-axios";
import ROUTES from "@/routes";

type RegisterRequest = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  client: "mobile";
  recaptcha?: string;
  utm_information?: string;
};

type RegisterResponse = {
  success: boolean;
  data?: {
    user_id?: number;
  };
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
};

const useRegisterAPI = () => {
  const url = ROUTES.AUTH.API.REGISTER;

  const request = authAxiosInstance.post<RegisterResponse, AxiosResponse<RegisterResponse>, RegisterRequest>;

  return {
    url,
    request,
  };
};

export type { RegisterRequest, RegisterResponse };
export default useRegisterAPI;
