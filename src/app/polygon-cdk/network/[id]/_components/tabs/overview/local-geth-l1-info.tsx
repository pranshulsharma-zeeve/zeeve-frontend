"use client";
import { useEffect, useMemo, useState } from "react";
import { Heading, IconButton, Tooltip, useTabsContext } from "@zeeve-platform/ui";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import { IconBoxSquare } from "@zeeve-platform/icons/delivery/outline";
import { usePolygonCdkDashboard } from "../dashboard-context";
import { convertNumber, formatDate, toCapitalize } from "@/utils/helpers";
import { normalizeHttpUrl, fetchBalanceFromRpc } from "@/utils/rpc-utils";
import InfoRow from "@/modules/arbitrum-orbit/components/info-row";

const LocalGethL1Info = () => {
  const { setActiveIndex } = useTabsContext();
  const { normalized, isLoading } = usePolygonCdkDashboard();
  const l1InfoData = normalized?.l1Info;
  const explorerEndpoint = normalizeHttpUrl(normalized?.wallets.explorerL1);
  const sequencer = normalized?.wallets.sequencer;
  const aggregator = normalized?.wallets.aggregator;
  const [liveBalances, setLiveBalances] = useState<{ sequencer?: string; aggregator?: string }>({});
  const [isBalanceSyncing, setIsBalanceSyncing] = useState(false);
  const l1RpcEndpoint = useMemo(() => {
    const candidate =
      normalized?.rollupMetadata?.l1?.rpcUrls ?? normalized?.wallets.rpcL1 ?? normalized?.rollupMetadata?.l1?.rpcUrl;
    return normalizeHttpUrl(candidate);
  }, [normalized?.rollupMetadata?.l1?.rpcUrl, normalized?.rollupMetadata?.l1?.rpcUrls, normalized?.wallets.rpcL1]);
  const l2RpcEndpoint = useMemo(
    () => normalizeHttpUrl(normalized?.wallets.rpcL2 ?? normalized?.rollupMetadata?.l2?.rpcUrl),
    [normalized?.rollupMetadata?.l2?.rpcUrl, normalized?.wallets.rpcL2],
  );

  useEffect(() => {
    let isMounted = true;
    const resolveRpcEndpoint = () => l1RpcEndpoint ?? l2RpcEndpoint;
    const fetchBalances = async () => {
      const tasks: Array<Promise<void>> = [];
      const nextBalances: { sequencer?: string; aggregator?: string } = {};

      const enqueue = (key: "sequencer" | "aggregator", address?: string) => {
        const rpc = resolveRpcEndpoint();
        if (!address || !rpc) return;
        tasks.push(
          fetchBalanceFromRpc(rpc, address).then((value) => {
            if (value) {
              nextBalances[key] = value;
            }
          }),
        );
      };

      enqueue("sequencer", sequencer?.address);
      enqueue("aggregator", aggregator?.address);

      if (!tasks.length) {
        setLiveBalances({});
        return;
      }

      setIsBalanceSyncing(true);
      try {
        await Promise.all(tasks);
        if (isMounted && (nextBalances.sequencer || nextBalances.aggregator)) {
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
  }, [aggregator?.address, l1RpcEndpoint, l2RpcEndpoint, sequencer?.address]);

  const sequencerBalance = liveBalances.sequencer ?? (sequencer?.balance ? String(sequencer.balance) : undefined);
  const aggregatorBalance = liveBalances.aggregator ?? (aggregator?.balance ? String(aggregator.balance) : undefined);
  const l1TokenSymbol = "ETH";
  const sequencerCurrency = l1TokenSymbol;
  const aggregatorCurrency = l1TokenSymbol;
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

        <div className="grid grid-cols-2 gap-5">
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
            label="Sequencer Balance"
            value={
              sequencerBalance ? (
                <Tooltip text={`${sequencerBalance} ${sequencerCurrency ?? ""}`} placement={"top-start"}>
                  <div>
                    {convertNumber(sequencerBalance)} {sequencerCurrency}
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
            label="Aggregator Balance"
            value={
              aggregatorBalance ? (
                <Tooltip text={`${aggregatorBalance} ${aggregatorCurrency ?? ""}`} placement={"top-start"}>
                  <div>
                    {convertNumber(aggregatorBalance)} {aggregatorCurrency}
                  </div>
                </Tooltip>
              ) : (
                "NA"
              )
            }
            isLoading={loadingState}
            valueClassName="text-black"
          />
          <InfoRow
            label="Status"
            value={normalized?.summary?.status ? toCapitalize(normalized.summary.status, "first") : "NA"}
            isLoading={loadingState}
            textAlign="right"
            valueClassName="text-black"
          />
          <InfoRow
            label="Created On"
            value={formatDate(l1InfoData?.createdAt)}
            isLoading={loadingState}
            valueClassName="text-black"
          />
        </div>
      </div>
    </div>
  );
};

export default LocalGethL1Info;
