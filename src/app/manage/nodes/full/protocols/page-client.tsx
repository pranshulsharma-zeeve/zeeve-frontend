/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable react/jsx-no-undef */
"use client";
import { Heading } from "@zeeve-platform/ui";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProtocolsListSidebarCard } from "./_components/protocol-sidebar-card";
import PlanHeader from "./_components/plan-header";
import SearchInput from "@/components/ui/search-input";
import useDebounce from "@/hooks/use-debounce";
import { useConfigStore } from "@/store/config";
import { withBasePath, capitalizeFirstLetter } from "@/utils/helpers";
import { ProtocolPlanCard } from "@/app/manage/nodes/full/protocols/_components/protocol-plan-card";
import usePlatformService from "@/services/platform/use-platform-service";
import loaderImage from "/public/assets/images/loaders/zeeve-loader.gif";
import useProtocolStore from "@/store/protocolStore";
import { useUserStore } from "@/store/user";
import { getCookie, setCookie } from "@/utils/cookies";
import { ProtocolDetailsApiItem, ProtocolSummaryApi } from "@/types/api/protocols";
import {
  findProtocolRecord,
  getProtocolSummaryEntry,
  listProtocolPlans,
  resolveProtocolIcon,
} from "@/utils/protocol-details";

type ProtocolSidebarItem = {
  record: ProtocolDetailsApiItem;
  summaryKey: string;
  summary: ProtocolSummaryApi;
};

