import { AxiosResponse } from "axios";
import useAxios from "@/hooks/use-axios";
import { TxnMethods } from "@/types/network";
import { withApiBasePath } from "@/constants/api";

interface SaveTxnRequestPayload {
  transaction_hash: string;
  action: TxnMethods;
}

interface ResponsePayload {
  success: boolean;
}

/** hook to use save txn api */
const useSaveTxnAPI = (nodeId: string) => {
  const { backendAxiosInstance } = useAxios();
  /** api url */
  const url = withApiBasePath(`/validator/transactions?node_id=${nodeId}`);
  /** api request */
  const request = backendAxiosInstance.post<ResponsePayload, AxiosResponse<ResponsePayload>, SaveTxnRequestPayload>;

  return {
    url,
    request,
  };
};

export default useSaveTxnAPI;
export type { SaveTxnRequestPayload };
