"use client";
import React from "react";
import { Heading, IconButton, Link, Skeleton, Tooltip, tx } from "@zeeve-platform/ui";
import { useParams } from "next/navigation";
import { IconInfoCircle } from "@zeeve-platform/icons/essential/outline";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import DemoNetworkInfo from "../demo-network-info";
import useArbitrumOrbitService from "@orbit/services/arbitrum-orbit/use-arbitrum-orbit-service";
import { useNetworkStore } from "@orbit/store/network";
import { getNetworkStatus } from "@orbit/utils/network-overview";

const Bridge = () => {
  const { id } = useParams();
  const networkId = id as string;
  const networkInfo = useNetworkStore((state) => state.networkInfo);
  const networkStatus = getNetworkStatus(networkInfo.data);

  const {
    request: { isLoading, data },
  } = useArbitrumOrbitService().network.bridgeInfo(networkId, "bridge");

  return (
    <div className="grid grid-cols-12 gap-3 text-brand-dark lg:gap-6">
      <DemoNetworkInfo />
      <div className="col-span-12 flex flex-col rounded-lg border border-brand-outline">
        <div className="p-4">
          <div className="mb-1 flex items-center justify-between">
            <Heading as="h4">Bridge</Heading>
          </div>
          <p className="mt-1 text-sm text-brand-gray">
            The Arbitrum Orbit comes with a native bridge with UI that allows you to transfer funds between L1, L2 and
            L3 Chains. Before you can bridge any fund, you also need to add the L1 RPC, L2 RPC & L3 RPC to MetaMask. You
            can only deposit on L1 and the claim automatically happens on L2 & L3. For L2 to L1 token transfer, you need
            to deposit tokens on L2 and then claim those tokens on L1.
          </p>
        </div>
        <div className="flex items-center justify-center p-2">
          {/* <div className="flex flex-col items-center">
            <IconPhoneVolume className="m-auto text-4xl text-brand-blue" />
            <p className="text-center text-base font-semibold">Contact Us</p>
            <p className="text-sm text-brand-gray">Please reach out to us for bridge integration.</p>
          </div> */}
          {isLoading ? (
            <Skeleton role="status" as="div" className="flex w-full flex-col items-center">
              <div className="mb-2.5 h-3.5 w-1/12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="mb-1.5 h-3 w-5/12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </Skeleton>
          ) : (
            <div className="flex flex-col items-center">
              <p className="flex items-center text-sm text-gray-500">Bridge URL</p>
              <div className={"text-sm"}>
                {data?.data.endpoint ? (
                  <div className="flex items-center gap-2">
                    <Tooltip text={data?.data.endpoint} placement={"top-start"}>
                      <p
                        className={tx("line-clamp-1", {
                          "text-gray-500 cursor-not-allowed": networkStatus !== "ready",
                        })}
                      >
                        {data?.data.endpoint}
                      </p>
                    </Tooltip>
                    {networkStatus === "ready" ? (
                      <Tooltip text={"Click to open"} placement={"top-start"}>
                        <Link as={"a"} target={"_blank"} rel="noopener noreferrer" href={data?.data.endpoint}>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Bridge;