const FullNodesSubscriptionsPageClient = () => {
  const config = useConfigStore((state) => state.config);
  const router = useRouter(); // Added useRouter hook
  const disabledProtocolIds = config?.disabledProtocolIds as string[];
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [filteredProtocols, setFilteredProtocols] = useState<ProtocolSidebarItem[]>([]);
  const [focusedProtocolCard, setFocusedProtocolCard] = useState<{
    id: string;
    name: string;
  }>({ id: "", name: "" });
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const user = useUserStore((state) => state.user);
  const email = user?.usercred;
  const { request: vizionRequest, url: vizionUrl } = usePlatformService().dashboard.createVisionUser();

  // Create vision user if not already created
  useEffect(() => {
    if (!email) return;

    const cookieKey = `vision-user-${email}`;
    const alreadyCreated = getCookie(cookieKey);

    if (alreadyCreated) return;

    const createUser = async () => {
      try {
        const vizionResp = await vizionRequest(vizionUrl);
        console.log("Vision user created:", vizionResp);
        setCookie(cookieKey, "true", 60 * 24 * 7); // 7 days
      } catch (err) {
        console.error("Error creating vision user:", err);
        setCookie(cookieKey, "true", 60 * 24 * 7);
      }
    };

    createUser();
  }, [user?.usercred]);

  // Protocols List API
  const {
    request: { data: protocolListResponse, isLoading: isProtocolListDataLoading },
  } = usePlatformService().node_journey.list("full");

  const searchParams = useSearchParams();

  useEffect(() => {
    const savedFocusedProtocol = useProtocolStore.getState().focusedProtocol?.toLowerCase();
    const paramFocusedProtocol = searchParams.get("protocol")?.toLowerCase();
    const items = protocolListResponse?.data ?? [];

    if (!items.length) {
      setFilteredProtocols([]);
      setFocusedProtocolCard({ id: "", name: "" });
      return;
    }

    const disabledIds = Array.isArray(disabledProtocolIds) ? disabledProtocolIds : [];
    const searchValue = debouncedSearchTerm.trim().toLowerCase();

    const filtered = items.reduce<ProtocolSidebarItem[]>((acc, item) => {
      const entry = getProtocolSummaryEntry(item);
      if (!entry) return acc;
      const { summary, key: summaryKey } = entry;
      const protocolId = summary.protocol_id || String(summary.id);
      const protocolName = summary.name || summaryKey;

      if (disabledIds.includes(protocolId)) return acc;
      if (searchValue && !protocolName.toLowerCase().includes(searchValue)) return acc;

      acc.push({ record: item, summaryKey, summary });
      return acc;
    }, []);

    setFilteredProtocols(filtered);

    const normalize = (value?: string | null) => value?.toLowerCase();
    const targetByParam = filtered.find((entry) => normalize(entry.summary.name) === paramFocusedProtocol);
    const targetByStore = filtered.find((entry) => normalize(entry.summary.name) === savedFocusedProtocol);
    const targetByDefault = filtered.find((entry) => normalize(entry.summary.name) === "ethereum");
    const fallback = filtered[0];
    const focused = targetByParam || targetByStore || targetByDefault || fallback;

    if (focused) {
      const protocolId = focused.summary.protocol_id || String(focused.summary.id);
      const protocolName = focused.summary.name || focused.summaryKey;
      setFocusedProtocolCard({ id: protocolId, name: protocolName });
    } else {
      setFocusedProtocolCard({ id: "", name: "" });
    }
  }, [debouncedSearchTerm, disabledProtocolIds, protocolListResponse, searchParams]);

  // Added useEffect to check localStorage and redirect
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedServiceURL = localStorage.getItem("serviceURL");
      if (storedServiceURL) {
        localStorage.removeItem("serviceURL"); // Clear after using
        if (storedServiceURL.includes("/manage/nodes/full")) {
          router.replace(storedServiceURL);
        }
      }
    }
  }, [router]);

  const protocolRecords = protocolListResponse?.data ?? [];
  const activeRecord = useMemo(
    () => findProtocolRecord(protocolRecords, focusedProtocolCard.id, focusedProtocolCard.name),
    [protocolRecords, focusedProtocolCard.id, focusedProtocolCard.name],
  );
  const activeSummaryEntry = useMemo(
    () => (activeRecord ? getProtocolSummaryEntry(activeRecord) : undefined),
    [activeRecord],
  );
  const activeSummary = activeSummaryEntry?.summary;
  const availablePlans = useMemo(() => (activeRecord ? listProtocolPlans(activeRecord) : []), [activeRecord]);
  const activeProtocolId = activeSummary?.protocol_id || String(activeSummary?.id) || focusedProtocolCard.id;
  const activeProtocolName = activeSummary?.name || activeSummaryEntry?.key || focusedProtocolCard.name;
  const activeProtocolIcon = resolveProtocolIcon(activeSummary?.icon);

  useEffect(() => {
    if (!availablePlans.length) return;
    if (!availablePlans.some((plan) => plan.name === selectedPlan)) {
      setSelectedPlan(availablePlans[0].name);
    }
  }, [availablePlans, selectedPlan]);

  const handleCardFocus = (id: string, name: string) => {
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    currentParams.set("protocol", name.toLowerCase());

    const newSearch = currentParams.toString();
    router.replace(`?${newSearch}`, { scroll: false });
    setFocusedProtocolCard({ id, name });
    setSelectedPlan("");
  };

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      {/* <Z4Navigation
        heading={`Select your Smart Node`}
        breadcrumb={{
          items: [
            {
              href: withBasePath(`${ROUTES.PLATFORM.PAGE.DASHBOARD}`),
              label: "Dashboard",
              as: "a",
            },
            {
              href: withBasePath(`${ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES}`),
              label: `Manage RPC Nodes`,
            },
            {
              href: withBasePath(`${ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES_PROTOCOLS}`),
              label: "Select Plan",
              isActive: true,
            },
          ],
        }}
      ></Z4Navigation> */}
      {isProtocolListDataLoading ? (
        <div className="flex flex-col items-center justify-center p-3 lg:p-6">
          <Image src={loaderImage} alt="Zeeve loader" width={200} height={200} />
        </div>
      ) : (
        <div className="z-5 relative rounded-2xl">
          {/* Overlay to hide global layout background */}
          <div className="absolute inset-0 z-0 rounded-2xl bg-white" />
          <div className="relative  grid grid-cols-5 gap-3 rounded-2xl border bg-white">
            <div className="col-span-5 max-h-[900px] max-w-[270] overflow-y-auto rounded-l-2xl bg-brand-full-10 p-3 scrollbar-hide lg:col-span-1 lg:px-3 lg:py-6">
              <div className="sticky top-0 z-10 -mx-3 bg-brand-full-10 px-3 pb-3 pt-1 lg:mx-0 lg:px-0 lg:pb-4 lg:pt-0">
                <SearchInput
                  autoComplete="off"
                  searchValue={searchTerm}
                  placeholder="Search Protocol"
                  className="w-full rounded-lg border border-brand-outline px-3 py-2 focus:border-brand-mainnet"
                  onClearButtonClick={() => setSearchTerm("")}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="mt-1 lg:mt-0">
                {!isProtocolListDataLoading && filteredProtocols && filteredProtocols.length > 0
                  ? filteredProtocols.map((protocol, index) => (
                      <ProtocolsListSidebarCard
                        isLoading={isProtocolListDataLoading}
                        key={index}
                        protocolId={protocol.summary.protocol_id || String(protocol.summary.id)}
                        protocolName={protocol.summary.name || protocol.summaryKey}
                        isFocused={
                          focusedProtocolCard?.id === (protocol.summary.protocol_id || String(protocol.summary.id))
                        }
                        iconSrc={resolveProtocolIcon(protocol.summary.icon)}
                        onCardFocus={handleCardFocus}
                      />
                    ))
                  : searchTerm && (
                      <div className="mt-4 text-center text-gray-500">No Protocols found for {searchTerm}.</div>
                    )}
              </div>
            </div>
            <div className="col-span-5 pr-3 lg:col-span-4 lg:pr-6">
              {!isProtocolListDataLoading && !activeRecord ? (
                <div className="flex flex-col items-center justify-center gap-8 p-3 lg:p-6">
                  <Image
                    src={withBasePath(`/assets/images/protocols/no_data_available.svg`)}
                    alt="No Data Available"
                    width={249.8}
                    height={249}
                  />
                  <Heading className="text-lg font-semibold text-black">No data found.</Heading>
                </div>
              ) : null}
              {isProtocolListDataLoading ? (
                <div className="flex flex-col items-center justify-center p-3 lg:p-6">
                  <Image src={loaderImage} alt="Zeeve loader" width={200} height={200} />
                </div>
              ) : null}
              {focusedProtocolCard.id && activeRecord ? (
                <div className="grid grid-cols-4 gap-3 lg:gap-6">
                  <div className="col-span-4 flex flex-row items-center gap-3 p-3 lg:p-6">
                    {activeProtocolIcon ? (
                      <Image
                        src={activeProtocolIcon}
                        alt={`${focusedProtocolCard.name} Icon`}
                        width={32}
                        height={32}
                        unoptimized
                      />
                    ) : (
                      <div className="flex size-8 items-center justify-center rounded-full bg-brand-mainnet text-sm font-semibold text-white">
                        {focusedProtocolCard.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <Heading as={"h5"} className="text-left text-[16px] font-medium leading-[36px]">
                      {capitalizeFirstLetter(focusedProtocolCard.name ?? "NA")}
                    </Heading>
                  </div>
                  {availablePlans.length ? (
                    <>
                      <PlanHeader plan={availablePlans[0]?.plan} isLoading={isProtocolListDataLoading} />
                      {availablePlans
                        .filter(({ name }) => ["basic", "advance", "enterprise"].includes(name.toLowerCase()))
                        .map(({ name, plan }) => (
                          <ProtocolPlanCard
                            key={name}
                            planName={name}
                            plan={plan}
                            isLoading={isProtocolListDataLoading}
                            protocolId={activeProtocolId}
                            protocolName={activeProtocolName}
                            isSelected={selectedPlan === name}
                            onSelect={() => setSelectedPlan(name)}
                          />
                        ))}
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullNodesSubscriptionsPageClient;
