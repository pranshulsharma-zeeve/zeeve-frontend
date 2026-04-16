import useAxios from "@/hooks/use-axios";
import { withApiBasePath } from "@/constants/api";

// Lightweight, typed API surface centralized in one place.
export const useApi = () => {
  const { backendAxiosInstance } = useAxios();

  const rollups = {
    async checkStatus(env: { name: "testnet" | "mainnet" }, params: Record<string, unknown>) {
      // Placeholder: update once backend endpoints are available
      // return (await backendAxiosInstance.post('/api/rollups/status', { env, ...params })).data;
      return { status: "unknown" as const };
    },
  };

  const platform = {
    async userInfo() {
      const res = await backendAxiosInstance.get(withApiBasePath("/user-info"));
      return res.data;
    },
  };

  return { rollups, platform };
};

export type UseApi = ReturnType<typeof useApi>;
