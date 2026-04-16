"use client";
import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import { CopyButton, Heading, IconButton, Tooltip, useTabsContext } from "@zeeve-platform/ui";
import { useParams } from "next/navigation";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import Parameters from "../../../../../rpc/[rpcNodeId]/_components/parameters";
import KeyValuePair from "@/components/key-value-pair";
import Status from "@/components/status";
import usePolygonValidiumService from "@/services/polygon-validium/use-polygon-validium-service";
import { convertNumber, formatDate, formatIntoAge, toShortString, withBasePath } from "@/utils/helpers";
import { useNodeStore } from "@/store/node";
import { useSuperNetStore } from "@/store/super-net";

const Overview = () => {
  const {
    id: supernetId,
    zkEVMNodeId,
  }: {
    id: string;
    zkEVMNodeId: string;
  } = useParams();

  const { setActiveIndex } = useTabsContext();

  // node overview
  const {
    request: { data: nodeInfo, isLoading: isNodeInfoLoading },
  } = usePolygonValidiumService().node.info(supernetId, zkEVMNodeId);

  // sequencer wallet
  const {
    request: { data: sequencerWallet, isLoading: isSequencerWalletLoading },
  } = usePolygonValidiumService().supernet.walletDetails(supernetId, "name", "sequencer");
  const sequencerWalletData = sequencerWallet?.data;

  // aggregator wallet
  const {
    request: { data: aggregatorWallet, isLoading: isAggregatorWalletLoading },
  } = usePolygonValidiumService().supernet.walletDetails(supernetId, "name", "aggregator");
  const aggregatorWalletData = aggregatorWallet?.data;

  // super net general info
  const {
    request: { data: superNetInfo, isLoading: isSuperNetInfoLoading },
  } = usePolygonValidiumService().supernet.supernetInfo(supernetId);

  // set node info
  const setNodeInfo = useNodeStore((state) => state.setNodeInfo);
  // set supernet info
  const setSuperNetInfo = useSuperNetStore((state) => state.setSuperNetInfo);

  const nodeStorePayload = useMemo(() => {
    if (!nodeInfo?.data) return undefined;
    const { name, status } = nodeInfo.data;
    if (!name || !status) return undefined;
    return { name, status };
  }, [nodeInfo?.data?.name, nodeInfo?.data?.status]);

  const superNetMemoKey = superNetInfo?.data ? JSON.stringify(superNetInfo.data) : undefined;
  const superNetStorePayload = useMemo(() => superNetInfo?.data, [superNetMemoKey]);

  useEffect(() => {
    setNodeInfo(isNodeInfoLoading, nodeStorePayload);
  }, [isNodeInfoLoading, nodeStorePayload, setNodeInfo]);

  useEffect(() => {
    setSuperNetInfo(isSuperNetInfoLoading, superNetStorePayload);
  }, [isSuperNetInfoLoading, setSuperNetInfo, superNetStorePayload]);

  return (
    <div className="grid grid-cols-12 gap-3 text-brand-dark lg:gap-6">
      {/* node general info */}
      <div className="col-span-12 flex flex-col gap-1 rounded-lg border border-brand-outline lg:col-span-5">
        <div className="flex items-center justify-between p-2 lg:p-4">
          <Heading as="h4">Node General Info</Heading>
        </div>
        <div className="grid grid-cols-12 gap-3 p-2 lg:gap-6 lg:p-4">
          <KeyValuePair label="Name" value={nodeInfo?.data?.name ?? "NA"} isLoading={isNodeInfoLoading} />
          <KeyValuePair
            label="Type"
            value={nodeInfo?.data?.type ? nodeInfo.data?.type.toUpperCase() : "NA"}
            isLoading={isNodeInfoLoading}
          />
          <KeyValuePair
            label="Status"
            value={nodeInfo?.data?.status ? <Status status={nodeInfo.data?.status} type={"icon"} /> : "NA"}
            isLoading={isNodeInfoLoading}
          />
          <KeyValuePair
            label="Duration"
            value={formatIntoAge(nodeInfo?.data?.createdAt, new Date())}
            isLoading={isNodeInfoLoading}
          />
          <KeyValuePair
            label="Created On"
            value={formatDate(nodeInfo?.data?.createdAt)}
            isLoading={isNodeInfoLoading}
          />
        </div>
      </div>
      {/* must be common */}
      <Parameters />
      {/* cloud infra */}
      <div className="col-span-12 flex flex-col gap-1 rounded-lg border border-brand-outline lg:col-span-5">
        <div className="flex items-center justify-between p-2 lg:p-4">
          <Heading as="h4">Cloud Infra</Heading>
        </div>
        <div className="grid grid-cols-12 gap-3 p-2 lg:gap-6 lg:p-4">
          <KeyValuePair
            label="Cloud"
            value={
              nodeInfo?.data?.infra?.cloud ? (
                <Tooltip
                  text={nodeInfo.data?.infra?.managed ? "Zeeve Managed" : nodeInfo.data?.infra?.cloud?.toUpperCase()}
                  placement={"top-start"}
                >
                  <div className="flex gap-2">
                    <Image
                      src={withBasePath(
                        `/assets/images/protocol/clouds/${
                          nodeInfo.data?.infra?.managed ? "zeeve-managed" : nodeInfo.data?.infra?.cloud?.toLowerCase()
                        }.svg`,
                      )}
                      alt={nodeInfo.data?.infra?.cloud ?? "cloud"}
                      width={24}
                      height={24}
                    />
                    <div className="flex flex-row items-center gap-2 text-sm">
                      {nodeInfo.data?.infra?.managed ? "Zeeve Managed" : nodeInfo.data?.infra?.cloud?.toUpperCase()}
                    </div>
                  </div>
                </Tooltip>
              ) : (
                "NA"
              )
            }
            isLoading={isNodeInfoLoading}
          />
          <KeyValuePair
            label="Region"
            value={
              nodeInfo?.data?.infra?.region
                ? `${nodeInfo.data?.infra?.region?.region}, ${nodeInfo.data?.infra?.region?.regionName}`
                : "NA"
            }
            isLoading={isNodeInfoLoading}
          />
          <KeyValuePair
            label="Machine Config"
            value={nodeInfo?.data?.infra?.cloud ? "2 vCPUs, 4GB RAM" : "NA"}
            isLoading={isNodeInfoLoading}
          />
          <KeyValuePair
            label="Storage"
            value={nodeInfo?.data?.infra?.cloud ? "10 GB" : "NA"}
            isLoading={isNodeInfoLoading}
          />
        </div>
      </div>
      {/* sequencer */}
      <div className="col-span-12 flex flex-col gap-1 rounded-lg border border-brand-outline lg:col-span-6">
        <div className="flex items-center justify-between p-2 lg:p-4">
          <Heading as="h4">Sequencer Wallet Info</Heading>
          <Tooltip text="Sequencer" placement="top-start">
            <IconButton colorScheme="primary" variant="ghost" onClick={() => setActiveIndex(1)}>
              <IconArrowUpRightFromSquare className="text-xl" />
            </IconButton>
          </Tooltip>
        </div>
        <div className="grid grid-cols-12 gap-3 p-2 lg:gap-6 lg:p-4">
          <KeyValuePair
            label="L1 Balance"
            value={
              sequencerWalletData?.l1Balance && sequencerWalletData.l1Currency
                ? `${convertNumber(sequencerWalletData.l1Balance)} ${sequencerWalletData.l1Currency}`
                : "NA"
            }
            isLoading={isSequencerWalletLoading}
          />
          <KeyValuePair
            label="L2 Balance"
            value={
              sequencerWalletData?.l2Balance && sequencerWalletData.l2Currency
                ? `${convertNumber(sequencerWalletData.l2Balance)} ${sequencerWalletData.l2Currency}`
                : "NA"
            }
            isLoading={isSequencerWalletLoading}
          />
          <KeyValuePair
            className="col-span-12 lg:col-span-12"
            label="Address"
            value={
              sequencerWalletData?.address ? (
                <Tooltip text={sequencerWalletData.address} placement="top-start">
                  <div className="flex items-center">
                    <div className="mr-2">{toShortString(sequencerWalletData.address, 7, 7)}</div>
                    <CopyButton text={sequencerWalletData.address} />
                  </div>
                </Tooltip>
              ) : (
                "NA"
              )
            }
            isLoading={isSequencerWalletLoading}
          />
        </div>
      </div>
      {/* aggregator */}
      <div className="col-span-12 flex flex-col gap-1 rounded-lg border border-brand-outline lg:col-span-6">
        <div className="flex items-center justify-between p-2 lg:p-4">
          <Heading as="h4">Aggregator Wallet Info</Heading>
          <Tooltip text="Aggregator" placement="top-start">
            <IconButton colorScheme="primary" variant="ghost" onClick={() => setActiveIndex(2)}>
              <IconArrowUpRightFromSquare className="text-xl" />
            </IconButton>
          </Tooltip>
        </div>
        <div className="grid grid-cols-12 gap-3 p-2 lg:gap-6 lg:p-4">
          <KeyValuePair
            label="L1 Balance"
            value={
              aggregatorWalletData?.l1Balance && aggregatorWalletData.l1Currency
                ? `${convertNumber(aggregatorWalletData.l1Balance)} ${aggregatorWalletData.l1Currency}`
                : "NA"
            }
            isLoading={isAggregatorWalletLoading}
          />
          <KeyValuePair
            label="L2 Balance"
            value={
              aggregatorWalletData?.l2Balance && aggregatorWalletData.l2Currency
                ? `${convertNumber(aggregatorWalletData.l2Balance)} ${aggregatorWalletData.l2Currency}`
                : "NA"
            }
            isLoading={isAggregatorWalletLoading}
          />
          <KeyValuePair
            className="col-span-12 lg:col-span-12"
            label="Address"
            value={
              aggregatorWalletData?.address ? (
                <Tooltip text={aggregatorWalletData.address} placement="top-start">
                  <div className="flex items-center">
                    <div className="mr-2">{toShortString(aggregatorWalletData.address, 7, 7)}</div>
                    <CopyButton text={aggregatorWalletData.address} />
                  </div>
                </Tooltip>
              ) : (
                "NA"
              )
            }
            isLoading={isAggregatorWalletLoading}
            shouldAllowCopy={!!aggregatorWalletData?.address}
          />
        </div>
      </div>
    </div>
  );
};

export default Overview;
