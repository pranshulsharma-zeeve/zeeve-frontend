"use client";
import { Z4SummaryCard, tx } from "@zeeve-platform/ui";
import Image from "next/image";
import { IconCheckSquare } from "@zeeve-platform/icons/essential/outline";
import { IconZ4Alert, IconZ4Chat, IconZ4Docs, IconZ4Monitor } from "@zeeve-platform/icons/z4/outline";
import { withBasePath } from "@/utils/helpers";

export type ZkDeploySummaryState = {
  networkName?: string;
  chainId?: string;
  settlementLayer?: string;
  dataAvailability?: string;
};

const DeploySummary = ({
  isValid,
  isSubmitting,
  formState,
}: {
  isValid: boolean;
  isSubmitting: boolean;
  formState: ZkDeploySummaryState;
}) => {
  const components = [
    { title: `${formState.networkName ? `${formState.networkName}: ` : ""} zkSync Hyperchain`, listedComponents: [] },
    {
      title: "Configuration",
      listedComponents: [
        <div key="settlement" className="flex items-center gap-3 text-sm font-normal">
          <Image
            src={withBasePath("/assets/images/protocol/deploy/circle-check-no-border.svg")}
            alt=""
            width={20}
            height={20}
          />
          <span>Settlement Layer</span>
          <span className="grow"></span>
          <div className="flex flex-row items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-white p-1.5 font-medium">
              <Image src={withBasePath("/assets/images/partners/ethereum.svg")} alt="Ethereum" width={20} height={20} />
            </span>
            <span className="font-medium">{formState.settlementLayer || "-"}</span>
          </div>
        </div>,
        <div key="da" className="mb-1 flex items-center gap-3 text-sm font-normal">
          <Image
            src={withBasePath("/assets/images/protocol/deploy/circle-check-no-border.svg")}
            alt=""
            width={20}
            height={20}
          />
          <span>Data Availability Layer</span>
          <span className="grow"></span>
          <div className="flex flex-row items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-white p-1.5 font-medium">
              <Image
                src={withBasePath("/assets/images/partners/ethereum.svg")}
                alt="Ethereum DA"
                width={20}
                height={20}
              />
            </span>
            <span className="font-medium">{formState.dataAvailability || "-"}</span>
          </div>
        </div>,
      ],
    },
    {
      title: "Core Components",
      listedComponents: [
        <div key="rpc" className="flex items-center gap-3 text-sm font-medium">
          <Image
            src={withBasePath("/assets/images/protocol/deploy/circle-check-no-border.svg")}
            alt=""
            width={20}
            height={20}
          />
          <span>RPC</span>
          <span className="grow"></span>
          <span className="flex flex-row gap-1 font-normal text-[#7C7C7C]">
            <IconCheckSquare className="size-5 text-white" fill="#1832AE" /> HTTPS
          </span>
          <span className="flex flex-row gap-1 font-normal text-[#7C7C7C]">
            <IconCheckSquare className="size-5 text-white" fill="#1832AE" /> WSS
          </span>
        </div>,
      ],
    },
    {
      title: "Tools and Services",
      listedComponents: [
        <div key="tracehawk" className="flex items-center gap-3 text-sm font-medium">
          <Image
            src={withBasePath("/assets/images/protocol/deploy/tracehawk.png")}
            alt="TraceHawk"
            width={20}
            height={20}
          />
          <span>TraceHawk</span>
          <span className="grow"></span>
        </div>,
        <div key="traceye" className="mb-1 flex items-center gap-3 text-sm font-medium">
          <Image
            src={withBasePath("/assets/images/protocol/deploy/traceye.png")}
            alt="Traceye"
            width={20}
            height={20}
          />
          <span>Traceye</span>
          <span className="grow"></span>
        </div>,
      ],
    },
    {
      title: "Monitoring & SLA",
      listedComponents: [
        <div key="m1" className="flex items-center gap-3 text-sm font-medium">
          <IconZ4Monitor className="size-5" />
          <span>Monitoring Dashboard</span>
        </div>,
        <div key="m2" className="flex items-center gap-3 text-sm font-medium">
          <IconZ4Alert className="size-5" />
          <span>Alerts and Notification</span>
        </div>,
        <div key="m3" className="flex items-center gap-3 text-sm font-medium">
          <IconZ4Docs className="size-5" />
          <span>Standard SLA 99.0% Uptime Guarantee</span>
        </div>,
        <div key="m4" className="flex items-center gap-3 text-sm font-medium">
          <IconZ4Chat className="size-5" />
          <span>24/7 Tech Support</span>
        </div>,
      ],
    },
  ];

  const pricing = [
    <div key="price" className="flex justify-between pb-2">
      <span>Monthly Recurring Cost</span>
      <span className={tx("font-medium")}>$199/month</span>
    </div>,
  ];

  return (
    <Z4SummaryCard
      className="w-full"
      isLoading={isSubmitting}
      cardType="testnet"
      cardHeading="Summary"
      priceCardHeading="Pricing"
      onDeployClick={() => {}}
      componentList={components}
      pricingComponentList={pricing}
      deployButtonText="Deploy"
      deployButtonProps={{
        type: "submit",
        className: "h-12",
        isDisabled: !isValid || isSubmitting,
        isLoading: isSubmitting,
      }}
    />
  );
};

export default DeploySummary;
