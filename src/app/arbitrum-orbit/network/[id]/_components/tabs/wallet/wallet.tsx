"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import DemoNetworkInfo from "../demo-network-info";
import Wallets, { CombinedWalletType } from "./wallets";
import useArbitrumOrbitService from "@orbit/services/arbitrum-orbit/use-arbitrum-orbit-service";
import { getL2TokenInfo, getL2ExplorerUrl, getL3ExplorerUrl, getRpcUrl } from "@orbit/utils/network-overview";
import { normalizeHttpUrl, fetchBalanceFromRpc } from "@/utils/rpc-utils";
import { WALLET_INFO } from "@orbit/types/wallet-info";

const generateTempKey = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const parseRelevantFor = (source?: string): Array<"L2" | "L3"> => {
  const normalized = source?.toLowerCase() ?? "";
  const hasL3 = normalized.includes("l3");
  const hasL2 = normalized.includes("l2") || normalized.includes("l1");
  const relevantFor: Array<"L2" | "L3"> = [];

  if (hasL2) relevantFor.push("L2");
  if (hasL3) relevantFor.push("L3");

  return relevantFor.length ? relevantFor : ["L2"];
};

const Wallet = () => {
  const { id } = useParams();
  const networkId = id as string;
  const [walletList, setWalletList] = useState<Array<CombinedWalletType>>([]);
  const [isBalanceSyncing, setIsBalanceSyncing] = useState(false);

  const {
    request: { data: blockchainDetails, isLoading },
  } = useArbitrumOrbitService().network.blockchainDetails(networkId);
  const {
    request: { data: networkOverviewApiData },
  } = useArbitrumOrbitService().network.overview(networkId);

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
            // In Arbitrum Orbit: L2 = parent/settlement chain, L3 = orbit rollup
            // API uses "l1" to refer to the parent chain (which is L2 in our UI)
            relevantFor: parseRelevantFor(wallet.source),
            explorerL2Url: undefined,
            explorerL3Url: undefined,
          })) as WALLET_INFO[];
      }
    }

    return [];
  }, [blockchainDetails?.data?.wallets, blockchainDetails?.data?.wallet_details, blockchainDetails?.data?.artifacts]);
  const overview = networkOverviewApiData?.data;
  const explorerL2Endpoint = getL2ExplorerUrl(overview);
  const explorerL3Endpoint = getL3ExplorerUrl(overview);
  const tokenInfo = getL2TokenInfo(overview);
  const l2CurrencySymbol = tokenInfo?.symbol ?? "ETH";
  const l3CurrencySymbol = tokenInfo?.type?.toLowerCase() === "custom" ? (tokenInfo?.name ?? "ETH") : "ETH";

  const l2RpcEndpoint = useMemo(() => normalizeHttpUrl(getRpcUrl(overview)), [overview]);

  const l3RpcEndpoint = useMemo(
    () => normalizeHttpUrl(overview?.rollup_metadata?.l3?.rpcUrl),
    [overview?.rollup_metadata?.l3?.rpcUrl],
  );

  const combinedWalletList = useMemo(() => {
    if (!walletListData || walletListData.length === 0) return [];
    const entries = new Map<string, CombinedWalletType>();

    const keyFor = (wallet: WALLET_INFO, layer: "L2" | "L3") => {
      const label = wallet.name?.toLowerCase().trim();
      if (wallet.address) return label ? `${wallet.address.toLowerCase()}::${label}` : wallet.address.toLowerCase();
      if (label) return `${layer}-${label}`;
      return `${layer}-${generateTempKey()}`;
    };

    const register = (wallet: WALLET_INFO, layer: "L2" | "L3") => {
      const key = keyFor(wallet, layer);
      const existing = entries.get(key);
      const preferredName = wallet.name ?? "Wallet";
      const fallbackCurrency = layer === "L2" ? l2CurrencySymbol : l3CurrencySymbol;

      if (!existing) {
        entries.set(key, {
          name: preferredName,
          address: wallet.address,
          balanceL2: layer === "L2" ? wallet.l2Balance : undefined,
          currencyL2: layer === "L2" ? (wallet.currency ?? fallbackCurrency) : undefined,
          balanceL3: layer === "L3" ? wallet.l3Balance : undefined,
          currencyL3: layer === "L3" ? (wallet.currency ?? fallbackCurrency) : undefined,
          source: layer,
        });
        return;
      }

      existing.name = existing.name || preferredName;
      if (layer === "L2") {
        existing.balanceL2 = wallet.l2Balance ?? existing.balanceL2;
        existing.currencyL2 = wallet.currency ?? existing.currencyL2 ?? fallbackCurrency;
      } else {
        existing.balanceL3 = wallet.l3Balance ?? existing.balanceL3;
        existing.currencyL3 = wallet.currency ?? existing.currencyL3 ?? fallbackCurrency;
      }
      existing.source = "L2 & L3";
      entries.set(key, existing);
    };

    walletListData.forEach((wallet) => {
      if (wallet.relevantFor.includes("L2")) {
        register(wallet, "L2");
      }
      if (wallet.relevantFor.includes("L3")) {
        register(wallet, "L3");
      }
    });

    return Array.from(entries.values());
  }, [l2CurrencySymbol, l3CurrencySymbol, walletListData]);

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
            let currencyL2 = wallet.currencyL2 ?? l2CurrencySymbol;
            let currencyL3 = wallet.currencyL3 ?? l3CurrencySymbol;

            const needsL2 = wallet.source.includes("L2") && (!balanceL2 || balanceL2 === "");
            const needsL3 = wallet.source.includes("L3") && (!balanceL3 || balanceL3 === "");

            if (needsL2 && l2RpcEndpoint) {
              const fetched = await fetchBalanceFromRpc(l2RpcEndpoint, wallet.address);
              if (fetched) {
                balanceL2 = fetched;
                currencyL2 = currencyL2 ?? l2CurrencySymbol;
              }
            }

            if (needsL3 && l3RpcEndpoint) {
              const fetched = await fetchBalanceFromRpc(l3RpcEndpoint, wallet.address);
              if (fetched) {
                balanceL3 = fetched;
                currencyL3 = currencyL3 ?? l3CurrencySymbol;
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
  }, [combinedWalletList, l2CurrencySymbol, l2RpcEndpoint, l3CurrencySymbol, l3RpcEndpoint]);

  return (
    <div className="flex flex-col gap-3 text-brand-dark lg:gap-6">
      <DemoNetworkInfo />
      <Wallets
        data={{
          list: walletList.length > 0 ? walletList : combinedWalletList,
          explorerL2Url: explorerL2Endpoint,
          explorerL3Url: explorerL3Endpoint,
        }}
        isLoading={isLoading}
        isBalanceLoading={isBalanceSyncing}
      />
    </div>
  );
};

export default Wallet;
