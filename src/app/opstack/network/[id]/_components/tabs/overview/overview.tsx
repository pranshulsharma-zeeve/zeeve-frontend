"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { IconButton, useTabsContext } from "@zeeve-platform/ui";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import DemoNetworkInfo from "../demo-network-info";
import Wallets, { CombinedWalletType } from "../wallet/wallets";
import Alerts from "./alerts";
import L3Info from "./l3-info";
import L2Info from "./l2-info";
import NodesOverview from "./nodes-overview";
import Parameters from "./parameters";
import { useNetworkStore } from "@orbit/store/network";
import useOpStackService from "@orbit/services/arbitrum-orbit/use-arbitrum-orbit-service";
import {
  getL1RpcUrl,
  getL1TokenInfo,
  getL2TokenInfo,
  getL3RpcUrl,
  getRpcUrl,
  getSettlementLayer,
} from "@orbit/utils/network-overview";
import { WALLET_INFO, WalletRelevantLayer } from "@orbit/types/wallet-info";
import { fetchBalanceFromRpc, normalizeHttpUrl } from "@/utils/rpc-utils";

const generateTempKey = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const getLayerNumber = (layer?: string) => {
  const match = layer?.match(/L(\d+)/i);
  return match ? parseInt(match[1], 10) : undefined;
};

const getSettlementLayerLabel = (layer?: string): WalletRelevantLayer => {
  const layerNumber = getLayerNumber(layer);
  if (layerNumber === 1) return "L1";
  if (layerNumber === 3) return "L3";
  return "L2";
};

const getRollupLayerLabel = (layer?: string): WalletRelevantLayer => {
  const layerNumber = getLayerNumber(layer);
  if (layerNumber === 1) return "L2";
  if (layerNumber === 2) return "L3";
  return "L3";
};

const parseRelevantFor = (source?: string): WalletRelevantLayer[] => {
  const normalized = source?.toLowerCase() ?? "";
  const relevantFor: WalletRelevantLayer[] = [];

  if (normalized.includes("l1")) relevantFor.push("L1");
  if (normalized.includes("l2")) relevantFor.push("L2");
  if (normalized.includes("l3")) relevantFor.push("L3");

  return relevantFor.length ? relevantFor : ["L2"];
};

