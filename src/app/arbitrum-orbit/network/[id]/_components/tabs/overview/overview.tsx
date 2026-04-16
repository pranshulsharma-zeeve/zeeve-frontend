"use client";
import React, { useEffect, useMemo } from "react";
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
import useArbitrumOrbitService from "@orbit/services/arbitrum-orbit/use-arbitrum-orbit-service";
import { getAgentId } from "@orbit/utils/network-overview";
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

const Overview = () => {
  const params = useParams();
  const networkId = params.id as string;
  const { setActiveIndex } = useTabsContext();

  const {
    request: { data: blockchainDetails, isLoading: blockchainLoading },
  } = useArbitrumOrbitService().network.blockchainDetails(networkId);
  const networkInfo = useNetworkStore((state) => state.networkInfo);
  const overviewData = networkInfo?.data;
  const isLoading = networkInfo?.isLoading ?? false;

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

    walletListData.forEach((wallet) => {
      const source = wallet.relevantFor.includes("L2") ? (wallet.relevantFor.includes("L3") ? "L2 & L3" : "L2") : "L3";
      entries.set(wallet.address || generateTempKey(), {
        name: wallet.name || "Wallet",
        address: wallet.address,
        source,
      });
    });

    return Array.from(entries.values());
  }, [walletListData]);

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
      <Parameters data={overviewData} isLoading={isLoading} chain="l3" />
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
                list: combinedWalletList,
              }}
              isLoading={blockchainLoading || isLoading}
              showRelevantForColumn={true}
              showActionsColumn={false}
              showBalanceColumns={false}
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
