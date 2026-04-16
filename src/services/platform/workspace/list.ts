"use client";
import useSWRImmutable from "swr/immutable";
import { PlatformServiceError } from "../types";
import ROUTES from "@/routes";
import useFetcher from "@/hooks/use-fetcher";
import { useConfigStore } from "@/store/config";

interface WorkspaceListResponseData {
  id: string;
  name: string;
  networks: string;
  nodes: string;
  endpoints: number;
  members: number;
  ledgerApis: number;
  createdAt: string;
}

interface WorkspaceListResponse {
  success: boolean;
  data: WorkspaceListResponseData[];
}

/** hook to use workspace list api */
const useWorkspaceListAPI = () => {
  const config = useConfigStore((state) => state.config);

  const url = `${config?.url?.external?.platformOld?.backend}${ROUTES.OLD_PLATFORM.API.WORKSPACE}/list`;

  const fetcher = useFetcher();

  const request = useSWRImmutable<WorkspaceListResponse, PlatformServiceError>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    url,
    request,
  };
};

export type { WorkspaceListResponseData, WorkspaceListResponse };
export default useWorkspaceListAPI;
