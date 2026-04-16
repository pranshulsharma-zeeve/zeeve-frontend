"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Card, Checkbox, Heading, Label, Spinner, useToast, Z4Button, Z4Navigation, Button } from "@zeeve-platform/ui";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { IconLaunch } from "@zeeve-platform/icons/product/outline";
import usePlatformService from "@/services/platform/use-platform-service";
import ROUTES from "@/routes";
import { calculatePercentage, capitalizeRegion, kebabToTitleCase, toCapitalize, withBasePath } from "@/utils/helpers";
import { redirectToStripeUrl } from "@/utils/redirects";
import { PlatformServiceError } from "@/services/platform/types";
import HTTP_STATUS from "@/constants/http";
import { CreateCheckoutSessionRequest } from "@/services/platform/node-journey/create";
import useProtocolStore from "@/store/protocolStore";
import {
  findProtocolRecord,
  getProtocolSummaryEntry,
  listProtocolPlans,
  resolveProtocolIcon,
  getAddOnPlanPricing,
} from "@/utils/protocol-details";

const FullNodePurchasePageClient = () => {
  const searchParams = useSearchParams();
  const planTypeParam = searchParams.get("planType") ?? "";
  const protocolId = searchParams.get("id") ?? "";
  const protocolNameParam = searchParams.get("protocolName") ?? "";

  const from = searchParams.get("from");
  const protocolQueryParam = searchParams.get("protocol");

  const querySuffix = new URLSearchParams();
  if (from) querySuffix.set("from", from);
  if (protocolQueryParam) querySuffix.set("protocol", protocolQueryParam);
  const queryString = querySuffix.toString();
  const withQuery = queryString ? `?${queryString}` : "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedUpdateRule, setSelectedUpdateRule] = useState<"automatically" | "manually">("automatically");
  const [selectedPrice, setSelectedPrice] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  const [isFinalisedAddonSelected, setIsFinalisedAddonSelected] = useState(false);

  const router = useRouter();
  const toast = useToast();
  const handleStripeRedirect = (url: string) => {
    if (redirectToStripeUrl(url)) {
      return true;
    }
    toast("", { status: "error", message: "Invalid payment link. Please contact support." });
    return false;
  };
  const isEtherlink = protocolId === "efc9baf5-16f6-494d-b571-dc9ace315f2a";

  const { request, url } = usePlatformService().node_journey.create();
  const { request: vizionRequest, url: vizionUrl } = usePlatformService().dashboard.createVisionUser();
  const {
    request: { data: vizionUserData },
  } = usePlatformService().node_journey.vizionUserInfo();
  const userId = vizionUserData?.userDetails?.result?.result?.[0]?.userid;

  const {
    request: { data: protocolListResponse, isLoading: isProtocolDetailsLoading },
  } = usePlatformService().node_journey.list("full");

  const protocolRecords = protocolListResponse?.data ?? [];
  const activeRecord = useMemo(
    () => findProtocolRecord(protocolRecords, protocolId, protocolNameParam),
    [protocolRecords, protocolId, protocolNameParam],
  );
  const activeSummaryEntry = useMemo(
    () => (activeRecord ? getProtocolSummaryEntry(activeRecord) : undefined),
    [activeRecord],
  );
  const activeSummary = activeSummaryEntry?.summary;
  const availablePlans = useMemo(() => (activeRecord ? listProtocolPlans(activeRecord) : []), [activeRecord]);

  const selectedPlanEntry = useMemo(() => {
    if (!availablePlans.length) return undefined;
    if (planTypeParam) {
      const matchedPlan = availablePlans.find((plan) => plan.name === planTypeParam);
      if (matchedPlan) return matchedPlan;
    }
    return availablePlans[0];
  }, [availablePlans, planTypeParam]);

  const selectedPlanName = selectedPlanEntry?.name ?? "";
  const planDetails = selectedPlanEntry?.plan;
  const normalizedPlanName = selectedPlanName ? selectedPlanName.toLowerCase() : "";

  const addonPlanType = useMemo(() => {
    if (normalizedPlanName && !isFinalisedAddonSelected) return "";
    if (normalizedPlanName === "advance") return "Advance (Finalised View)";
    if (normalizedPlanName === "enterprise") return "Enterprise (Finalised View)";
    return "";
  }, [normalizedPlanName, isFinalisedAddonSelected]);
  // const addonPlanDetails = useMemo(
  //   () => (activeRecord && addonPlanType ? getPlanByName(activeRecord, addonPlanType) : undefined),
  //   [activeRecord, addonPlanType],
  // );

  // useEffect(() => {
  //   if (!addonPlanType || !addonPlanDetails) {
  //     setIsFinalisedAddonSelected(false);
  //   }
  // }, [addonPlanType, addonPlanDetails]);

  const pricingPlan = isFinalisedAddonSelected ? getAddOnPlanPricing(availablePlans, addonPlanType) : planDetails;

  const networkOptions = useMemo(() => activeSummary?.network_types ?? [], [activeSummary]);
  useEffect(() => {
    if (!networkOptions.length) {
      setSelectedNetwork("");
      return;
    }
    if (!selectedNetwork || !networkOptions.includes(selectedNetwork)) {
      setSelectedNetwork(networkOptions[0]);
    }
  }, [networkOptions, selectedNetwork]);

  const locationOptions = useMemo(() => {
    // if (isFinalisedAddonSelected && addonPlanDetails?.regions?.length) return addonPlanDetails.regions;
    return planDetails?.regions ?? [];
  }, [planDetails]);

  useEffect(() => {
    if (!locationOptions.length) {
      setSelectedLocation("");
      return;
    }
    if (!selectedLocation || !locationOptions.includes(selectedLocation)) {
      setSelectedLocation(locationOptions[0]);
    }
  }, [locationOptions, selectedLocation]);

  const monthlyAmount = pricingPlan?.amount_month != null ? Number(pricingPlan.amount_month) : 0;
  const quarterlyAmount = pricingPlan?.amount_quarter != null ? Number(pricingPlan.amount_quarter) : 0;
  const yearlyAmount = pricingPlan?.amount_year != null ? Number(pricingPlan.amount_year) : 0;

  const quarterlySavings =
    monthlyAmount > 0 && quarterlyAmount > 0 ? calculatePercentage(monthlyAmount, quarterlyAmount, 3) : "0.00";
  const yearlySavings =
    monthlyAmount > 0 && yearlyAmount > 0 ? calculatePercentage(monthlyAmount, yearlyAmount, 12) : "0.00";

  const selectedRecurringAmount =
    selectedPrice === "monthly" ? monthlyAmount : selectedPrice === "quarterly" ? quarterlyAmount : yearlyAmount;

  const monthlyEquivalent =
    selectedPrice === "quarterly"
      ? quarterlyAmount / 3
      : selectedPrice === "yearly"
        ? yearlyAmount / 12
        : monthlyAmount;

  const selectedPriceLabel = selectedPrice === "monthly" ? "Month" : selectedPrice === "quarterly" ? "Quarter" : "Year";

  const finalPlanType = isFinalisedAddonSelected && addonPlanType ? addonPlanType : selectedPlanName;

  const monitoringItems = useMemo(
    () => [
      { icon: "Vector", label: "Monitoring Dashboard" },
      { icon: "alert", label: "Alerts and Notification" },
      { icon: "docs", label: normalizedPlanName === "enterprise" ? "Enterprise SLA 99.99%" : "Enterprise SLA 99.9%" },
      { icon: "uptime", label: "Uptime Guarantee" },
      { icon: "chat", label: "24/7 Tech Support" },
    ],
    [normalizedPlanName],
  );

  const offerings = useMemo(() => {
    const details = planDetails;
    const items = [
      { label: "Plan", value: addonPlanType ? addonPlanType : toCapitalize(selectedPlanName || "NA"), hasChange: true },
      { label: "Network", value: toCapitalize(selectedNetwork || "NA") },
      { label: "Uptime SLA", value: details?.uptimeSLA ?? "NA" },
      { label: "Location", value: toCapitalize(selectedLocation || "NA") },
      { label: "Bandwidth", value: details?.bandwidth ?? "NA" },
      { label: "Support", value: details?.support ?? "NA" },
      { label: "Monthly Limit", value: details?.monthlyLimit ?? "NA" },
      { label: "IP Whitelist", value: details?.ipWhitelist ? "Available" : "Not Included" },
      { label: "Domain Customization", value: details?.domainCustomization ? "Available" : "Not Included" },
      { label: "Software Upgrades", value: details?.softwareUpgrades ?? "NA" },
      { label: "Software Update Rule", value: toCapitalize(selectedUpdateRule) },
    ];

    if (isFinalisedAddonSelected) {
      items.push({ label: "Addon", value: "Finalised" });
    }

    return items;
  }, [
    isFinalisedAddonSelected,
    planDetails,
    pricingPlan,
    selectedLocation,
    selectedNetwork,
    selectedPlanName,
    selectedUpdateRule,
  ]);

  const canCreate = Boolean(protocolId && finalPlanType && selectedNetwork && selectedLocation && pricingPlan);

  const onCreate = async () => {
    if (!canCreate) {
      toast("", {
        status: "error",
        message: "Select a plan, network, and server location before continuing.",
      });
      return;
    }

    const payload: CreateCheckoutSessionRequest = {
      duration: selectedPrice,
      plan_type: finalPlanType,
      protocol_id: protocolId,
      subscription_type: "rpc",
      automatic_update: selectedUpdateRule === "automatically" ? "auto" : "manual",
      server_location_id: selectedLocation,
      network_selection: selectedNetwork,
      visionUserId: userId ? userId : "",
    };

    try {
      setIsSubmitting(true);
      const response = await request(url, payload);
      if (response.status === HTTP_STATUS.OK && response.data.success) {
        try {
          await vizionRequest(vizionUrl);
        } catch (vizionError) {
          console.warn("Vizion request failed:", vizionError);
        }
        const checkoutUrl = response.data.data?.checkout_url;
        if (checkoutUrl) {
          handleStripeRedirect(checkoutUrl);
        }
      } else {
        toast("", {
          status: "error",
          message: response.data.message || "Unable to create checkout session.",
        });
      }
    } catch (error) {
      const err = error as AxiosError<PlatformServiceError & { error?: string }>;
      const message = axios.isAxiosError(error)
        ? err.response?.data?.message || err.response?.data?.error || "An unexpected error occurred"
        : "An unexpected error occurred";
      toast("", {
        status: "error",
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigationLabel = activeSummary?.name || protocolNameParam || "Protocol";
  const navigationIcon = resolveProtocolIcon(activeSummary?.icon);

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      <div className="flex flex-col lg:flex-row lg:justify-between">
        <Z4Navigation
          heading={
            <div>
              {isProtocolDetailsLoading && !activeSummary ? (
                <Spinner colorScheme={"cyan"} />
              ) : (
                <div className="flex flex-row items-center gap-2">
                  RPC Nodes -
                  {navigationIcon ? (
                    <Image src={navigationIcon} alt={`${navigationLabel} Icon`} width={24} height={24} unoptimized />
                  ) : null}
                  {navigationLabel}
                </div>
              )}
            </div>
          }
          breadcrumb={{
            items: [
              {
                href: withBasePath(`${ROUTES.PLATFORM.PAGE.DASHBOARD}`),
                label: "Dashboard",
                as: "a",
              },
              ...(from !== "smart-node"
                ? [
                    {
                      href: withBasePath(`${ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES}`),
                      label: "Manage RPC Nodes",
                    },
                  ]
                : []),
              {
                href: withBasePath(`${ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES_PROTOCOLS}${withQuery}`),
                label: "Select Plan",
              },
              {
                href: "",
                label: "Plan Details",
                isActive: true,
              },
            ],
          }}
        />
        <div>
          <Z4Button
            variant={"outline"}
            className="rounded-t-[4px] border-t"
            colorScheme={"mainnet"}
            onClick={() => {
              useProtocolStore.getState().setFocusedProtocol(navigationLabel);
              router.push(ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES_PROTOCOLS);
            }}
          >
            Select Other Protocol
          </Z4Button>

          <Button
            size={"medium"}
            className="ml-2 w-fit rounded text-sm font-semibold lg:text-base"
            onClick={() =>
              window.open("https://docs.zeeve.io/rpc-nodes/deploy-your-rpc-node", "_blank", "noopener,noreferrer")
            }
          >
            Docs
          </Button>
        </div>
      </div>
      <Heading className="text-xl font-semibold">Setup Your Node</Heading>
      <div className="grid grid-cols-9 gap-3 lg:gap-6">
        <div className="col-span-9 flex flex-col gap-3 lg:col-span-6 lg:gap-6">
          <Card className="rounded-[10px] border-0 shadow-lg">
            <Heading className="text-base font-semibold">Network Selection</Heading>
            {isProtocolDetailsLoading ? (
              <div className="flex items-center justify-center py-6">
                <Spinner colorScheme={"cyan"} />
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-3 lg:gap-6">
                {networkOptions.length ? (
                  networkOptions.map((network) => (
                    <Card
                      key={network}
                      className={`col-span-12 cursor-pointer rounded-[6px] border border-transparent p-4 md:col-span-6 lg:col-span-4 lg:p-4 ${
                        selectedNetwork === network
                          ? " border-brand-testnet bg-brand-testnet/10"
                          : "border-brand-outline"
                      }`}
                      onClick={() => setSelectedNetwork(network)}
                    >
                      <div className="flex flex-row items-center gap-2 text-sm font-normal">
                        {kebabToTitleCase(network)}
                        <div className="ml-auto">
                          {selectedNetwork === network && (
                            <Image
                              src={withBasePath(`/assets/images/purchase/circlecheck.svg`)}
                              alt="Selected"
                              width={20}
                              height={20}
                            />
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-12 py-4 text-sm text-gray-500">No networks available.</div>
                )}
              </div>
            )}
          </Card>
          <Card className="rounded-[10px] border-0 shadow-lg">
            <Heading className="text-base font-semibold">Select Server Location</Heading>
            {isProtocolDetailsLoading ? (
              <div className="flex items-center justify-center py-6">
                <Spinner colorScheme={"cyan"} />
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-3 lg:gap-6">
                {locationOptions.length ? (
                  locationOptions.map((location) => (
                    <Card
                      key={location}
                      className={`col-span-12 cursor-pointer rounded-[6px] border border-transparent p-4 md:col-span-6 lg:p-4 ${
                        normalizedPlanName === "basic" ? "lg:col-span-12" : "lg:col-span-4"
                      } ${selectedLocation === location ? " border-brand-testnet bg-brand-testnet/10" : "border-brand-outline"}`}
                      onClick={() => setSelectedLocation(location)}
                    >
                      <div className="flex flex-row items-center gap-2 text-sm font-normal">
                        {kebabToTitleCase(location)}
                        <div className="ml-auto">
                          {selectedLocation === location && (
                            <Image
                              src={withBasePath(`/assets/images/purchase/circlecheck.svg`)}
                              alt="Selected"
                              width={20}
                              height={20}
                            />
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-12 py-4 text-sm text-gray-500">No locations available.</div>
                )}
              </div>
            )}
          </Card>
          <Card className="rounded-[10px] border-0 shadow-lg">
            <Heading className="text-base font-semibold">Node Software Update Rules</Heading>
            <div className="grid grid-cols-12 gap-3 lg:gap-6">
              <Card
                className={`col-span-12 cursor-pointer rounded-[6px] border border-transparent p-4 md:col-span-6 lg:p-4 ${
                  selectedUpdateRule === "automatically"
                    ? " border-brand-testnet bg-brand-testnet/10"
                    : "border-brand-outline"
                }`}
                onClick={() => setSelectedUpdateRule("automatically")}
              >
                <div className="flex flex-row items-center gap-2 text-sm font-normal">
                  Automatically
                  <div className="ml-auto">
                    {selectedUpdateRule === "automatically" && (
                      <Image
                        src={withBasePath(`/assets/images/purchase/circlecheck.svg`)}
                        alt="Selected"
                        width={20}
                        height={20}
                      />
                    )}
                  </div>
                </div>
              </Card>
              <Card
                className={`col-span-12 cursor-pointer rounded-[6px] border border-transparent p-4 md:col-span-6 lg:p-4 ${
                  selectedUpdateRule === "manually"
                    ? " border-brand-testnet bg-brand-testnet/10"
                    : "border-brand-outline"
                }`}
                onClick={() => setSelectedUpdateRule("manually")}
              >
                <div className="flex flex-row items-center gap-2 text-sm font-normal">
                  Manually
                  <div className="ml-auto">
                    {selectedUpdateRule === "manually" && (
                      <Image
                        src={withBasePath(`/assets/images/purchase/circlecheck.svg`)}
                        alt="Selected"
                        width={20}
                        height={20}
                      />
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </Card>
          {isEtherlink && normalizedPlanName !== "basic" ? (
            <Card className="rounded-[10px] border-0 shadow-lg">
              <Heading className="text-base font-semibold">Addon</Heading>
              <div className="grid grid-cols-12 gap-3 lg:gap-6">
                <Card
                  className={`col-span-12 flex cursor-pointer flex-row items-center gap-3 rounded-[6px] border border-transparent p-4 lg:col-span-4 lg:gap-3 lg:p-4 ${
                    isFinalisedAddonSelected ? " border-brand-testnet bg-brand-testnet/10" : "border-brand-outline"
                  }`}
                  onClick={() => setIsFinalisedAddonSelected((prev) => !prev)}
                >
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      isChecked={isFinalisedAddonSelected}
                      onChange={() => setIsFinalisedAddonSelected((prev) => !prev)}
                      className="h-[20px] w-[21px] text-[#10B840]"
                    />
                  </div>
                  <div className="text-sm">Finalised</div>
                </Card>
              </div>
            </Card>
          ) : null}
          <Card className="rounded-[10px] border-0 shadow-lg">
            <Heading className="text-base font-semibold">Price</Heading>
            <div className="grid grid-cols-12 gap-3 lg:gap-6">
              <Card
                className={`col-span-12 cursor-pointer gap-3 rounded-[6px] border border-transparent p-4 md:col-span-4 lg:gap-3 lg:p-4 ${
                  selectedPrice === "monthly" ? " border-brand-testnet bg-brand-testnet/10" : "border-brand-outline"
                }`}
                onClick={() => setSelectedPrice("monthly")}
              >
                <div className="flex flex-row gap-1 text-sm font-medium">
                  <span className="font-bold">Monthly </span> Billing
                </div>
                <div>
                  <div className="flex flex-row items-end gap-1 text-sm font-semibold">
                    <span className="text-4xl">${monthlyAmount.toFixed(2)}</span> / Month
                  </div>
                </div>
              </Card>
              <Card
                className={`col-span-12 cursor-pointer gap-3 rounded-[6px] border border-transparent p-4 md:col-span-4 lg:gap-3 lg:p-4 ${
                  selectedPrice === "quarterly" ? " border-brand-testnet bg-brand-testnet/10" : "border-brand-outline"
                }`}
                onClick={() => setSelectedPrice("quarterly")}
              >
                <div className="flex flex-row justify-between">
                  <span className="flex gap-1 text-sm font-medium">
                    <span className="font-bold">Quarterly</span> Billing
                  </span>
                  <Label className="rounded-[4px] border border-brand-mainnet px-2 text-xs text-brand-mainnet">
                    Save {quarterlySavings}%
                  </Label>
                </div>
                <div>
                  <div className="flex flex-row items-end gap-1 text-sm font-semibold">
                    <span className="text-4xl">${(quarterlyAmount / 3 || 0).toFixed(2)}</span> / Month
                  </div>
                  <span className="m-0 flex flex-row items-end gap-1 p-0 text-sm text-brand-gray">
                    ${quarterlyAmount.toFixed(2)} / quarter
                  </span>
                </div>
              </Card>
              <Card
                className={`col-span-12 cursor-pointer gap-3 rounded-[6px] border border-transparent p-4 md:col-span-4 lg:gap-3 lg:p-4 ${
                  selectedPrice === "yearly" ? " border-brand-testnet bg-brand-testnet/10" : "border-brand-outline"
                }`}
                onClick={() => setSelectedPrice("yearly")}
              >
                <div className="flex flex-row justify-between">
                  <span className="flex gap-1 text-sm font-medium">
                    <span className="font-bold">Yearly</span> Billing
                  </span>
                  <Label className="rounded-[4px] border border-brand-mainnet px-2 text-xs text-brand-mainnet">
                    Save {yearlySavings}%
                  </Label>
                </div>
                <div>
                  <div className="flex flex-row items-end gap-1 text-sm font-semibold">
                    <span className="text-4xl">${(yearlyAmount / 12 || 0).toFixed(2)}</span> / Month
                  </div>
                  <span className="m-0 flex flex-row items-end gap-1 p-0 text-sm text-brand-gray">
                    ${yearlyAmount.toFixed(2)} / year
                  </span>
                </div>
              </Card>
            </div>
          </Card>
        </div>
        <div
          className="col-span-9 rounded-[10px] bg-gradient-to-b p-[2px] lg:col-span-3"
          style={{ backgroundImage: "linear-gradient(to bottom, #5C7BE9, #FFFFFF 50%)" }}
        >
          <div
            className="flex flex-col rounded-[10px] border-0 bg-gradient-to-b"
            style={{ backgroundImage: "linear-gradient(to bottom, #CDD6F7, #FFFFFF 50%)" }}
          >
            <div>
              <div className="gap-3 p-3 lg:gap-6 lg:p-6">
                <Heading className="pb-3 text-xs font-normal uppercase text-[#5875FF] lg:pb-6">
                  Your Node Configuration
                </Heading>
                <Heading as="h2" className="pb-3 text-base font-semibold">
                  Configuration
                </Heading>

                <div className="flex flex-col gap-3 pb-3 lg:pb-6">
                  {offerings.map(({ label, value, hasChange }) => (
                    <div key={label} className="flex items-center justify-between text-sm font-normal">
                      <span className="flex items-center gap-2">
                        <Image
                          src={withBasePath(`/assets/images/purchase/circlecheck.svg`)}
                          alt="Circle Check"
                          width={20}
                          height={20}
                        />
                        {label}
                      </span>
                      <span className="flex flex-row font-medium">
                        {capitalizeRegion(value)}
                        {hasChange && (
                          <button
                            onClick={() => {
                              useProtocolStore.getState().setFocusedProtocol(navigationLabel);
                              router.push(ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES_PROTOCOLS);
                            }}
                            className=" ml-2 font-poppins text-sm font-medium text-brand-mainnet underline"
                          >
                            Change
                          </button>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <Heading as="h2" className="text-base font-semibold">
                  Monitoring & SLA
                </Heading>
                <div className="my-3 h-px bg-gray-300"></div>
                <div className="flex flex-col gap-3 ">
                  {monitoringItems.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center text-sm font-medium ${item.icon === "uptime" ? "gap-3" : "gap-2"}`}
                    >
                      {item.icon === "uptime" ? (
                        <IconLaunch height={20} width={20} className=" text-brand-archive" />
                      ) : (
                        <Image
                          src={withBasePath(`/assets/images/purchase/${item.icon}.svg`)}
                          alt={item.icon}
                          height={24}
                          width={24}
                        />
                      )}
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="sticky bottom-0 flex flex-col gap-4 rounded-b-[12px] bg-[#D7DCF8] p-3 lg:p-6">
                <Heading className="text-xs font-normal uppercase text-[#5875FF]">Pricing</Heading>
                <div className="flex items-center justify-between text-brand-dark">
                  <span className="font-semibold">{toCapitalize(selectedPrice)} Recurring Cost</span>
                  <span className="flex flex-col text-lg font-medium">
                    ${selectedRecurringAmount.toFixed(2)} / {selectedPriceLabel}
                    {/* <span className="text-end text-sm text-brand-gray">${monthlyEquivalent.toFixed(2)} / Month</span> */}
                  </span>
                </div>
                <Z4Button
                  colorScheme={"testnet"}
                  type="submit"
                  isLoading={isSubmitting}
                  isDisabled={!canCreate}
                  className="p-3 lg:p-6"
                  onClick={onCreate}
                >
                  Create Now
                </Z4Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullNodePurchasePageClient;
