"use client";
import { useState, useEffect, useMemo } from "react";
import { useZkSyncDashboard } from "../dashboard-context";
import WalletDetails from "./wallet-details";
import Wallets, { CombinedWalletType } from "./wallets";
import { WalletListItem } from "@/services/zksync-validium/supernet/wallet-list";
import DemoSupernetInfo from "@/components/demo-supernet-info";
import { normalizeHttpUrl, fetchBalanceFromRpc } from "@/utils/rpc-utils";

const generateTempKey = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const Wallet = () => {
  const [walletList, setWalletList] = useState<Array<CombinedWalletType>>([]);
  const [isBalanceSyncing, setIsBalanceSyncing] = useState(false);
  const { normalized, isLoading } = useZkSyncDashboard();
  const sequencerWalletData = normalized?.wallets.sequencer;
  const aggregatorWalletData = normalized?.wallets.aggregator;
  const walletListData = normalized?.wallets.collections;
  const explorerL1Endpoint = normalized?.wallets.explorerL1;
  const explorerL2Endpoint = normalized?.wallets.explorerL2;
  const l1CurrencySymbol = normalized?.rollupMetadata?.l1?.symbol;
  const l2CurrencySymbol = normalized?.rollupMetadata?.l2?.symbol;
  const l1RpcEndpoint = useMemo(
    () => normalizeHttpUrl(normalized?.rollupMetadata?.l1?.rpcUrl),
    [normalized?.rollupMetadata?.l1?.rpcUrl],
  );
  const l2RpcEndpoint = useMemo(
    () => normalizeHttpUrl(normalized?.rollupMetadata?.l2?.rpcUrl),
    [normalized?.rollupMetadata?.l2?.rpcUrl],
  );

  const getExplorerURL = (source: string, address?: string) => {
    if (!address) return undefined;
    const endpoint = (source === "L1" ? explorerL1Endpoint : explorerL2Endpoint) ?? "";
    const trimmed = endpoint.trim();
    if (!trimmed) return undefined;
    const normalizedEndpoint = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    return `${normalizedEndpoint.replace(/\/$/, "")}/address/${address}`;
  };

  const combinedWalletList = useMemo(() => {
    if (!walletListData) return [];
    const entries = new Map<string, CombinedWalletType>();
    const keyFor = (wallet: WalletListItem, layer: "L1" | "L2") => {
      const label = wallet.name?.toLowerCase().trim() || wallet.type?.toLowerCase().trim();
      if (wallet.address) return label ? `${wallet.address.toLowerCase()}::${label}` : wallet.address.toLowerCase();
      if (label) return `${layer}-${label}`;
      return `${layer}-${generateTempKey()}`;
    };
    const register = (wallet: WalletListItem, layer: "L1" | "L2") => {
      const key = keyFor(wallet, layer);
      const existing = entries.get(key);
      const preferredName = wallet.name ?? wallet.type ?? "Wallet";
      const fallbackCurrency = layer === "L1" ? l1CurrencySymbol : l2CurrencySymbol;
      if (!existing) {
        entries.set(key, {
          name: preferredName,
          address: wallet.address,
          balanceL1: layer === "L1" ? wallet.balance : undefined,
          currencyL1: layer === "L1" ? (wallet.currency ?? fallbackCurrency) : undefined,
          balanceL2: layer === "L2" ? wallet.balance : undefined,
          currencyL2: layer === "L2" ? (wallet.currency ?? fallbackCurrency) : undefined,
          source: layer,
        });
        return;
      }
      existing.name = existing.name || preferredName;
      if (layer === "L1") {
        existing.balanceL1 = wallet.balance ?? existing.balanceL1;
        existing.currencyL1 = wallet.currency ?? existing.currencyL1 ?? fallbackCurrency;
      } else {
        existing.balanceL2 = wallet.balance ?? existing.balanceL2;
        existing.currencyL2 = wallet.currency ?? existing.currencyL2 ?? fallbackCurrency;
      }
      existing.source = "L1 & L2";
      entries.set(key, existing);
    };
    walletListData.l1?.forEach((wallet) => register(wallet, "L1"));
    walletListData.l2?.forEach((wallet) => register(wallet, "L2"));
    return Array.from(entries.values());
  }, [l1CurrencySymbol, l2CurrencySymbol, walletListData]);

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
            let balanceL1 = wallet.balanceL1;
            let balanceL2 = wallet.balanceL2;
            let currencyL1 = wallet.currencyL1 ?? l1CurrencySymbol;
            let currencyL2 = wallet.currencyL2 ?? l2CurrencySymbol;
            const needsL1 = wallet.source.includes("L1") && (!balanceL1 || balanceL1 === "");
            const needsL2 = wallet.source.includes("L2") && (!balanceL2 || balanceL2 === "");
            if (needsL1 && l1RpcEndpoint) {
              const fetched = await fetchBalanceFromRpc(l1RpcEndpoint, wallet.address);
              if (fetched) {
                balanceL1 = fetched;
                currencyL1 = currencyL1 ?? l1CurrencySymbol;
              }
            }
            if (needsL2 && l2RpcEndpoint) {
              const fetched = await fetchBalanceFromRpc(l2RpcEndpoint, wallet.address);
              if (fetched) {
                balanceL2 = fetched;
                currencyL2 = currencyL2 ?? l2CurrencySymbol;
              }
            }
            return {
              ...wallet,
              balanceL1,
              balanceL2,
              currencyL1,
              currencyL2,
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
  }, [combinedWalletList, l1CurrencySymbol, l1RpcEndpoint, l2CurrencySymbol, l2RpcEndpoint]);

  return (
    <div className="grid grid-cols-12 gap-3 text-brand-dark lg:gap-6">
      {/* <DemoSupernetInfo /> */}
      {/* <WalletDetails
        data={{
          description:
            "Responsible for selecting transactions, putting them in a specific order, and sending them in batches to L1.",
          name: "Sequencer",
          address: sequencerWalletData?.address,
          balance: sequencerWalletData?.balance ? String(sequencerWalletData.balance) : undefined,
          currency: sequencerWalletData?.currency,
          monthlyProjectedSpend: sequencerWalletData?.monthlyProjectedSpend,
          explorerUrl: getExplorerURL("L1", sequencerWalletData?.address),
        }}
        isLoading={isLoading}
      />
      <WalletDetails
        data={{
          description: "Consolidates batches by generating ZKPs (Zero Knowledge proofs).",
          name: "Aggregator",
          address: aggregatorWalletData?.address,
          balance: aggregatorWalletData?.balance ? String(aggregatorWalletData.balance) : undefined,
          currency: aggregatorWalletData?.currency,
          monthlyProjectedSpend: aggregatorWalletData?.monthlyProjectedSpend,
          explorerUrl: getExplorerURL("L1", aggregatorWalletData?.address),
        }}
        isLoading={isLoading}
      /> */}
      <Wallets
        data={{
          list: walletList.length > 0 ? walletList : combinedWalletList,
          explorerL1Url: explorerL1Endpoint,
          explorerL2Url: explorerL2Endpoint,
        }}
        isLoading={isLoading}
        isBalanceLoading={isBalanceSyncing}
      />
    </div>
  );
};

export default Wallet;
