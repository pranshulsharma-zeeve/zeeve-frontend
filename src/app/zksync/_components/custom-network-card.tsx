"use client";
import Image from "next/image";
import Link from "next/link";
import { Heading, Z4DashboardCard, Z4Button, tx } from "@zeeve-platform/ui";
import { KeyValuePair } from "@zeeve-platform/ui-common-components";
import { IconZ4Docs, IconZ4Monitor, IconZ4Tick } from "@zeeve-platform/icons/z4/outline";
import { IconArrow1RightCircle, IconChevronSwapLeftRight } from "@zeeve-platform/icons/arrow/outline";
import { IconEndpoints1 } from "@zeeve-platform/icons/programming/outline";
import { IconLaunch } from "@zeeve-platform/icons/product/outline";
import { IconPhoneVolume } from "@zeeve-platform/icons/phone/outline";
import { getPartnerIconPath } from "@/modules/arbitrum-orbit/constants/partner-icons";
import { withBasePath } from "@/utils/helpers";

type Props = { type: "testnet" | "mainnet"; deployHref?: string };

const description = {
  testnet: "Layer 2 ZK Rollup Testnet using ZKsync ZK Stack.",
  mainnet: "Layer 2 or Layer3 ZK Rollup Mainnet using ZKsync ZK Stack.",
};

const CustomNetworkCard = ({ type, deployHref }: Props) => {
  return (
    <div className="col-span-12 flex size-full flex-col lg:col-span-4">
      <Z4DashboardCard cardType={type} className="flex size-full grow flex-col">
        <div className={tx("flex flex-col items-start gap-3 text-sm", { "text-white": type === "mainnet" })}>
          <Heading
            className={tx(
              { "text-white": type === "mainnet", "text-brand-testnet": type === "testnet" },
              "font-normal text-lg",
            )}
            as="h5"
            style={{ letterSpacing: ".4em" }}
          >
            {type === "testnet" ? "TESTNET" : "MAINNET"}
          </Heading>
          {type === "testnet" ? description.testnet : description.mainnet}
        </div>
        {type === "testnet" && (
          <>
            <KeyValuePair
              label="Settlement Layer"
              value={
                <span className="mt-2 flex flex-row gap-1.5">
                  <span className="flex size-5 items-center justify-center rounded-full border border-brand-light bg-white p-1.5 font-medium">
                    <Image
                      src={withBasePath("/assets/images/partners/ethereum.svg")}
                      alt="Ethereum"
                      width={12}
                      height={12}
                    />
                  </span>
                  <div className="text-sm font-medium text-[#09122D]">Ethereum Sepolia</div>
                  <span className="grow"></span>
                  <IconZ4Tick className="size-5" />
                </span>
              }
              classNames={{ label: "text-xs font-normal text-[#09122D]", container: "border-b border-[#DEDEDE] pb-3" }}
            />
            <KeyValuePair
              label="Data Availability (DA) Layer"
              value={
                <span className="mt-2 flex flex-row gap-1.5">
                  <span className="flex size-5 items-center justify-center rounded-full border border-brand-light bg-white p-1.5 font-medium">
                    <Image
                      src={withBasePath("/assets/images/partners/ethereum.svg")}
                      alt="Ethereum DA"
                      width={12}
                      height={12}
                    />
                  </span>
                  <div className="text-sm font-medium text-[#09122D]">Ethereum DA</div>
                  <span className="grow"></span>
                  <IconZ4Tick className="size-5" />
                </span>
              }
              classNames={{ label: "text-xs font-normal text-[#09122D]", container: "border-b border-[#DEDEDE] pb-3" }}
            />
            <KeyValuePair
              label="Core Components"
              value={
                <div className="mt-1.5 flex flex-col gap-2.5">
                  <span className="flex flex-row gap-1.5">
                    <span className="flex size-5 items-center justify-center rounded-full border border-brand-light bg-white p-1 font-medium">
                      <IconChevronSwapLeftRight />
                    </span>
                    <div className="text-sm font-medium text-[#09122D]">{"L1 <-> L2 Bridge"}</div>
                    <span className="grow"></span>
                    <IconZ4Tick className="size-5" />
                  </span>
                  <span className="flex flex-row gap-1.5">
                    <span className="flex size-5 items-center justify-center rounded-full border border-brand-light bg-white p-1.5 font-medium">
                      <IconEndpoints1 className="size-5 text-black" />
                    </span>
                    <div className="text-sm font-medium text-[#09122D]">Ethereum Sepolia</div>
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
                    <div className="text-sm font-medium text-[#09122D]">Ethereum DA</div>
                    <span className="grow"></span>
                    <IconZ4Tick className="size-5" />
                  </span>
                </div>
              }
              classNames={{ label: "text-xs font-normal text-[#09122D]" }}
              enableBorder={false}
            />
            <KeyValuePair
              label={"Monitoring & SLA"}
              value={
                <div className="mt-1.5 flex flex-col gap-2.5">
                  <span className="flex flex-row gap-1.5">
                    <IconZ4Monitor className="ml-0.5 mt-px size-4" />
                    <div className="text-sm font-medium text-[#09122D]">{"Monitoring Dashboard"}</div>
                    <span className="grow"></span>
                    <IconZ4Tick className="size-5" />
                  </span>

                  <span className="flex flex-row gap-1.5">
                    <IconZ4Docs className="ml-0.5 mt-px size-4" />
                    <div className="text-sm font-medium text-[#09122D]">{"Standard SLA 99.0%"}</div>
                    <span className="grow"></span>
                    <IconZ4Tick className="size-5" />
                  </span>
                  <span className="flex flex-row gap-2">
                    <IconLaunch height={16} width={16} className=" text-brand-archive" />
                    <div className="text-sm font-medium text-[#09122D]">{"Uptime Guarantee"}</div>
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
            <KeyValuePair
              label={"Pricing"}
              value={
                <div className="mt-1.5 flex flex-col gap-2.5">
                  <span className="flex flex-row gap-1.5">
                    <div className="text-sm font-medium text-[#09122D]">{"Monthly Recurring Cost"}</div>
                    <span className="grow"></span>
                    <div className="text-sm font-medium text-[#09122D]">{"$199/month"}</div>
                  </span>
                </div>
              }
              classNames={{
                label: "text-xs font-bold text-[#09122D]",
              }}
              enableBorder={false}
            />
          </>
        )}
        <div className="flex grow items-center justify-center">
          {type === "mainnet" && (
            <Image
              src={withBasePath("/assets/images/protocols/zksync-era-icon.svg")}
              alt="zkSync"
              width={300}
              height={300}
            />
          )}
        </div>
        {type === "mainnet" ? (
          <Link className="w-full" href={`https://www.zeeve.io/talk-to-an-expert/`} target="_blank">
            <Z4Button
              className="h-12 w-full bg-white"
              colorScheme={type}
              variant="ghost"
              iconLeft={<IconPhoneVolume className="text-xl" />}
            >
              Contact Us
            </Z4Button>
          </Link>
        ) : null}
        {type === "testnet" ? (
          <Link className="w-full" href={deployHref ?? "/zksync/deploy?env=testnet"}>
            <Z4Button
              className="h-12 w-full"
              colorScheme={type}
              variant="solid"
              iconLeft={<IconArrow1RightCircle className="size-6" />}
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
