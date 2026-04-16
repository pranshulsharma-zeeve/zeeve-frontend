"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, tx, Z4Button } from "@zeeve-platform/ui";
import { rollupAppchainDeploymentOptions } from "@/app/select-rollup-appchain/page-client";
import { withBasePath } from "@/utils/helpers";
import { NewTooltip } from "@/components/ui/new-tooltip";

const baseCardClasses =
  "relative flex h-full min-h-[200px] flex-col gap-4 rounded-xl border border-[#E4EBF8] bg-gradient-to-br from-white via-[#F8FAFF] to-[#EEF4FF] p-6 shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-[#1B1145] dark:via-[#160F3A] dark:to-[#120B2E] [html.theme-black_&]:from-[#1C1C1C] [html.theme-black_&]:via-[#181818] [html.theme-black_&]:to-[#131313]";

const IconChip = ({ src, label, onClick }: { src: string; label: string; onClick?: () => void }) => (
  <NewTooltip text={label} size="small">
    <div
      className={tx(
        "flex size-9 shrink-0 items-center justify-center rounded-full border border-[#E3E9F6] bg-white shadow-sm transition-all hover:-translate-y-0.5 dark:border-white/10 dark:bg-[var(--chip-dark)]",
        onClick ? "cursor-pointer" : "cursor-default",
      )}
      onClick={onClick}
    >
      <Image src={withBasePath(src)} alt={label} width={36} height={36} className="size-6 object-contain" />
    </div>
  </NewTooltip>
);

