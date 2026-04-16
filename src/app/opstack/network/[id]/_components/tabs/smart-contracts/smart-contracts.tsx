"use client";

import { useParams } from "next/navigation";
import SmartContractsTable from "./smart-contracts-table";
import useOpStackService from "@orbit/services/arbitrum-orbit/use-arbitrum-orbit-service";
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
    return { l1: undefined, l2: undefined, l3: undefined };
  }
  const mapContracts = (contracts?: Record<string, string>) =>
    contracts ? Object.entries(contracts).map(([name, address]) => ({ name, address })) : [];

  const l1Contracts = mapContracts(artifactContent.tokenBridgeContracts?.l1Contracts);
  const l2Contracts = mapContracts(artifactContent.tokenBridgeContracts?.l2Contracts);
  const l3Contracts = mapContracts(artifactContent.tokenBridgeContracts?.l3Contracts);

  return {
    l1: l1Contracts.length ? l1Contracts : undefined,
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

const getLayerNumber = (layer?: string) => {
  const match = layer?.match(/L(\d+)/i);
  return match ? parseInt(match[1], 10) : undefined;
};

const SmartContracts = () => {
  const { id } = useParams();
  const networkId = id as string;
  const {
    request: { data: blockchainDetails, isLoading },
  } = useOpStackService().network.blockchainDetails(networkId);

  const {
    request: { data: overviewData },
  } = useOpStackService().network.overview(networkId);

  const artifactContracts = extractContractsFromArtifacts(blockchainDetails?.data?.artifacts);
  const smartContractsData =
    blockchainDetails?.data?.smartContracts ?? blockchainDetails?.data?.smart_contracts ?? artifactContracts;

  const settlementLayer = getSettlementLayer(overviewData?.data);
  const settlementLayerNumber = getLayerNumber(settlementLayer);
  const settlementLayerKey =
    settlementLayerNumber === 1 ? "l1" : settlementLayerNumber === 2 ? "l2" : settlementLayerNumber === 3 ? "l3" : "l2";
  const rollupLayerKey = settlementLayerKey === "l1" ? "l2" : settlementLayerKey === "l2" ? "l3" : settlementLayerKey;
  const rollupLayerName = getRollupLayerName(settlementLayer);

  // Determine explorer URLs based on settlement layer
  const isSettlementL2 = settlementLayer?.toUpperCase().includes("L2");
  const parentLayerExplorer = isSettlementL2
    ? getL2ExplorerUrl(overviewData?.data)
    : getL1ExplorerUrl(overviewData?.data);
  const childLayerExplorer = isSettlementL2
    ? getL3ExplorerUrl(overviewData?.data)
    : getL2ExplorerUrl(overviewData?.data);

  const settlementContractRows = toSmartContractRows(
    smartContractsData?.[settlementLayerKey] ?? artifactContracts[settlementLayerKey],
  );
  const rollupContractRows = toSmartContractRows(
    smartContractsData?.[rollupLayerKey] ?? artifactContracts[rollupLayerKey],
  );

  return (
    <div className="grid grid-cols-12 gap-3 text-brand-dark lg:gap-6">
      <SmartContractsTable
        data={{
          name: `${settlementLayer ?? "L2"} Smart Contracts`,
          source: "L2",
          explorerL1Url: "",
          explorerL2Url: parentLayerExplorer,
          list: settlementContractRows,
        }}
        isLoading={isLoading}
      />
      <SmartContractsTable
        data={{
          name: `${rollupLayerName} Smart Contracts`,
          source: "L3",
          explorerL1Url: childLayerExplorer,
          explorerL2Url: "",
          list: rollupContractRows,
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SmartContracts;
