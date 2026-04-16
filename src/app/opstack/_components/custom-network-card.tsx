"use client";
import Image from "next/image";
import Link from "next/link";
import { Heading, Z4DashboardCard, Z4Button, tx } from "@zeeve-platform/ui";
import { KeyValuePair } from "@zeeve-platform/ui-common-components";
import { IconZ4Tick } from "@zeeve-platform/icons/z4/outline";
import { IconArrow1RightCircle, IconChevronSwapLeftRight } from "@zeeve-platform/icons/arrow/outline";
import { IconPhoneVolume } from "@zeeve-platform/icons/phone/outline";
import { withBasePath } from "@/utils/helpers";

type Props = {
  type: "testnet" | "mainnet";
  deployHref?: string;
};

const description = {
  testnet: "The OP Stack testnet is a development environment for testing OP Stack's Layer 2 rollup features.",
  mainnet: "The OP Stack mainnet provides production-ready solutions OP Stack's Layer 2 rollup features.",
};

const CustomNetworkCard = ({ type, deployHref }: Props) => {
  return (
    <div className="col-span-12 flex size-full flex-col lg:col-span-4">
      <Z4DashboardCard cardType={type} className="flex size-full h-max grow flex-col">
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
                  <div className="text-sm font-medium text-[#09122D]">Ethereum Holesky (L1)</div>
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
                    <div className="text-sm font-medium text-[#09122D]">L1 ↔ L2 Bridge</div>
                    <span className="grow"></span>
                    <IconZ4Tick className="size-5" />
                  </span>
                  <span className="flex flex-row gap-1.5">
                    <span className="flex size-5 items-center justify-center rounded-full border border-brand-light bg-white p-1.5 font-medium">
                      <Image
                        src={withBasePath("/assets/images/partners/ethereum.svg")}
                        alt="RPC"
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
                        src={withBasePath("/assets/images/partners/tracehawk.png")}
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
              classNames={{ label: "text-xs font-normal text-[#09122D]" }}
              enableBorder={false}
            />
          </>
        )}

        <div className="flex grow items-center justify-center">
          {type === "mainnet" && (
            <Image src={withBasePath("/assets/images/protocol/dashboard/op.svg")} alt="OP" width={300} height={300} />
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
          <Link className="w-full" href={deployHref ?? "/opstack/deploy?env=testnet"}>
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
