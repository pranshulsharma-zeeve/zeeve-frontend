"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import DemoNetworkInfo from "../demo-network-info";
import Wallets, { CombinedWalletType } from "../wallet/wallets";
import useOpStackService from "@orbit/services/arbitrum-orbit/use-arbitrum-orbit-service";
import {
  getL1ExplorerUrl,
  getL1RpcUrl,
  getL1TokenInfo,
  getL2ExplorerUrl,
  getL2TokenInfo,
  getL3ExplorerUrl,
  getL3RpcUrl,
  getRpcUrl,
  getSettlementLayer,
} from "@orbit/utils/network-overview";
import { normalizeHttpUrl, fetchBalanceFromRpc } from "@/utils/rpc-utils";
import { WALLET_INFO, WalletRelevantLayer } from "@orbit/types/wallet-info";

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

const Wallet = () => {
  const { id } = useParams();
  const networkId = id as string;
  const [walletList, setWalletList] = useState<Array<CombinedWalletType>>([]);
  const [isBalanceSyncing, setIsBalanceSyncing] = useState(false);

  const {
    request: { data: blockchainDetails, isLoading },
  } = useOpStackService().network.blockchainDetails(networkId);
  const {
    request: { data: networkOverviewApiData },
  } = useOpStackService().network.overview(networkId);
  const overview = networkOverviewApiData?.data;
  const settlementLayer = getSettlementLayer(overview);
  const settlementLayerLabel = getSettlementLayerLabel(settlementLayer);
  const rollupLayerLabel = getRollupLayerLabel(settlementLayer);

  const walletListData = useMemo(() => {
    // Try to get wallets from direct properties first
    if (blockchainDetails?.data?.wallets || blockchainDetails?.data?.wallet_details) {
      return blockchainDetails?.data?.wallets ?? blockchainDetails?.data?.wallet_details;
    }

    // Extract wallets from artifacts array
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
            explorerL2Url: undefined,
            explorerL3Url: undefined,
          })) as WALLET_INFO[];
      }
    }

    return [];
  }, [blockchainDetails?.data?.wallets, blockchainDetails?.data?.wallet_details, blockchainDetails?.data?.artifacts]);
  const explorerSettlementEndpoint = settlementLayerLabel === "L1" ? getL1ExplorerUrl(overview) : getL2ExplorerUrl(overview);
  const explorerRollupEndpoint = rollupLayerLabel === "L2" ? getL2ExplorerUrl(overview) : getL3ExplorerUrl(overview);
  const l1TokenInfo = getL1TokenInfo(overview);
  const l2TokenInfo = getL2TokenInfo(overview);
  const settlementCurrencySymbol = settlementLayerLabel === "L1" ? (l1TokenInfo?.symbol ?? "ETH") : (l2TokenInfo?.symbol ?? "ETH");
  const rollupCurrencySymbol =
    rollupLayerLabel === "L2"
      ? (l2TokenInfo?.symbol ?? "ETH")
      : l2TokenInfo?.type?.toLowerCase() === "custom"
        ? (l2TokenInfo?.name ?? "ETH")
        : "ETH";

  const settlementRpcEndpoint = useMemo(
    () => normalizeHttpUrl(settlementLayerLabel === "L1" ? getL1RpcUrl(overview) : getRpcUrl(overview)),
    [overview, settlementLayerLabel],
  );

  const rollupRpcEndpoint = useMemo(
    () => normalizeHttpUrl(rollupLayerLabel === "L2" ? getRpcUrl(overview) : getL3RpcUrl(overview)),
    [overview, rollupLayerLabel],
  );

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
      existing.source = [settlementLayerLabel, rollupLayerLabel].filter((value) => existing.source.includes(value) || value === layer).join(" & ");
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
    <div className="flex flex-col gap-3 text-brand-dark lg:gap-6">
      <DemoNetworkInfo />
      <Wallets
        data={{
          list: walletList.length > 0 ? walletList : combinedWalletList,
          explorerSettlementUrl: explorerSettlementEndpoint,
          explorerRollupUrl: explorerRollupEndpoint,
        }}
        isLoading={isLoading}
        isBalanceLoading={isBalanceSyncing}
        settlementLayerLabel={settlementLayerLabel}
        rollupLayerLabel={rollupLayerLabel}
      />
    </div>
  );
};

export default Wallet;
