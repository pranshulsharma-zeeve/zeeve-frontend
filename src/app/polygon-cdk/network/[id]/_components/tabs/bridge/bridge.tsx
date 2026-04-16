"use client";
import React, { useMemo } from "react";
import { Heading, IconButton, Link, Skeleton, Tooltip, tx } from "@zeeve-platform/ui";
import { IconInfoCircle } from "@zeeve-platform/icons/essential/outline";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import { usePolygonCdkDashboard } from "../dashboard-context";
import { useSuperNetStore } from "@/store/super-net";

const normalizeBridgeUrl = (value?: string) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
};

const Bridge = () => {
  const { normalized, isLoading } = usePolygonCdkDashboard();
  const superNetInfo = useSuperNetStore((state) => state.superNetInfo);
  const bridgeUrl = useMemo(() => {
    const candidate =
      (normalized?.bridge?.url as string | undefined) ??
      (normalized?.rollupMetadata?.l2?.bridgeUrl as string | undefined) ??
      (normalized?.rollupMetadata?.l1?.bridgeUrl as string | undefined);
    return normalizeBridgeUrl(candidate);
  }, [normalized]);
  const showSkeleton = isLoading && !normalized;
  return (
    <div className="col-span-12 flex flex-col rounded-lg border border-brand-outline">
      {/* <DemoSupernetInfo /> */}
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Heading as="h4">Bridge</Heading>
        </div>
        <p className="mt-1 text-sm text-brand-gray">
          The CDK stack comes with a native bridge with UI that allows you to transfer funds between L1 and L2 Validium.
          Before you can bridge any fund, you also need to add the L1 RPC and L2 RPC to MetaMask. If you already have an
          account with the tokens you provided for pre-mining on L2, then sending tokens from L1 to L2 is a one-step
          process. You can only deposit on L1 and the claim automatically happens on L2. For L2 to L1 token transfer,
          you need to deposit tokens on L2 and then claim those tokens on L1.{" "}
          <Link
            as={"a"}
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.zeeve.io/rollups/polygon-cdk-zkrollups/demo-network/bridge"
          >
            <span className="text-brand-purple">
              Read More <IconArrowUpRightFromSquare className="inline-block" />
            </span>
          </Link>
        </p>
      </div>
      <div className="flex items-center justify-center p-2">
        {showSkeleton ? (
          <Skeleton role="status" as="div" className="flex w-full flex-col items-center">
            <div className="mb-2.5 h-3.5 w-1/12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="mb-1.5 h-3 w-5/12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </Skeleton>
        ) : (
          <>
            <div className="flex flex-col items-center">
              <p className="flex items-center text-sm text-gray-500">Bridge URL</p>
              <div className={"text-sm"}>
                {bridgeUrl ? (
                  <div className="flex items-center gap-2">
                    <Tooltip text={bridgeUrl} placement={"top-start"}>
                      <p
                        className={tx("line-clamp-1", {
                          "text-gray-500 cursor-not-allowed": superNetInfo.data?.status !== "ready",
                        })}
                      >
                        {bridgeUrl}
                      </p>
                    </Tooltip>
                    {superNetInfo.data?.status === "ready" ? (
                      <Tooltip text={"Click to open"} placement={"top-start"}>
                        <Link as={"a"} target="_blank" rel="noopener noreferrer" href={bridgeUrl}>
                          <IconButton
                            className="rounded-md text-xl text-brand-primary focus:ring-offset-0"
                            variant={"text"}
                          >
                            <IconArrowUpRightFromSquare className="text-brand-primary" />
                          </IconButton>
                        </Link>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        text={"You can access bridge once the network is in ready state"}
                        placement={"top-start"}
                      >
                        <div>
                          <IconInfoCircle />
                        </div>
                      </Tooltip>
                    )}
                  </div>
                ) : (
                  "NA"
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Bridge;
