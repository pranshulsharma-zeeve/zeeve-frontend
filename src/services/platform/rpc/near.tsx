/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import useSWRImmutable from "swr/immutable";
import { handleError } from "../handle-error";
import { NetworkType } from "@/types/common";

type RpcNearApiDetailsResponse = {
  accountBalance: string;
  locked: string;
  publicKey: string;
} | null;

type Validator = {
  account_id: string;
  stake: string;
  num_expected_blocks?: number;
  last_block_height: number;
  uptime?: string;
  status: string;
};

const fetchAccountDetails = async (accountId: string, networkType: NetworkType) => {
  const RPC_URL = `https://rpc.${networkType}.near.org`;
  try {
    const { data } = await axios.post(RPC_URL, {
      jsonrpc: "2.0",
      id: "1",
      method: "query",
      params: {
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      },
    });
    return data.result;
  } catch (error) {
    return handleError("Failed to fetch account details", error);
  }
};

const fetchPublicKey = async (accountId: string, networkType: NetworkType) => {
  const RPC_URL = `https://rpc.${networkType}.near.org`;
  try {
    const { data } = await axios.post(RPC_URL, {
      jsonrpc: "2.0",
      id: "2",
      method: "query",
      params: {
        request_type: "view_access_key_list",
        finality: "final",
        account_id: accountId,
      },
    });
    return data.result.keys[0]?.public_key || "NA";
  } catch (error) {
    return handleError("Failed to fetch public key", error);
  }
};
const useRpcNearApi = (accountId: string | null | undefined, networkType: string | null | undefined) => {
  const fetcher = async () => {
    if (!accountId || !networkType) {
      return null;
    }
    try {
      const [accountDetails, publicKey] = await Promise.all([
        fetchAccountDetails(accountId, networkType as NetworkType),
        fetchPublicKey(accountId, networkType as NetworkType),
      ]);

      return {
        accountBalance: accountDetails.amount || "NA",
        locked: accountDetails.locked,
        publicKey,
      };
    } catch (error) {
      return handleError("Error fetching data from RPC Near API", error);
    }
  };

  const { data, error } = useSWRImmutable<RpcNearApiDetailsResponse>(
    accountId && networkType ? [accountId, networkType] : null,
    fetcher,
    { shouldRetryOnError: false },
  );

  return { data, error };
};

export type { RpcNearApiDetailsResponse, Validator };
export default useRpcNearApi;
