import { AxiosResponse } from "axios";
import { useConfigStore } from "@/store/config";
import useAxios from "@/hooks/use-axios";

interface UserInfoResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

/** hook to use api */
const useVisionUserCreateAPI = () => {
  const { backendAxiosInstance } = useAxios();

  const config = useConfigStore((state) => state.config);

  const url = `${config?.url?.external?.platformOld?.backend}/api/create-user`;

  const request = backendAxiosInstance.get<UserInfoResponse, AxiosResponse<UserInfoResponse>>;
  return {
    url,
    request,
  };
};

export default useVisionUserCreateAPI;
