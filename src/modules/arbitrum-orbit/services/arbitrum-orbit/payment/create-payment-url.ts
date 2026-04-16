/* eslint-disable prettier/prettier */
import { AxiosResponse } from "axios";
import ROUTES from "@orbit/routes";
import { backendAxiosInstance } from "@orbit/utils/axios";
import { NetworkEnvironment } from "@orbit/types/network";

interface CreatePaymentUrlRequest {
  environment: NetworkEnvironment;
  quantity: number;
}

interface CreatePaymentUrlResponseData {
  message: string;
  result: {
    redirectionUrl: string;
  };
}

interface CreatePaymentUrlResponse {
  success: boolean;
  data: CreatePaymentUrlResponseData;
}

const useCreatePaymentUrlAPI = () => {
  const url = ROUTES.ARBITRUM_ORBIT.API.PAYMENTS;
  const request = backendAxiosInstance.post<
    CreatePaymentUrlResponse,
    AxiosResponse<CreatePaymentUrlResponse>,
    CreatePaymentUrlRequest
  >;

  return {
    url,
    request,
  };
};

export type { CreatePaymentUrlRequest, CreatePaymentUrlResponse, CreatePaymentUrlResponseData };
export default useCreatePaymentUrlAPI;
