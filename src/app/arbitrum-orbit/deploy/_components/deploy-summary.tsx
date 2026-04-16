import { tx, Z4SummaryCard } from "@zeeve-platform/ui";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IconCheckSquare } from "@zeeve-platform/icons/essential/outline";
import { IconZ4Alert, IconZ4Chat, IconZ4Docs, IconZ4Monitor } from "@zeeve-platform/icons/z4/outline";
import { useEffect } from "react";
import { DeployNetworkSchemaType } from "../page-client";
import { withBasePath } from "@orbit/utils/helpers";
import { getPartnerIconPath } from "@orbit/constants/partner-icons";
import ROUTES from "@orbit/routes";

export default function DeploySummary({
  isValid,
  isSubmitting,
  formState,
  demoNetworkId,
}: {
  isValid: boolean;
  isSubmitting: boolean;
  formState: DeployNetworkSchemaType;
  demoNetworkId?: string;
}) {
  const isDemo = demoNetworkId ? true : false;
  const router = useRouter();
  useEffect(() => {
    console.log(isSubmitting);
  }, [isSubmitting]);
  const randomComponents = [
    {
      title: `${formState.networkName ? `${formState.networkName}: ` : ""} Arbitrum L3 Rollup`,
      listedComponents: [],
    },
    {
      title: `Configuration`,
      listedComponents: [
        <div key="config-native-token" className="flex items-center gap-3 text-sm font-normal">
          <Image
            src={withBasePath("/assets/images/protocol/deploy/circle-check-no-border.svg")}
            alt={""}
            width={"20"}
            height={"20"}
          />
          <span>Native Gas Token</span>
          <span className="grow"></span>
          <div className="flex flex-row items-center gap-2">
            {formState.externalDA.NativeGasToken !== "ETH" ? (
              <span className="flex size-5 items-center justify-center rounded-full font-medium">
                <Image src={withBasePath(getPartnerIconPath("custom"))} alt="Custom Logo" width={24} height={24} />
              </span>
            ) : (
              <span className="flex size-5 items-center justify-center rounded-full bg-white p-1.5 font-medium">
                <Image src={withBasePath(getPartnerIconPath("ethereum"))} alt="Ethereum Logo" width={20} height={20} />
              </span>
            )}
            <span className="font-medium">
              {formState.externalDA.NativeGasToken !== "ETH" ? formState.externalDA.tokenName : "ETH"}
            </span>
          </div>
        </div>,
        <div key="config-settlement" className="flex items-center gap-3 text-sm font-normal">
          <Image
            src={withBasePath("/assets/images/protocol/deploy/circle-check-no-border.svg")}
            alt={""}
            width={"20"}
            height={"20"}
          />
          <span>Settlement Layer</span>
          <span className="grow"></span>
          <div className="flex flex-row items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-white p-1 font-medium">
              <Image
                src={withBasePath(getPartnerIconPath("arbitrum-orbit"))}
                alt="Arbitrum Logo"
                width={20}
                height={20}
              />
            </span>
            <span className="font-medium">{formState.settlementLayer || "-"}</span>
          </div>
        </div>,
        <div key="config-da" className="mb-1 flex items-center gap-3 text-sm font-normal">
          <Image
            src={withBasePath("/assets/images/protocol/deploy/circle-check-no-border.svg")}
            alt={""}
            width={"20"}
            height={"20"}
          />
          <span>Data Availability Layer</span>
          <span className="grow"></span>
          <div className="flex flex-row items-center gap-2">
            {formState.externalDA.externalDaType === "OnChainDataAvailability" && (
              <span className="flex size-5 items-center justify-center rounded-full bg-white p-1.5 font-medium">
                <Image src={withBasePath(getPartnerIconPath("ethereum"))} alt="Ethereum Logo" width={20} height={20} />
              </span>
            )}
            {formState.externalDA.externalDaType === "LocalDA" && (
              <span className="flex size-5 items-center justify-center rounded-full bg-white p-1 font-medium">
                <Image
                  src={withBasePath(getPartnerIconPath("arbitrum-orbit"))}
                  alt="Arbitrum Logo"
                  width={20}
                  height={20}
                />
              </span>
            )}
            <span className="font-medium">
              {formState.externalDA.externalDaType === "OnChainDataAvailability"
                ? "Ethereum DA"
                : formState.externalDA.externalDaType === "LocalDA"
                  ? "AnyTrust DA"
                  : "Alt DA"}
            </span>
          </div>
        </div>,
      ],
    },
    {
      title: "Core Components",
      listedComponents: [
        <div key="core-bridge" className="flex items-center gap-3 text-sm font-medium">
          <Image
            src={withBasePath("/assets/images/protocol/deploy/circle-check-no-border.svg")}
            alt={""}
            width={"20"}
            height={"20"}
          />
          <span>L2 {"<->"} L3 Bridge</span>
          <span className="grow"></span>
        </div>,
        <div
          key="core-rpc"
          className={`${!formState.externalDA.tokenName && "mb-1"} flex items-center gap-3 text-sm font-medium`}
        >
          <Image
            src={withBasePath("/assets/images/protocol/deploy/circle-check-no-border.svg")}
            alt={""}
            width={"20"}
            height={"20"}
          />
          <span>RPC</span>
          <span className="grow"></span>
          <span className="flex flex-row gap-1 font-normal text-[#7C7C7C]">
            <IconCheckSquare className="size-5 text-white" fill="#1832AE" /> HTTPS
          </span>
          <span className="flex flex-row gap-1 font-normal text-[#7C7C7C]">
            <IconCheckSquare className="size-5 text-white" fill="#1832AE" /> WSS
          </span>{" "}
        </div>,
        formState.externalDA.tokenName ? (
          <div key="core-faucet" className="mb-1 flex items-center gap-3 text-sm font-medium">
            <Image
              src={withBasePath("/assets/images/protocol/deploy/circle-check-no-border.svg")}
              alt={""}
              width={"20"}
              height={"20"}
            />
            <span>Faucet</span>
            <span className="grow"></span>
          </div>
        ) : (
          <></>
        ),
      ],
    },
    {
      title: "Tools and Services",
      listedComponents: [
        <div key="tools-tracehawk" className="flex items-center gap-3 text-sm font-medium">
          <Image
            src={withBasePath("/assets/images/protocol/deploy/tracehawk.png")}
            alt={""}
            width={"20"}
            height={"20"}
          />
          <span>TraceHawk</span>
          <span className="grow"></span>
        </div>,
        <div key="tools-traceye" className="mb-1 flex items-center gap-3 text-sm font-medium">
          <Image src={withBasePath("/assets/images/protocol/deploy/traceye.png")} alt={""} width={"20"} height={"20"} />
          <span>Traceye</span>
          <span className="grow"></span>
        </div>,
      ],
    },
    {
      title: "Monitoring & SLA",
      listedComponents: [
        <div key="sla-monitoring" className="flex items-center gap-3 text-sm font-medium">
          <IconZ4Monitor className="size-5" />
          <span>Monitoring Dashboard</span>
        </div>,
        <div key="sla-alerts" className="flex items-center gap-3 text-sm font-medium">
          <IconZ4Alert className="size-5" />
          <span>Alerts and Notification</span>
        </div>,
        <div key="sla-uptime" className="flex items-center gap-3 text-sm font-medium">
          <IconZ4Docs className="size-5" />
          <span>Standard SLA 99.0% Uptime Guarantee </span>
        </div>,
        <div key="sla-support" className="flex items-center gap-3 text-sm font-medium">
          <IconZ4Chat className="size-5" />
          <span>24/7 Tech Support</span>
        </div>,
      ],
    },
  ];

  const pricingComponents = [
    // <div key="price1" className="flex justify-between border-b border-[#BFC7F1] pb-2">
    //   <span>
    //     Deployment Cost
    //     <Tooltip text="Deployment cost of the network." placement="top-start">
    //       <IconButton variant="text" colorScheme="gray">
    //         &nbsp;
    //         <IconInfoCircle className="stroke-black text-sm text-black" />
    //       </IconButton>
    //     </Tooltip>
    //   </span>
    //   <span>Free</span>
    // </div>,
    <div key="price2" className="flex justify-between pb-2">
      <span>Monthly Recurring Cost</span>
      <span>
        <span className={tx({ "line-through": isDemo })}>$199/month</span>
        {isDemo && <span>&nbsp;Free</span>}
      </span>
    </div>,
  ];

  return (
    <div className="grid h-min w-full grid-cols-12 gap-3">
      <Z4SummaryCard
        className="col-span-12 hidden sm:block"
        isLoading={isSubmitting}
        cardType={isDemo ? "demo" : "testnet"}
        onDeployClick={() => {
          if (isDemo) {
            router.push(withBasePath(`${ROUTES.ARBITRUM_ORBIT.PAGE.NETWORK}/${demoNetworkId}`));
          }
        }}
        deployButtonText={isDemo ? "View Dashboard" : "Deploy Testnet"}
        cardHeading="Summary"
        priceCardHeading="Pricing"
        componentList={randomComponents}
        deployButtonProps={{
          type: isDemo ? "button" : "submit",
          className: "h-12",
          isDisabled: isDemo ? false : !isValid || isSubmitting,
          isLoading: isSubmitting,
        }}
        pricingComponentList={pricingComponents}
      />
      <Z4SummaryCard
        className="col-span-12 block sm:hidden"
        isLoading={isSubmitting}
        cardType={isDemo ? "demo" : "testnet"}
        onDeployClick={() => {
          if (isDemo) {
            router.push(withBasePath(`${ROUTES.ARBITRUM_ORBIT.PAGE.NETWORK}/${demoNetworkId}`));
          }
        }}
        deployButtonText={isDemo ? "View Dashboard" : "Deploy Testnet"}
        cardHeading="Summary"
        priceCardHeading="Pricing"
        componentList={randomComponents}
        deployButtonProps={{
          type: isDemo ? "button" : "submit",
          className: "h-12",
          isDisabled: isDemo ? false : !isValid || isSubmitting,
          isLoading: isSubmitting,
        }}
        pricingComponentList={pricingComponents}
      />
    </div>
  );
}
