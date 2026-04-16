"use client";
import { usePolygonCdkDashboard } from "../dashboard-context";
import SmartContractsTable from "./smart-contracts-table";

type SmartContractRow = { name: string; address: string; explorerUrl?: string };

const toSmartContractRows = (
  list?: Array<{ name?: string; address?: string; explorer?: string }>,
): SmartContractRow[] | undefined => {
  if (!list?.length) return undefined;
  return list.reduce<SmartContractRow[]>((acc, item, index) => {
    if (!item?.address) return acc;
    acc.push({
      name: item.name?.trim() || `Contract ${index + 1}`,
      address: item.address,
      explorerUrl: item.explorer,
    });
    return acc;
  }, []);
};

const SmartContracts = () => {
  const { normalized, isLoading } = usePolygonCdkDashboard();
  const contracts = normalized?.smartContracts;
  const l1Contracts = toSmartContractRows(contracts?.l1);
  const l2Contracts = toSmartContractRows(contracts?.l2);
  const l1ChainName = normalized?.rollupMetadata?.l1?.name?.trim() || "L1";

  return (
    <div className="grid grid-cols-12 gap-3 text-brand-dark lg:gap-6">
      <SmartContractsTable
        data={{
          name: `${l1ChainName} (L1) Smart Contracts`,
          source: "L1",
          explorerL1Url: contracts?.explorerL1,
          explorerL2Url: contracts?.explorerL2,
          list: l1Contracts,
        }}
        isLoading={isLoading}
      />
      <SmartContractsTable
        data={{
          name: "Rollup Smart Contracts",
          source: "L2",
          explorerL1Url: contracts?.explorerL1,
          explorerL2Url: contracts?.explorerL2,
          list: l2Contracts,
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SmartContracts;
