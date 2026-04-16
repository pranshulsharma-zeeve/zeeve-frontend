"use client";
import { useEffect, useMemo, useState } from "react";
import { Heading, IconButton, Tooltip, useTabsContext, Z4DashboardCard } from "@zeeve-platform/ui";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import { IconBoxSquare } from "@zeeve-platform/icons/delivery/outline";
import { useZkSyncDashboard } from "../dashboard-context";
import { convertNumber } from "@/utils/helpers";
import { normalizeHttpUrl, fetchBalanceFromRpc } from "@/utils/rpc-utils";
import InfoRow from "@/modules/arbitrum-orbit/components/info-row";

const LocalGethL1Info = () => {
  const { setActiveIndex } = useTabsContext();
  const { normalized, isLoading } = useZkSyncDashboard();
  const l1InfoData = normalized?.l1Info;
  const explorerEndpoint = normalizeHttpUrl(normalized?.wallets.explorerL1);
  const collections = normalized?.wallets.collections;
  const [liveBalances, setLiveBalances] = useState<{ blobOperator?: string; operator?: string }>({});
  const [isBalanceSyncing, setIsBalanceSyncing] = useState(false);
  const l1RpcEndpoint = useMemo(
    () => normalizeHttpUrl(normalized?.wallets.rpcL1 ?? normalized?.rollupMetadata?.l1?.rpcUrl),
    [normalized?.rollupMetadata?.l1?.rpcUrl, normalized?.wallets.rpcL1],
  );
  const l1Currency = normalized?.rollupMetadata?.l1?.symbol ?? l1InfoData?.currency;
  const findWallet = (matcher: string) => {
    const normalizedMatcher = matcher.toLowerCase();
    const entries = [...(collections?.l1 ?? []), ...(collections?.l2 ?? [])];
    const exact = entries.find(
      (wallet) =>
        wallet?.name?.toLowerCase() === normalizedMatcher || wallet?.type?.toLowerCase() === normalizedMatcher,
    );
    if (exact) return exact;
    if (normalizedMatcher === "operator") {
      return entries.find(
        (wallet) =>
          wallet?.name?.toLowerCase().includes("operator") && !wallet?.name?.toLowerCase().includes("blob operator"),
      );
    }
    return entries.find((wallet) => wallet?.name?.toLowerCase().includes(normalizedMatcher));
  };
  const blobOperator = findWallet("blob operator");
  const operator = findWallet("operator");

  useEffect(() => {
    let isMounted = true;
    const fetchBalances = async () => {
      const tasks: Array<Promise<void>> = [];
      const nextBalances: { blobOperator?: string; operator?: string } = {};

      const enqueue = (key: "blobOperator" | "operator", address?: string) => {
        if (!address || !l1RpcEndpoint) return;
        tasks.push(
          fetchBalanceFromRpc(l1RpcEndpoint, address).then((value) => {
            if (value) {
              nextBalances[key] = value;
            }
          }),
        );
      };

      enqueue("blobOperator", blobOperator?.address);
      enqueue("operator", operator?.address);

      if (!tasks.length) {
        setLiveBalances({});
        return;
      }

      setIsBalanceSyncing(true);
      try {
        await Promise.all(tasks);
        if (isMounted && (nextBalances.blobOperator || nextBalances.operator)) {
          setLiveBalances(nextBalances);
        }
      } finally {
        if (isMounted) {
          setIsBalanceSyncing(false);
        }
      }
    };

    fetchBalances();

    return () => {
      isMounted = false;
    };
  }, [blobOperator?.address, l1RpcEndpoint, operator?.address]);

  const blobOperatorBalance =
    liveBalances.blobOperator ?? (blobOperator?.balance ? String(blobOperator.balance) : undefined);
  const operatorBalance = liveBalances.operator ?? (operator?.balance ? String(operator.balance) : undefined);
  const blobOperatorCurrency = blobOperator?.currency ?? l1Currency;
  const operatorCurrency = operator?.currency ?? l1Currency;
  const hasBlobOperatorBalance = blobOperatorBalance !== undefined && blobOperatorBalance !== null;
  const hasOperatorBalance = operatorBalance !== undefined && operatorBalance !== null;
  const blobOperatorUnit = blobOperatorCurrency ?? "ETH";
  const operatorUnit = operatorCurrency ?? "ETH";
  const loadingState = isLoading || isBalanceSyncing;
  return (
    <div className="col-span-12 flex flex-col rounded-lg border md:col-span-6 lg:col-span-6 xl:col-span-5">
      <div
        className="h-full rounded-lg bg-[#D7DCF8] p-6 text-white"
        // style={{
        //   position: "relative",
        //   backgroundImage: `url(${withBasePath("/assets/images/protocol/l2-info-background.svg")})`,
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        // }}
      >
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h4">{`${normalized?.rollupMetadata?.l1?.name ?? "L1"} (L1) Info`}</Heading>
          <div className="flex gap-2">
            <Tooltip text={"View L1 Explorer"} placement="top-start">
              <IconButton
                colorScheme="primary"
                variant={"ghost"}
                isDisabled={!explorerEndpoint}
                onClick={() => {
                  if (explorerEndpoint) {
                    window.open(explorerEndpoint);
                  }
                }}
              >
                <IconBoxSquare className="text-2xl" />
              </IconButton>
            </Tooltip>
            <Tooltip text={"My Wallets"} placement="top-start">
              <IconButton colorScheme="primary" variant={"ghost"} onClick={() => setActiveIndex(3)}>
                <IconArrowUpRightFromSquare className="text-xl" />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-5">
          {/* <InfoRow
            label="Name"
            value={l1InfoData?.networkName ?? "NA"}
            isLoading={isLoading}
            valueClassName="text-black"
          /> */}
          <InfoRow
            label="Chain ID"
            value={l1InfoData?.chainId ?? "NA"}
            isLoading={isLoading}
            valueClassName="text-black"
          />
          <InfoRow
            label="Blob Operator Balance"
            value={
              hasBlobOperatorBalance ? (
                <Tooltip text={`${blobOperatorBalance} ${blobOperatorUnit}`} placement={"top-start"}>
                  <div>
                    {convertNumber(blobOperatorBalance)} {blobOperatorUnit}
                  </div>
                </Tooltip>
              ) : (
                "NA"
              )
            }
            textAlign="right"
            isLoading={loadingState}
            valueClassName="text-black"
          />
          <InfoRow
            label="Operator Balance"
            value={
              hasOperatorBalance ? (
                <Tooltip text={`${operatorBalance} ${operatorUnit}`} placement={"top-start"}>
                  <div>
                    {convertNumber(operatorBalance)} {operatorUnit}
                  </div>
                </Tooltip>
              ) : (
                "NA"
              )
            }
            isLoading={loadingState}
            valueClassName="text-black"
          />
        </div>
      </div>
    </div>
  );
};

export default LocalGethL1Info;
