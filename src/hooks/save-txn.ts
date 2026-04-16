/* eslint-disable @typescript-eslint/no-explicit-any */
import { TxnMethods } from "@/types/network";
import usePlatformService from "@/services/platform/use-platform-service";
import { SaveTxnRequestPayload } from "@/services/vizion/save-txn";
// Define the supported networks

export const useSaveTxn = (nodeId: string) => {
  const { url: saveTxnUrl, request: saveTxnRequest } = usePlatformService().vizion.saveTxn(nodeId as string);

  const saveTxnHash = async (data: { txhash: string; method: TxnMethods }) => {
    try {
      console.log("inside saveTxnHash", data);
      const payload: SaveTxnRequestPayload = {
        transaction_hash: data.txhash,
        action: data.method,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await saveTxnRequest(saveTxnUrl, payload);
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const { error } = err.response.data;
      return error;
    }
  };

  return { saveTxnHash };
};
