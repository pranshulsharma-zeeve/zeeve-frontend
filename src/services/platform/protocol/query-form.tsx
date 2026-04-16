import { AxiosResponse } from "axios";
import useAxios from "@/hooks/use-axios";

interface SubmitQueryRequestPayload {
  name: string;
  email: string;
  company_name?: string;
  type?: string;
  message: string;
}
interface ResponsePayload {
  success: boolean;
}

const useSubmitQueryAPI = () => {
  const { backendAxiosInstance } = useAxios();
  /** api url */
  const url = `/api/v1/contact-us`;
  /** api request */
  const request = backendAxiosInstance.post<ResponsePayload, AxiosResponse<ResponsePayload>, SubmitQueryRequestPayload>;

  return {
    url,
    request,
  };
};

export default useSubmitQueryAPI;
export type { SubmitQueryRequestPayload };
