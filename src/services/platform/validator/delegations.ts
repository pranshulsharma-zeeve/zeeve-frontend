import useSWR from "swr";
import { resolveValidatorBase } from "./info";
import useFetcher from "@/hooks/use-fetcher";

interface DelegatorItem {
  delegatorAddress?: string;
  amount: string;
  denom: string;
  pctOfValidator: number;
}

interface ValidatorDelegationsData {
  items: DelegatorItem[];
  nextCursor: string | null;
}

interface ValidatorDelegationsResponse {
  success: boolean;
  data: ValidatorDelegationsData;
  message: string;
}

interface ValidatorDelegationsOptions {
  protocolId?: string;
  protocolName?: string;
  cursor?: string | null;
}

const buildUrl = (baseUrl: string, valoper: string, options?: ValidatorDelegationsOptions) => {
  const search = new URLSearchParams();
  if (options?.cursor) {
    search.set("cursor", options.cursor);
  }
  if (options?.protocolId) {
    search.set("protocolId", options.protocolId);
  }
  if (options?.protocolName) {
    search.set("protocolName", options.protocolName);
  }
  const query = search.toString();
  return `${baseUrl}/${encodeURIComponent(valoper)}/delegations${query ? `?${query}` : ""}`;
};

const useValidatorDelegationsAPI = (valoper?: string, options?: ValidatorDelegationsOptions) => {
  const fetcher = useFetcher();
  const baseUrl = resolveValidatorBase();
  const url = valoper ? buildUrl(baseUrl, valoper, options) : null;

  const request = useSWR<ValidatorDelegationsResponse>(url, (key: string) => fetcher(key), {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return {
    url,
    request,
  };
};

export type { DelegatorItem, ValidatorDelegationsData, ValidatorDelegationsResponse };
export type { ValidatorDelegationsOptions };
export default useValidatorDelegationsAPI;
