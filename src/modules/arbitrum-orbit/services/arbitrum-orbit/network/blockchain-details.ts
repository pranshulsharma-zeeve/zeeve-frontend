"use client";
import useSWRImmutable from "swr/immutable";
import { ArbitrumOrbitServiceError } from "../types";
import { SupportedRollupType, useResolvedRollupType } from "./rollup-type";
import { withApiBasePath } from "@/constants/api";
import useFetcher from "@orbit/hooks/use-fetcher";
import { GENERAL_WALLET_INFO, WALLET_INFO } from "@orbit/types/wallet-info";

type TokenBridgeContracts = {
  l1Contracts?: Record<string, string>;
  l2Contracts?: Record<string, string>;
  l3Contracts?: Record<string, string>;
};

type BlockchainArtifact = {
  name: string;
  is_json?: boolean;
  content?: {
    chainInfo?: Record<string, unknown>;
    coreContracts?: Record<string, string>;
    tokenBridgeContracts?: TokenBridgeContracts;
    [key: string]: unknown;
  };
};

type SmartContractArtifact = {
  name: string;
  address?: string;
  explorer?: string;
};

type SmartContractCollection = {
  l1?: SmartContractArtifact[];
  l2?: SmartContractArtifact[];
  l3?: SmartContractArtifact[];
};

type BlockchainDetailsResponsePayload = {
  success: boolean;
  data: {
    wallets?: WALLET_INFO[];
    wallet_details?: WALLET_INFO[];
    smartContracts?: SmartContractCollection;
    smart_contracts?: SmartContractCollection;
    deployer?: GENERAL_WALLET_INFO;
    governor?: GENERAL_WALLET_INFO;
    artifacts?: BlockchainArtifact[];
    [key: string]: unknown;
  } | null;
};

const useBlockchainDetails = (id: string | number | undefined, rollupType?: SupportedRollupType) => {
  const resolvedRollupType = useResolvedRollupType(rollupType);
  const params = new URLSearchParams();
  params.set("type", resolvedRollupType);
  if (id !== undefined && id !== null && `${id}`.length > 0) {
    params.set("service_id", `${id}`);
  }

  const url = id ? withApiBasePath(`/rollup_node/blockchain_details?${params.toString()}`) : null;

  const fetcher = useFetcher();

  const request = useSWRImmutable<BlockchainDetailsResponsePayload, ArbitrumOrbitServiceError>(url, fetcher, {
    shouldRetryOnError: false,
  });

  return {
    rollupType: resolvedRollupType,
    url,
    request,
  };
};

export type { SmartContractArtifact, SmartContractCollection, BlockchainDetailsResponsePayload, BlockchainArtifact };
export default useBlockchainDetails;
