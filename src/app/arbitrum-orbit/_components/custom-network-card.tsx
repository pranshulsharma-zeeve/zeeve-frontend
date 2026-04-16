"use client";

import Image from "next/image";
import Link from "next/link";
import { Heading, Z4DashboardCard, Z4Button, tx } from "@zeeve-platform/ui";
import React, { useState } from "react";
import { IconPhoneVolume } from "@zeeve-platform/icons/phone/outline";
import { KeyValuePair } from "@zeeve-platform/ui-common-components";
import { IconZ4Tick } from "@zeeve-platform/icons/z4/outline";
import { IconArrow1RightCircle, IconChevronSwapLeftRight } from "@zeeve-platform/icons/arrow/outline";
import ROUTES from "@orbit/routes";
import { withBasePath } from "@orbit/utils/helpers";
import { getPartnerIconPath } from "@orbit/constants/partner-icons";

interface CustomNetworkCardProps {
  type: "testnet" | "mainnet";
}

const description = {
  testnet:
    "The Arbitrum Orbit testnet is a development environment for testing Arbitrum Orbit's Layer 3 rollup features.",
  mainnet: "The Arbitrum Orbit mainnet provides production-ready solutions Arbitrum Orbit's Layer 3 rollup features.",
};

const CustomNetworkCard = ({ type }: CustomNetworkCardProps) => {
  const [isNavigating, setIsNavigating] = useState(false);
  return (
    <div className="col-span-12 flex size-full flex-col lg:col-span-4">
      <Z4DashboardCard
        cardType={type}
        className="flex size-full grow flex-col"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={tx("flex flex-col items-start gap-3 text-sm", { "text-white": type == "mainnet" })}>
          <Heading
            className={tx(
              { "text-white": type == "mainnet", "text-brand-testnet": type == "testnet" },
              "font-normal text-lg",
            )}
            as={"h5"}
            style={{
              letterSpacing: ".4em",
            }}
          >
            {type == "testnet" ? "TESTNET" : "MAINNET"}
          </Heading>
          {type == "testnet" ? description.testnet : description.mainnet}
        </div>

        {type === "testnet" && (
          <>
            <KeyValuePair
              label={"Settlement Layer"}
              value={
                <span className="mt-2 flex flex-row gap-1.5">
                  <span className="flex size-5 items-center justify-center rounded-full border border-brand-light bg-white p-1 font-medium">
                    <Image
                      src={withBasePath(getPartnerIconPath("arbitrum-orbit"))}
                      alt="Arbitrum Logo"
                      width={20}
                      height={20}
                    />
                  </span>
                  <div className="text-sm font-medium text-[#09122D]">Arbitrum Sepolia (L2)</div>
                  <span className="grow"></span>
                  <IconZ4Tick className="size-5" />
                </span>
              }
              classNames={{
                label: "text-xs font-normal text-[#09122D]",
                container: "border-b border-[#DEDEDE] pb-3",
              }}
            />
            <KeyValuePair
              label={"Data Availability (DA) Layer"}
              value={
                <span className="mt-2 flex flex-row gap-1.5">
                  <span className="flex size-5 items-center justify-center rounded-full border border-brand-light bg-white p-1.5 font-medium">
                    <Image
                      src={withBasePath(getPartnerIconPath("ethereum"))}
                      alt="Ethereum Logo"
                      width={20}
                      height={20}
                    />
                  </span>
                  <div className="text-sm font-medium text-[#09122D]">Ethereum DA / AnyTrust DA</div>
                  <span className="grow"></span>
                  <IconZ4Tick className="size-5" />
                </span>
              }
              classNames={{
                label: "text-xs font-normal text-[#09122D]",
                container: "border-b border-[#DEDEDE] pb-3",
              }}
            />
            <KeyValuePair
              label={"Core Components"}
              value={
                <div className="mt-1.5 flex flex-col gap-2.5">
                  <span className="flex flex-row gap-1.5">
                    <span className="flex size-5 items-center justify-center rounded-full border border-brand-light bg-white p-1 font-medium">
                      <IconChevronSwapLeftRight />
                    </span>
                    <div className="text-sm font-medium text-[#09122D]">{"L2 <-> L3 Bridge"}</div>
                    <span className="grow"></span>
                    <IconZ4Tick className="size-5" />
                  </span>
                  <span className="flex flex-row gap-1.5">
                    <span className="flex size-5 items-center justify-center rounded-full border border-brand-light bg-white font-medium">
                      <Image
                        src={withBasePath(getPartnerIconPath("arbitrum-orbit"))}
                        alt="Arbitrum Logo"
                        width={12}
                        height={12}
                      />
                    </span>
                    <div className="text-sm font-medium text-[#09122D]">RPC</div>
                    <span className="grow"></span>
                    <IconZ4Tick className="size-5" />
                  </span>
                  <span className="flex flex-row gap-1.5">
                    <span className="flex size-5 items-center justify-center rounded-full border border-brand-light bg-white font-medium">
                      <Image
                        src={withBasePath(getPartnerIconPath("tracehawk"))}
                        alt="Tracehawk Logo"
                        width={12}
                        height={12}
                      />
                    </span>
                    <div className="text-sm font-medium text-[#09122D]">Tracehawk Block Explorer</div>
                    <span className="grow"></span>
                    <IconZ4Tick className="size-5" />
                  </span>
                </div>
              }
              classNames={{
                label: "text-xs font-normal text-[#09122D]",
              }}
              enableBorder={false}
            />
          </>
        )}

        <div className="flex grow items-center justify-center">
          {type == "mainnet" && (
            <Image
              src={withBasePath("/assets/images/arbitrum-orbit/mainnet-bg.svg")}
              alt="Arbitrum Orbit Mainnet BG Logo"
              width={300}
              height={300}
              priority
            />
          )}
        </div>
        {type == "mainnet" ? (
          <Link className="w-full" href={`https://www.zeeve.io/talk-to-an-expert/`} target="_blank">
            <Z4Button
              className="h-12 w-full bg-white"
              colorScheme={type}
              variant={"ghost"}
              iconLeft={<IconPhoneVolume className="text-xl" />}
            >
              Contact Us
            </Z4Button>
          </Link>
        ) : null}
        {type == "testnet" ? (
          <Link className="w-full" href={`${ROUTES.ARBITRUM_ORBIT.PAGE.DEPLOY}`}>
            <Z4Button
              className="h-12 w-full"
              colorScheme={type}
              variant={"solid"}
              iconLeft={<IconArrow1RightCircle className="size-6" />}
              onClick={() => {
                setIsNavigating(true);
              }}
              isLoading={isNavigating}
            >
              Deploy Testnet
            </Z4Button>
          </Link>
        ) : null}
      </Z4DashboardCard>
    </div>
  );
};

export default CustomNetworkCard;
