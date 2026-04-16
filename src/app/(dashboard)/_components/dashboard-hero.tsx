"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Z4Button, Spinner, tx } from "@zeeve-platform/ui";
import { SubscriptionSummaryItem } from "@/services/platform/subscription/summary";
import { toCapitalize, toShortString, withBasePath } from "@/utils/helpers";

interface DashboardHeroProps {
  subscriptionData?: (SubscriptionSummaryItem & { protocolType: string })[];
  isLoading: boolean;
  onNavigate?: () => void;
}

const FILTERS = [
  { id: "all", label: "All Products" },
  { id: "rollup", label: "Rollups" },
  // { id: "appchain", label: "Appchains/Sovereign L1s" },
  { id: "nodes", label: "Smart Nodes" },
] as const;

const DashboardHero = ({ subscriptionData, isLoading, onNavigate }: DashboardHeroProps) => {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [activeSlide, setActiveSlide] = useState(0);
  const hasSubscriptions = Boolean(subscriptionData && subscriptionData.length > 0);

  const filteredSubscriptions = useMemo(() => {
    if (!subscriptionData) {
      return [];
    }
    if (activeFilter === "all") {
      return subscriptionData;
    }
    if (activeFilter === "nodes") {
      return subscriptionData.filter((item) => item.protocolType === "public");
    }
    return subscriptionData.filter((item) => item.protocolType === "rollup");
  }, [activeFilter, subscriptionData]);

  React.useEffect(() => {
    setActiveSlide(0);
  }, [activeFilter, filteredSubscriptions.length]);

  // Calculate counts for each filter
  const filterCounts = useMemo(() => {
    if (!subscriptionData) {
      return { all: 0, rollup: 0, appchain: 0, nodes: 0 };
    }
    return {
      all: subscriptionData.length,
      rollup: subscriptionData.filter((item) => item.protocolType === "rollup").length,
      appchain: subscriptionData.filter((item) => item.protocolType === "rollup").length,
      nodes: subscriptionData.filter((item) => item.protocolType === "public").length,
    };
  }, [subscriptionData]);

  const filterButtonBaseClass =
    "inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006CFF]/40";
  const getFilterButtonClasses = (isActive: boolean) =>
    tx(
      filterButtonBaseClass,
      isActive
        ? "border-[#006CFF] bg-[#006CFF] text-white shadow-[0_6px_14px_rgba(0,108,255,0.3)]"
        : "text-[#0E2B6E] hover:border-[#006CFF] hover:text-[#006CFF] dark:border-white/20 dark:bg-white/5 dark:text-slate-200 dark:hover:border-[#8AB4FF] dark:hover:text-white",
    );
  const getFilterBadgeClasses = (isActive: boolean) =>
    tx(
      "rounded-full px-2 py-0.5 text-xs font-semibold",
      isActive ? "bg-white/95 text-[#006CFF]" : "bg-[#EEF2FF] text-[#006CFF] dark:bg-white/10 dark:text-white",
    );

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-[var(--surface-1-dark)]">
        <div className="h-4 w-32 rounded-full bg-slate-200/80 dark:bg-[var(--skeleton-dark)]" />
        <div className="mt-4 h-6 w-1/2 rounded-full bg-slate-200/80 dark:bg-[var(--skeleton-dark)]" />
        <div className="mt-3 h-4 w-2/3 rounded-full bg-slate-200/80 dark:bg-[var(--skeleton-dark)]" />
        <div className="mt-6 h-32 rounded-2xl bg-slate-200/80 dark:bg-[var(--skeleton-dark)]" />
      </div>
    );
  }

  if (!hasSubscriptions) {
    return (
      <div className="relative overflow-hidden rounded-[26px] border border-[#DDE6F6] bg-gradient-to-r from-[#CFE2FF] via-[#EAF2FF] to-[#CFE0FF] p-8 shadow-sm dark:border-white/10 dark:from-[var(--hero-dark-from)] dark:via-[var(--hero-dark-via)] dark:to-[var(--hero-dark-to)] md:px-10">
        <div className="pointer-events-none absolute inset-0">
          {/* Concentric radial glows to match Figma */}
          <div className="absolute right-[30%] top-1/2 size-60 -translate-y-1/2 rounded-full bg-white/60 blur-3xl dark:bg-white/10" />
          <div className="absolute right-[30%] top-1/2 size-36 -translate-y-1/2 rounded-full bg-white/70 blur-2xl dark:bg-white/5" />
        </div>
        <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row md:gap-10">
          <div className="w-full md:w-[55%] md:pl-2">
            <h2 className="text-[30px] font-semibold text-[#1B2746] dark:text-white">Your Projects</h2>
            <p className="mt-2 max-w-[520px] text-[16px] leading-relaxed text-[#66758E] dark:text-slate-300">
              You currently do not have active projects, either start from below by selecting one of the services.
            </p>
          </div>
          <div className="flex w-full justify-center md:w-[45%] md:justify-end md:pr-8">
            <div className="relative w-full max-w-[360px]">
              <Image
                src={withBasePath("/assets/images/dashboard-v2/hero-illustration.svg")}
                alt="Network preview"
                width={450}
                height={350}
                className="max-h-[220px] w-full object-contain"
                priority
              />
              <span className="absolute left-0 top-6 rounded-full border border-[#DDE6F6] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B7BA1] dark:border-white/10 dark:bg-[var(--badge-dark)] dark:text-slate-200">
                Rollups
              </span>
              <span className="absolute right-0 top-2 rounded-full border border-[#DDE6F6] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B7BA1] dark:border-white/10 dark:bg-[var(--badge-dark)] dark:text-slate-200">
                Nodes
              </span>
              <span className="absolute right-0 top-24 rounded-full border border-[#DDE6F6] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B7BA1] dark:border-white/10 dark:bg-[var(--badge-dark)] dark:text-slate-200">
                Appchains
              </span>
              <span className="absolute bottom-[-4px] left-4 rounded-full border border-[#DDE6F6] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B7BA1] dark:border-white/10 dark:bg-[var(--badge-dark)] dark:text-slate-200">
                Indexers
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/60 bg-[radial-gradient(120.14%_215.92%_at_50.04%_50%,_#FFFFFF_0%,_#88BAFF_100%)] p-6 backdrop-blur-sm dark:border-white/10 dark:bg-[var(--surface-1-dark)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#0E2B6E] dark:text-white">Your Projects</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className={getFilterButtonClasses(activeFilter === filter.id)}
          >
            <span>{filter.label}</span>
            <span className={getFilterBadgeClasses(activeFilter === filter.id)}>{filterCounts[filter.id]}</span>
          </button>
        ))}
      </div>
      {filteredSubscriptions.length ? (
        <div className="mt-5">
          <Swiper
            key={activeFilter}
            className="dashboard-hero-swiper"
            slidesPerView={1}
            spaceBetween={16}
            pagination={{ clickable: true, dynamicBullets: true, dynamicMainBullets: 5 }}
            modules={[Pagination]}
            breakpoints={{
              768: { slidesPerView: 2, slidesPerGroup: 2 },
              1280: { slidesPerView: 3, slidesPerGroup: 3 },
            }}
            onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
          >
            {filteredSubscriptions.map((item, index) => (
              <SwiperSlide key={item.id}>
                <ProjectCard item={item} onNavigate={onNavigate} isFirst={index === activeSlide} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200/70 p-6 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-300">
          No projects match this filter yet.
        </div>
      )}
    </div>
  );
};

const ProjectCard = ({
  item,
  onNavigate,
  isFirst = false,
}: {
  item: SubscriptionSummaryItem & { protocolType: string };
  onNavigate?: () => void;
  isFirst?: boolean;
}) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const protocolType = item.protocolType?.toLowerCase();
  const protocolTypeName = protocolType === "public" ? "SMART NODES" : protocolType === "rollup" ? "ROLLUPS" : "NODES";
  const status = String(item.subscription_status || "inactive").toLowerCase();
  const statusClasses =
    status === "active"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
      : "bg-amber-400/20 text-amber-700 dark:text-amber-300";

  const isRpcNode = item?.subscription_type === "rpc";

  // For rollups, check subscription_status; for nodes, check node_status
  const statusToCheck =
    protocolType === "rollup"
      ? String(item?.subscription_status || "").toLowerCase()
      : String(item?.node_status || "").toLowerCase();
  const isReady = protocolType === "rollup" ? statusToCheck === "active" : statusToCheck === "ready";
  const monitoringDisabled = isNavigating || !isReady;

  const detailRows =
    protocolType === "rollup"
      ? [
          { label: "Name", value: item.node_name ?? "NA" },
          { label: "Network Type", value: item?.network_type ?? "NA" },
          { label: "Number of Services", value: item?.node_count ?? "NA" },
        ]
      : protocolType === "public"
        ? [
            { label: "Name", value: item.node_name ?? "NA" },
            { label: "Network Type", value: item?.network_type ?? "NA" },
            {
              label: isRpcNode ? "Endpoint" : "Validator ID",
              value: (() => {
                const identifier = isRpcNode ? item?.endpoint : item?.validator_id;
                return identifier ? toShortString(String(identifier), 5, 8) : "NA";
              })(),
            },
          ]
        : [{ label: "Name", value: item.node_name ?? "NA" }];

  const handleMonitoringClick = () => {
    setIsNavigating(true);
    onNavigate?.();
    if (protocolType === "rollup") {
      const planSlug = item?.plan_name ? item?.plan_name.toLowerCase().replace(/\s+/g, "-") : "";
      router.push(`/${planSlug}/network/${item.id}?tab=monitoring`);
    } else if (protocolType === "public") {
      router.push(`/manage/nodes/${item?.subscription_type}/${item?.node_id}?tab=infrastructure`);
    }
  };

  const handleBlockExplorerClick = () => {
    if (protocolType === "rollup") {
      const explorerUrl = item?.explorer_url;
      if (!explorerUrl) {
        return;
      }

      const url = /^https?:\/\//i.test(explorerUrl) ? explorerUrl : `https://${explorerUrl}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className="rounded-2xl p-px"
      style={
        isFirst
          ? {
              background:
                "linear-gradient(#FFFFFF99, #FFFFFF99) padding-box, linear-gradient(102.16deg, rgba(255, 255, 255, 0) -16.55%, #006CFF 45.14%, rgba(255, 255, 255, 0) 111.77%) border-box",
              border: "1px solid transparent",
              boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.1)",
            }
          : {
              backgroundColor: "#FFFFFF99",
              boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.1)",
            }
      }
    >
      <div className="flex h-full flex-col gap-4 rounded-2xl bg-white/90 p-4 backdrop-blur-sm dark:bg-[var(--surface-2-dark)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-row items-center gap-2">
            <Image src={item.logo} alt={`${item.plan_name} logo`} width={24} height={24} unoptimized />
            <div className="w-fit rounded-md bg-[#E6EEFF] px-2 py-1 text-xs font-normal tracking-[0.18em] text-[#365C8F] dark:bg-white/10 dark:text-[#8AB4FF]">
              {protocolTypeName}
            </div>
          </div>
          <span className={`inline-flex rounded-md px-2 py-1 text-xs font-normal uppercase ${statusClasses}`}>
            {toCapitalize(status.replace(/_/g, " "))}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-base font-bold text-[#0E2B6E] dark:text-white">{item.plan_name}</p>
        </div>

        <div className="space-y-3">
          {detailRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-2">
              <p className="text-xs font-normal text-[#53607F] dark:text-slate-400">{row.label}</p>
              <p className="text-xs font-normal text-slate-700 dark:text-slate-200">{row.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 flex w-full gap-2">
          <div className="relative w-full">
            <Z4Button
              type="button"
              onClick={handleMonitoringClick}
              isDisabled={monitoringDisabled}
              className="inline-flex w-full justify-center gap-2 rounded-xl bg-[#006CFF] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
              title={
                !isReady
                  ? `Monitoring will be available once your ${protocolType === "rollup" ? "service" : "node"} is ready`
                  : ""
              }
            >
              {isNavigating ? (
                <>
                  <Spinner className="me-2 size-5" />
                  Loading...
                </>
              ) : (
                <>
                  Monitoring
                  <Image
                    src={withBasePath("/assets/images/dashboard-v2/monitoring.svg")}
                    alt="Monitoring"
                    width={16}
                    height={16}
                    priority
                  />
                </>
              )}
            </Z4Button>
          </div>
          {protocolType === "rollup" && (
            <Z4Button
              type="button"
              onClick={handleBlockExplorerClick}
              isDisabled={!item?.explorer_url}
              className="inline-flex w-full justify-center gap-2 rounded-xl bg-[#006CFF] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Block Explorer
              <Image
                src={withBasePath("/assets/images/dashboard-v2/explorer.svg")}
                alt="Monitoring"
                width={16}
                height={16}
                priority
              />
            </Z4Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
