import { AxiosResponse } from "axios";
import useAxios from "@/hooks/use-axios";
import { withApiBasePath } from "@/constants/api";

interface UploadImageRequestPayload {
  image: string;
}

interface ResponsePayload {
  success: boolean;
}

/** hook to use upload image api */
const useUploadImageAPI = () => {
  const { backendAxiosInstance } = useAxios();
  /** api url */
  const url = withApiBasePath(`/update_user_details`);
  /** api request */
  const request = backendAxiosInstance.post<ResponsePayload, AxiosResponse<ResponsePayload>, UploadImageRequestPayload>;

  return {
    url,
    request,
  };
};

export default useUploadImageAPI;
export type { UploadImageRequestPayload };