const AppchainsRollupsCard = ({ onNavigate }: { onNavigate?: () => void }) => {
  const router = useRouter();

  return (
    <div className={tx(baseCardClasses, "justify-between")}>
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <div className="text-base font-bold text-[#0E2B6E] dark:text-white">Appchains & Rollups</div>
          <p className="mt-1 text-xs font-normal leading-normal text-[#53607F] dark:text-[#8AB4FF]">
            Launch rollups and appchains with managed infra, monitoring, and turnkey tooling.
          </p>
        </div>
        <Button
          variant="text"
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#EBF6FF] px-[10px] py-[12px] text-[#006CFF] hover:text-[#4A3BEF] dark:text-[#8AB4FF]"
          aria-label="View all appchains and rollups"
          onClick={() => {
            onNavigate?.();
            router.push("/select-rollup-appchain");
          }}
        >
          <span className="text-lg leading-none">{">"}</span>
        </Button>
      </div>
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center justify-center rounded-md bg-[#EBF6FF] px-2 py-1 font-normal uppercase text-[#365C8F] dark:text-[#8AB4FF]">
            Featured
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {rollupAppchainDeploymentOptions.slice(0, 6).map((option) => (
            <IconChip
              key={option.id}
              src={`/assets/images/protocols/${option.image}`}
              label={option.title}
              onClick={() => {
                if (option.url.startsWith("http")) {
                  window.open(option.url, "_blank", "noopener,noreferrer");
                } else {
                  onNavigate?.();
                  router.push(option.url);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const SmartNodesCard = ({ onNavigate }: { onNavigate?: () => void }) => {
  const router = useRouter();
  const smartNodeIcons = ["polygon", "near", "tezos", "avalanche", "coreum", "shardeum"];

  return (
    <div className={tx(baseCardClasses, "justify-between")}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-base font-bold text-[#0E2B6E] dark:text-white">Smart Nodes</div>
          <p className="mt-1 text-xs font-normal leading-normal text-[#53607F] dark:text-[#8AB4FF]">
            Spin up RPC, archive, and validator nodes with high availability and auto-healing.
          </p>
        </div>
        <Button
          variant="text"
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#EBF6FF] px-[10px] py-[12px] text-[#006CFF] hover:text-[#4A3BEF] dark:text-[#8AB4FF]"
          aria-label="View all smart nodes"
          onClick={() => router.push("/manage/nodes/validator/protocols")}
        >
          <span className="text-lg leading-none">{">"}</span>
        </Button>
      </div>
      <div className="">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center justify-center rounded-md bg-[#EBF6FF] px-2 py-1 font-normal uppercase text-[#365C8F] dark:text-[#8AB4FF]">
            Featured
          </div>
          <Button
            variant="text"
            className="flex items-center justify-center rounded-md text-xs font-medium text-[#365C8F] underline hover:bg-[#E1E8F5] dark:text-[#8AB4FF] dark:hover:bg-[#8AB4FF]"
            onClick={() => {
              onNavigate?.();
              router.push("/manage/nodes/validator/protocols");
            }}
          >
            View All
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {smartNodeIcons.map((protocol) => (
            <IconChip
              key={protocol}
              src={`/assets/images/protocols/${protocol}-icon.svg`}
              label={`Deploy ${protocol}`}
              onClick={() => {
                onNavigate?.();
                router.push(`/manage/nodes/validator/protocols?protocol=${protocol}`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const TraceServiceCard = ({
  title,
  description,
  logo,
  onClick,
}: {
  title: string;
  description: string;
  logo: string;
  onClick?: () => void;
}) => (
  <div className={tx(baseCardClasses, "justify-between")}>
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center dark:bg-[var(--chip-dark)] dark:ring-white/10">
          <Image src={withBasePath(logo)} alt={title} width={28} height={28} className="object-contain" />
        </div>
        <div className="min-w-0">
          <div className="text-base font-bold text-[#0E2B6E] dark:text-white">{title}</div>
          <p className="mt-1 text-xs font-normal leading-normal text-[#53607F] dark:text-slate-300">{description}</p>
        </div>
      </div>
      <Button
        variant="text"
        className="flex shrink-0 items-center justify-center p-0 text-[#006CFF] hover:text-[#4A3BEF] dark:text-[#8AB4FF]"
        aria-label={`View ${title}`}
        onClick={() => {
          onClick?.();
        }}
      >
        <Image
          src={withBasePath("/assets/images/dashboard-v2/export.svg")}
          alt="Monitoring"
          width={30}
          height={30}
          priority
          style={{
            filter:
              "brightness(0) saturate(100%) invert(18%) sepia(99%) saturate(4120%) hue-rotate(220deg) brightness(88%) contrast(112%)",
          }}
        />
      </Button>
    </div>
    <Z4Button
      type="button"
      onClick={onClick}
      className="inline-flex w-full min-w-0 items-center justify-center gap-2 self-start rounded-xl bg-[#006CFF] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 sm:w-auto lg:w-full xl:w-1/2"
    >
      <span className="min-w-0 whitespace-nowrap leading-none">Explore Now</span>
      <Image
        src={withBasePath("/assets/images/dashboard-v2/export.svg")}
        alt="Export"
        width={16}
        height={16}
        priority
        className="shrink-0"
      />
    </Z4Button>
  </div>
);

const StartServiceSection = ({ onNavigate }: { onNavigate?: () => void }) => {
  return (
    <section className="flex flex-col gap-8 from-[#F7FAFF] via-[#F2F6FF] to-[#ECF2FF] p-4 dark:from-[#1B1145] dark:via-[#160F3A] dark:to-[#120B2E] [html.theme-black_&]:from-[#1C1C1C] [html.theme-black_&]:via-[#181818] [html.theme-black_&]:to-[#131313]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-medium text-[#0E2B6E] dark:text-white">Start a Service</h2>
      </div>
      <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AppchainsRollupsCard onNavigate={onNavigate} />
        <SmartNodesCard onNavigate={onNavigate} />
        <TraceServiceCard
          title="TraceHawk"
          description="Cross-chain tracing and security monitoring for deployments."
          logo="/assets/images/dashboard-v2/tracehawk.png"
          onClick={() => window.open("https://tracehawk.io", "_blank", "noopener,noreferrer")}
        />
        <TraceServiceCard
          title="Traceye"
          description="Governance and compliance insights for production networks."
          logo="/assets/images/dashboard-v2/traceye.png"
          onClick={() => window.open("https://traceye.io", "_blank", "noopener,noreferrer")}
        />
      </div>
    </section>
  );
};

const ServiceSpotlightCard = ({
  title,
  description,
  logo,
  onClick,
}: {
  title: string;
  description: string;
  logo: string;
  onClick?: () => void;
}) => (
  <div className={tx(baseCardClasses, "gap-4")}>
    <div className="flex items-center gap-3">
      <div className="flex size-11 items-center justify-center rounded-xl bg-[#EEF2FF] shadow-sm ring-1 ring-[#E1E8F5] dark:bg-[var(--chip-dark)] dark:ring-white/10">
        <Image src={withBasePath(logo)} alt={title} width={28} height={28} className="object-contain" />
      </div>
      <div>
        <div className="text-[15px] font-semibold text-slate-900 dark:text-white">{title}</div>
        <p className="text-xs leading-normal text-slate-500 dark:text-slate-300">{description}</p>
      </div>
    </div>
    <Button
      size="small"
      variant="outline"
      className="mt-auto h-9 w-full rounded-xl border-[#5D4CFF] px-4 text-xs font-semibold text-[#5D4CFF] hover:bg-[#5D4CFF] hover:text-white dark:border-[#8AB4FF] dark:text-[#8AB4FF] dark:hover:bg-[#8AB4FF] dark:hover:text-[#0B0B2C]"
      isDisabled={!onClick}
      onClick={onClick}
    >
      Explore Now
    </Button>
  </div>
);

const ServiceSpotlightSection = () => {
  const router = useRouter();
  const services = [
    {
      title: "Vizion",
      description: "Observability and analytics for rollups and appchains.",
      logo: "/assets/images/protocol/vision_logo.svg",
      onClick: () => router.push("/vizion"),
    },
    {
      title: "TraceHawk",
      description: "Cross-chain tracing and security monitoring for deployments.",
      logo: "/assets/images/dashboard-v2/tracehawk.png",
    },
    {
      title: "Traceye",
      description: "Governance and compliance insights for production networks.",
      logo: "/assets/images/dashboard-v2/traceye.png",
    },
  ];

  return (
    <section className="grid grid-cols-3 items-stretch gap-6">
      {services.map((service) => (
        <ServiceSpotlightCard key={service.title} {...service} />
      ))}
    </section>
  );
};

export { AppchainsRollupsCard, SmartNodesCard, StartServiceSection, ServiceSpotlightSection };
