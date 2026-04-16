// services/platform/protocol/change-password.ts

import { AxiosResponse } from "axios";
import ROUTES from "@/routes";
import useAxios from "@/hooks/use-axios";

type ChangePasswordParams = {
  protocolId: string;
  networkId: string;
  validatorPassword: string;
};

type ChangePasswordResponse = {
  success: boolean;
  data: {
    message: string;
  };
};

const useChangePasswordAPI = ({ protocolId, networkId, validatorPassword }: ChangePasswordParams) => {
  const { backendAxiosInstance } = useAxios();

  const url = `${ROUTES.PLATFORM.API.NODE_JOURNEY_NETWORKS}/${networkId}?action=change-password&protocolId=${protocolId}`;

  const request = () =>
    backendAxiosInstance.post<ChangePasswordResponse, AxiosResponse<ChangePasswordResponse>>(url, {
      password: validatorPassword,
    });

  return {
    url,
    request,
  };
};

export type { ChangePasswordResponse };
export default useChangePasswordAPI;
