"use client";

import { useParams } from "next/navigation";
import SmartContractsTable from "./smart-contracts-table";
import useArbitrumOrbitService from "@orbit/services/arbitrum-orbit/use-arbitrum-orbit-service";
import { BlockchainArtifact } from "@orbit/services/arbitrum-orbit/network/blockchain-details";
import {
  getSettlementLayer,
  getL1ExplorerUrl,
  getL2ExplorerUrl,
  getL3ExplorerUrl,
} from "@orbit/utils/network-overview";

type SmartContractRow = { name: string; address: string };

const extractContractsFromArtifacts = (artifacts?: BlockchainArtifact[]) => {
  const artifactContent = artifacts?.find(
    (artifact) => artifact.is_json && artifact.content && artifact.name?.toLowerCase().includes("contract"),
  )?.content;
  if (!artifactContent) {
    return { l2: undefined, l3: undefined };
  }
  const mapContracts = (contracts?: Record<string, string>) =>
    contracts ? Object.entries(contracts).map(([name, address]) => ({ name, address })) : [];

  const l2Contracts = mapContracts(artifactContent.tokenBridgeContracts?.l2Contracts);
  const l3Contracts = mapContracts(artifactContent.tokenBridgeContracts?.l3Contracts);
  // const l3Contracts = [
  //   ...mapContracts(artifactContent.coreContracts),
  //   ...mapContracts(artifactContent.tokenBridgeContracts?.l3Contracts),
  // ];

  return {
    l2: l2Contracts.length ? l2Contracts : undefined,
    l3: l3Contracts.length ? l3Contracts : undefined,
  };
};

const toSmartContractRows = (list?: Array<{ name?: string; address?: string }>): SmartContractRow[] | undefined => {
  if (!list?.length) return undefined;
  return list.reduce<SmartContractRow[]>((acc, item, index) => {
    if (!item?.address) return acc;
    acc.push({
      name: item.name?.trim() || `Contract ${index + 1}`,
      address: item.address,
    });
    return acc;
  }, []);
};

const getRollupLayerName = (settlementLayer?: string) => {
  if (!settlementLayer) return "Rollup";
  const match = settlementLayer.match(/L(\d+)/i);
  if (match) {
    const layerNumber = parseInt(match[1], 10) + 1;
    return `Rollup (L${layerNumber})`;
  }
  return "Rollup";
};

const SmartContracts = () => {
  const { id } = useParams();
  const networkId = id as string;
  const {
    request: { data: blockchainDetails, isLoading },
  } = useArbitrumOrbitService().network.blockchainDetails(networkId);

  const {
    request: { data: overviewData },
  } = useArbitrumOrbitService().network.overview(networkId);

  const artifactContracts = extractContractsFromArtifacts(blockchainDetails?.data?.artifacts);
  const smartContractsData =
    blockchainDetails?.data?.smartContracts ?? blockchainDetails?.data?.smart_contracts ?? artifactContracts;
  const l2Contracts = smartContractsData?.l2 ?? artifactContracts.l2;
  const l3Contracts = smartContractsData?.l3 ?? artifactContracts.l3;

  const settlementLayer = getSettlementLayer(overviewData?.data);
  const rollupLayerName = getRollupLayerName(settlementLayer);

  // Determine explorer URLs based on settlement layer
  const isSettlementL2 = settlementLayer?.toUpperCase().includes("L2");
  const parentLayerExplorer = isSettlementL2
    ? getL2ExplorerUrl(overviewData?.data)
    : getL1ExplorerUrl(overviewData?.data);
  const childLayerExplorer = isSettlementL2
    ? getL3ExplorerUrl(overviewData?.data)
    : getL2ExplorerUrl(overviewData?.data);

  const l2ContractRows = toSmartContractRows(l2Contracts);
  const l3ContractRows = toSmartContractRows(l3Contracts);

  return (
    <div className="grid grid-cols-12 gap-3 text-brand-dark lg:gap-6">
      <SmartContractsTable
        data={{
          name: `${settlementLayer ?? "L2"} Smart Contracts`,
          source: "L2",
          explorerL1Url: "",
          explorerL2Url: parentLayerExplorer,
          list: l2ContractRows,
        }}
        isLoading={isLoading}
      />
      <SmartContractsTable
        data={{
          name: `${rollupLayerName} Smart Contracts`,
          source: "L3",
          explorerL1Url: childLayerExplorer,
          explorerL2Url: "",
          list: l3ContractRows,
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SmartContracts;
