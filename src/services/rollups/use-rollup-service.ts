import useSWRImmutable from "swr/immutable";
import useFetcher from "@/hooks/use-fetcher";
import useAxios from "@/hooks/use-axios";
import { withApiBasePath } from "@/constants/api";

export type RollupKey = "arbitrum-orbit" | "opstack" | "polygon-cdk" | "zksync";

export interface RollupServiceInfo {
  key: RollupKey;
  demo?: { available: boolean; id?: string | null };
  testnet?: { deployed: boolean; id?: string | null };
  mainnet?: { deployed: boolean; id?: string | null };
  // additional fields are allowed but not required
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface RollupTypeOption {
  value: string;
  label: string;
}

export interface RollupTypesResponse {
  settlementLayers: RollupTypeOption[];
  dataAvailabilityLayers: RollupTypeOption[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const useRollupService = () => {
  const fetcher = useFetcher();
  const { backendAxiosInstance } = useAxios();

  const services = (rollupKey: RollupKey) => {
    // Backend expects `type` for polygon-cdk specifically; others continue to work with `key`.
    const qp = rollupKey === "polygon-cdk" ? "type" : "key";
    const url = withApiBasePath(`/rollup/services?${qp}=${encodeURIComponent(rollupKey)}`);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const swr = useSWRImmutable<{ success: boolean; data: RollupServiceInfo }>(url, fetcher);
    return { url, request: swr };
  };

  const types = (rollupKey: RollupKey) => {
    const url = withApiBasePath(`/rollup/types?key=${encodeURIComponent(rollupKey)}`);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const swr = useSWRImmutable<{ success: boolean; data: RollupTypesResponse }>(url, fetcher);
    return { url, request: swr };
  };

  const deploy = () => {
    const url = withApiBasePath("/rollup/service/deploy");
    const request = async (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: any,
    ) => {
      const res = await backendAxiosInstance.post(url, body);
      return res.data;
    };
    return { url, request };
  };

  return { services, types, deploy };
};

export default useRollupService;