const Overview = () => {
  const params = useParams();
  const networkId = params.id as string;
  const { setActiveIndex } = useTabsContext();
  const [walletList, setWalletList] = useState<Array<CombinedWalletType>>([]);
  const [isBalanceSyncing, setIsBalanceSyncing] = useState(false);

  const {
    request: { data: blockchainDetails, isLoading: blockchainLoading },
  } = useOpStackService().network.blockchainDetails(networkId);
  const networkInfo = useNetworkStore((state) => state.networkInfo);
  const overviewData = networkInfo?.data;
  const isLoading = networkInfo?.isLoading ?? false;
  const settlementLayer = getSettlementLayer(overviewData);
  const settlementLayerLabel = getSettlementLayerLabel(settlementLayer);
  const rollupLayerLabel = getRollupLayerLabel(settlementLayer);
  const tokenInfo = getL2TokenInfo(overviewData);
  const l1TokenInfo = getL1TokenInfo(overviewData);
  const settlementCurrencySymbol =
    settlementLayerLabel === "L1" ? (l1TokenInfo?.symbol ?? "ETH") : (tokenInfo?.symbol ?? "ETH");
  const rollupCurrencySymbol =
    rollupLayerLabel === "L2"
      ? (tokenInfo?.symbol ?? "ETH")
      : tokenInfo?.type?.toLowerCase() === "custom"
        ? (tokenInfo?.name ?? "ETH")
        : "ETH";

  const parameterChain = useMemo<"l2" | "l3">(() => {
    if (!settlementLayer) return "l2";

    const match = settlementLayer.match(/L(\d+)/i);
    if (match) {
      const layerNumber = parseInt(match[1], 10) + 1;
      return layerNumber === 3 ? "l3" : "l2";
    }

    return "l2";
  }, [settlementLayer]);

  const settlementRpcEndpoint = useMemo(
    () => normalizeHttpUrl(settlementLayerLabel === "L1" ? getL1RpcUrl(overviewData) : getRpcUrl(overviewData)),
    [overviewData, settlementLayerLabel],
  );

  const rollupRpcEndpoint = useMemo(
    () => normalizeHttpUrl(rollupLayerLabel === "L2" ? getRpcUrl(overviewData) : getL3RpcUrl(overviewData)),
    [overviewData, rollupLayerLabel],
  );

  const walletListData = useMemo(() => {
    if (blockchainDetails?.data?.wallets || blockchainDetails?.data?.wallet_details) {
      return blockchainDetails?.data?.wallets ?? blockchainDetails?.data?.wallet_details;
    }

    if (blockchainDetails?.data?.artifacts && Array.isArray(blockchainDetails?.data?.artifacts)) {
      const walletsArtifact = blockchainDetails.data.artifacts.find((artifact) => artifact.name === "wallets.json");
      if (walletsArtifact?.content && typeof walletsArtifact.content === "object") {
        const walletsObj = walletsArtifact.content as Record<
          string,
          { name?: string; address?: string; source?: string }
        >;
        return Object.entries(walletsObj)
          .filter(([, wallet]) => wallet?.address)
          .map(([, wallet]) => ({
            name: wallet.name || "Wallet",
            address: wallet.address || "",
            l2Balance: undefined,
            l3Balance: undefined,
            currency: "ETH",
            relevantFor: parseRelevantFor(wallet.source),
          })) as WALLET_INFO[];
      }
    }

    return [];
  }, [blockchainDetails?.data?.wallets, blockchainDetails?.data?.wallet_details, blockchainDetails?.data?.artifacts]);

  const combinedWalletList = useMemo(() => {
    if (!walletListData || walletListData.length === 0) return [];
    const entries = new Map<string, CombinedWalletType>();

    const keyFor = (wallet: WALLET_INFO, layer: WalletRelevantLayer) => {
      const label = wallet.name?.toLowerCase().trim();
      if (wallet.address) return label ? `${wallet.address.toLowerCase()}::${label}` : wallet.address.toLowerCase();
      if (label) return `${layer}-${label}`;
      return `${layer}-${generateTempKey()}`;
    };

    const register = (wallet: WALLET_INFO, layer: WalletRelevantLayer) => {
      const key = keyFor(wallet, layer);
      const existing = entries.get(key);
      const preferredName = wallet.name ?? "Wallet";
      const fallbackCurrency = layer === settlementLayerLabel ? settlementCurrencySymbol : rollupCurrencySymbol;

      if (!existing) {
        entries.set(key, {
          name: preferredName,
          address: wallet.address,
          balanceL2: layer === settlementLayerLabel ? wallet.l2Balance : undefined,
          currencyL2: layer === settlementLayerLabel ? (wallet.currency ?? fallbackCurrency) : undefined,
          balanceL3: layer === rollupLayerLabel ? wallet.l3Balance : undefined,
          currencyL3: layer === rollupLayerLabel ? (wallet.currency ?? fallbackCurrency) : undefined,
          source: layer,
        });
        return;
      }

      existing.name = existing.name || preferredName;
      if (layer === settlementLayerLabel) {
        existing.balanceL2 = wallet.l2Balance ?? existing.balanceL2;
        existing.currencyL2 = wallet.currency ?? existing.currencyL2 ?? fallbackCurrency;
      } else if (layer === rollupLayerLabel) {
        existing.balanceL3 = wallet.l3Balance ?? existing.balanceL3;
        existing.currencyL3 = wallet.currency ?? existing.currencyL3 ?? fallbackCurrency;
      }
      existing.source = [settlementLayerLabel, rollupLayerLabel]
        .filter((value) => existing.source.includes(value) || value === layer)
        .join(" & ");
      entries.set(key, existing);
    };

    walletListData.forEach((wallet) => {
      if (wallet.relevantFor.includes(settlementLayerLabel)) {
        register(wallet, settlementLayerLabel);
      }
      if (wallet.relevantFor.includes(rollupLayerLabel)) {
        register(wallet, rollupLayerLabel);
      }
    });

    return Array.from(entries.values());
  }, [rollupCurrencySymbol, rollupLayerLabel, settlementCurrencySymbol, settlementLayerLabel, walletListData]);

  useEffect(() => {
    let isMounted = true;
    const populateBalances = async () => {
      if (!combinedWalletList.length) {
        setWalletList([]);
        setIsBalanceSyncing(false);
        return;
      }

      setIsBalanceSyncing(true);
      try {
        const enriched = await Promise.all(
          combinedWalletList.map(async (wallet) => {
            if (!wallet.address) return wallet;

            let balanceL2 = wallet.balanceL2;
            let balanceL3 = wallet.balanceL3;
            let currencyL2 = wallet.currencyL2 ?? settlementCurrencySymbol;
            let currencyL3 = wallet.currencyL3 ?? rollupCurrencySymbol;

            const needsSettlement = wallet.source.includes(settlementLayerLabel) && (!balanceL2 || balanceL2 === "");
            const needsRollup = wallet.source.includes(rollupLayerLabel) && (!balanceL3 || balanceL3 === "");

            if (needsSettlement && settlementRpcEndpoint) {
              const fetched = await fetchBalanceFromRpc(settlementRpcEndpoint, wallet.address);
              if (fetched) {
                balanceL2 = fetched;
                currencyL2 = currencyL2 ?? settlementCurrencySymbol;
              }
            }

            if (needsRollup && rollupRpcEndpoint) {
              const fetched = await fetchBalanceFromRpc(rollupRpcEndpoint, wallet.address);
              if (fetched) {
                balanceL3 = fetched;
                currencyL3 = currencyL3 ?? rollupCurrencySymbol;
              }
            }

            return {
              ...wallet,
              balanceL2,
              balanceL3,
              currencyL2,
              currencyL3,
            };
          }),
        );

        if (isMounted) {
          setWalletList(enriched);
        }
      } catch {
        if (isMounted) {
          setWalletList(combinedWalletList);
        }
      } finally {
        if (isMounted) {
          setIsBalanceSyncing(false);
        }
      }
    };

    populateBalances();

    return () => {
      isMounted = false;
    };
  }, [
    combinedWalletList,
    rollupCurrencySymbol,
    rollupLayerLabel,
    rollupRpcEndpoint,
    settlementCurrencySymbol,
    settlementLayerLabel,
    settlementRpcEndpoint,
  ]);

  return (
    <div className="grid grid-cols-12 gap-3 text-brand-dark lg:gap-6">
      <DemoNetworkInfo />
      {/* <ChainStatusInfo
        isVisible={
          networkOverviewApiData?.data.generalInfo.status === "requested" ||
          networkOverviewApiData?.data.generalInfo.status === "provisioning"
        }
      /> */}
      <L3Info data={overviewData} isLoading={isLoading} />
      <Parameters data={overviewData} isLoading={isLoading} chain={parameterChain} />
      <NodesOverview data={overviewData} isLoading={isLoading} />
      <L2Info data={overviewData} isLoading={isLoading} />
      {combinedWalletList.length > 0 ? (
        <div className="col-span-12 rounded-lg bg-white xl:col-span-5">
          <div className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <h5 className="mb-4 font-semibold text-brand-dark lg:mb-4">Wallet Overview</h5>
              <IconButton colorScheme="primary" variant={"ghost"} onClick={() => setActiveIndex(2)}>
                <IconArrowUpRightFromSquare className="text-xl" />
              </IconButton>
            </div>
            <Wallets
              data={{
                list: walletList.length > 0 ? walletList : combinedWalletList,
              }}
              isLoading={blockchainLoading || isLoading}
              isBalanceLoading={isBalanceSyncing}
              settlementLayerLabel={settlementLayerLabel}
              rollupLayerLabel={rollupLayerLabel}
              // showAddressColumn={false}
              showRelevantForColumn={false}
              showActionsColumn={false}
              showBalanceColumns={true}
              showBorder={false}
            />
          </div>
        </div>
      ) : null}
      <Alerts />
    </div>
  );
};

export default Overview;
