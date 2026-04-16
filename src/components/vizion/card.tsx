"use client";
import React, { ComponentPropsWithoutRef, ElementType, ReactElement, useState } from "react";
import { Button, Link, tx } from "@zeeve-platform/ui";
import { TransactionData } from "@/app/zksync/network/[id]/_components/monitoring/transaction-data/transaction-data-card";
interface ChainData {
  totalBlock?: string;
  avgBlocktime?: number;
  gasTracker?: string | number;
  totalTransaction?: string;
  walletAddress?: string;
  latestBlock?: string | null;
  relativeLinks?: { name: string; url: string }[]; // Array of links
}
interface CardProps extends ComponentPropsWithoutRef<"div"> {
  Icon?: ElementType;
  title?: string;
  data?: ChainData | TransactionData;
  labelTwo?: boolean;
  isTheme?: boolean;
  IconTwo?: ElementType;
  action?: ReactElement;
  switchStatus?: (status: "L1" | "RollUp") => void;
  shouldHideDivider?: boolean;
  alignHeaderExtrasRight?: boolean;
  hideViewButton?: boolean;
}

const Card = (props: CardProps) => {
  const {
    Icon,
    IconTwo,
    isTheme,
    title,
    action,
    data,
    className,
    children,
    alignHeaderExtrasRight,
    hideViewButton = false,
    ...rest
  } = props;
  const [selectedChain, setSelectedChain] = useState<"L1" | "RollUp">("RollUp");

  return (
    <div
      className={tx("relative bg-theme-primary text-theme-gray px-2.5 lg:px-[30px] flex flex-col py-5", className)}
      {...rest}
    >
      {title || Icon || action ? (
        <>
          {/* Card Header */}
          <div className="relative flex flex-col items-start justify-between sm:flex-row sm:items-center lg:px-0">
            {/* Icon and Title */}
            <div className="flex w-full  items-center justify-between gap-3">
              {Icon ? <Icon className="size-auto" /> : null}
              <div className="flex w-full items-center">
                {title ? (
                  <p
                    className={`whitespace-nowrap  font-poppins text-xl font-medium ${!isTheme ? "text-black" : "text-[#FFFFFF]"} lg:text-xl`}
                  >
                    {title}
                  </p>
                ) : null}
                {alignHeaderExtrasRight ? (
                  (data || IconTwo) && (
                    <div className="ml-auto flex items-center gap-2">
                      {data && !hideViewButton && (
                        <div className="p-2">
                          {(() => {
                            const explorerLink = data.relativeLinks?.find((link) => link.name === "EXPLORER URL");
                            return explorerLink?.url ? (
                              <Link href={explorerLink.url} target="_blank" rel="noopener noreferrer">
                                <Button
                                  variant={"outline"}
                                  className="h-6 rounded-md px-3 text-sm font-normal text-[#4054B2]"
                                >
                                  View
                                </Button>
                              </Link>
                            ) : (
                              <Button
                                className="h-6 cursor-not-allowed rounded-md bg-gray-500 px-3 text-white"
                                isDisabled
                              >
                                View
                              </Button>
                            );
                          })()}
                        </div>
                      )}

                      {/* RIGHT: uptime badge */}
                      {IconTwo && (
                        <div className="flex items-end">
                          <IconTwo className="h-6 w-auto" />
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <>
                    {data && !hideViewButton && (
                      <div className="p-2">
                        {(() => {
                          const explorerLink = data.relativeLinks?.find((link) => link.name === "EXPLORER URL");
                          return explorerLink?.url ? (
                            <Link href={explorerLink.url} target="_blank" rel="noopener noreferrer">
                              <Button
                                variant={"outline"}
                                className="h-6 rounded-md px-3 text-sm font-normal text-[#4054B2]"
                              >
                                View
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              className="h-6 cursor-not-allowed rounded-md bg-gray-500 px-3 text-white"
                              isDisabled
                            >
                              View
                            </Button>
                          );
                        })()}
                      </div>
                    )}

                    {/* RIGHT: uptime badge */}
                    {IconTwo && (
                      <div className="flex items-end">
                        <IconTwo className="h-6 w-auto" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Static Labels and Action */}
            {props.labelTwo && (
              <div
                className={`relative flex flex-row items-center gap-2 rounded-lg ${!isTheme ? "bg-[#F5F5F5]" : "bg-black"} p-3`}
              >
                {/* Background Layer */}
                <div className="absolute inset-0 rounded-lg opacity-90"></div>

                {/* Buttons Layer */}
                <div className="relative flex gap-2">
                  {/* RollUp Button */}
                  <button
                    className={`flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-1 text-sm font-normal ${
                      selectedChain === "RollUp"
                        ? `${!isTheme ? "bg-[#4054B2] text-white" : "bg-[#0DC0FA] text-black"}`
                        : `${!isTheme ? "text-black" : "text-white"}`
                    }`}
                    onClick={() => {
                      setSelectedChain("RollUp");
                      if (props.switchStatus) {
                        props.switchStatus("RollUp");
                      }
                    }}
                  >
                    Rollups
                  </button>
                  {/* L1 Button */}
                  <button
                    className={`whitespace-nowrap rounded-md px-3 py-1 text-sm font-normal ${
                      selectedChain === "L1"
                        ? `${!isTheme ? " bg-[#4054B2] text-white" : "bg-[#0DC0FA] text-black"}`
                        : `${!isTheme ? "text-black" : "text-[#FFFFFF]"}`
                    }`}
                    onClick={() => {
                      setSelectedChain("L1");
                      if (props.switchStatus) {
                        props.switchStatus("L1");
                      }
                    }}
                  >
                    L1
                  </button>

                  {action}
                </div>
              </div>
            )}
          </div>
        </>
      ) : null}

      {/* Body */}
      {children}
    </div>
  );
};

export default Card;
