"use client";
import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, Heading, IconButton, Input, Tooltip, useToast, Z4Navigation } from "@zeeve-platform/ui";
import { IconInfoCircle } from "@zeeve-platform/icons/essential/outline";
import { FormField, Z4RadioCard } from "@zeeve-platform/ui-common-components";
import DeploySummary, { PolygonDeploySummaryState } from "./_components/deploy-summary";
import { REGEX_ETH_ADDRESS } from "@orbit/constants/regex";
import { getConfig } from "@/config";
import { withBasePath } from "@/utils/helpers";
import useRollupService, { RollupKey } from "@/services/rollups/use-rollup-service";
import useRollupConfiguration, {
  RollupComingSoonIndicator,
  RollupConfigOption,
  RollupConfigType,
} from "@/services/rollups/use-rollup-configuration";
import type { RollupDeployResponse } from "@/services/rollups/types";
import { redirectToStripeUrl } from "@/utils/redirects";

const isComingSoon = (option?: RollupComingSoonIndicator) =>
  Boolean(option?.comming_soon ?? option?.coming_soon ?? option?.comingSoon);

const DeployPolygonCdkPageClient = () => {
  const env = "testnet" as "testnet" | "mainnet";
  const key = "polygon-cdk" as RollupKey;
  const toast = useToast();
  const config = getConfig();
  const platformFrontendUrl =
    config.url?.external?.platformNew?.frontend ??
    config.url?.external?.platformOld?.frontend ??
    config.url?.host ??
    "/";

  const { deploy } = useRollupService();
  const { options, request: cfgReq } = useRollupConfiguration(key);
  const configurationTypes = useMemo<RollupConfigType[]>(() => {
    const types = cfgReq.data?.data?.types;
    if (!Array.isArray(types)) return [];
    return types as RollupConfigType[];
  }, [cfgReq.data?.data?.types]);
  const rawType = useMemo<RollupConfigType | undefined>(() => {
    const lowerKey = key.toLowerCase();
    return (
      configurationTypes.find((type) => String(type?.name ?? "").toLowerCase() === lowerKey) ?? configurationTypes[0]
    );
  }, [configurationTypes, key]);
  const altDA = useMemo(() => {
    const list = Array.isArray(rawType?.data_availability) ? (rawType.data_availability as RollupConfigOption[]) : [];
    return list.filter((da) => isComingSoon(da));
  }, [rawType]);
  const comingSoonSequencers = useMemo(() => {
    const list = Array.isArray(rawType?.sequencers) ? (rawType.sequencers as RollupConfigOption[]) : [];
    return list.filter((item) => isComingSoon(item));
  }, [rawType]);
  const slOptions = useMemo(() => options.settlementLayers, [options.settlementLayers]);
  const daOptions = useMemo(() => options.dataAvailabilityLayers, [options.dataAvailabilityLayers]);
  const [slValue, setSlValue] = useState<string>("");
  const [daValue, setDaValue] = useState<string>("");
  const [networkName, setNetworkName] = useState<string>("");
  const [chainId, setChainId] = useState<string>("");
  const [sequencerType, setSequencerType] = useState<"Centralized" | "DeCentralized">("Centralized");
  const [premineAmount, setPremineAmount] = useState<string>("");
  const [premineAddress, setPremineAddress] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const handleStripeRedirect = (url: string) => {
    if (redirectToStripeUrl(url)) {
      return true;
    }
    toast("", { status: "error", message: "Invalid payment link. Please contact support." });
    return false;
  };
  useEffect(() => {
    if (!slValue && slOptions.length > 0) setSlValue(slOptions[0].value);
  }, [slOptions, slValue]);
  useEffect(() => {
    if (!daValue && daOptions.length > 0) setDaValue(daOptions[0].value);
  }, [daOptions, daValue]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("networkName") || "");
    const settlementLayer = String(slValue);
    const externalDA = String(daValue);
    const mappedExternalDA = externalDA.toLowerCase().includes("ethereum") ? "OnChainDataAvailability" : externalDA;
    const defaultRegions = (rawType as { default_regions?: Array<{ id?: string | number }> })?.default_regions ?? [];
    const regions =
      defaultRegions.length > 0
        ? defaultRegions
            .map((region) => region?.id)
            .filter((regionId): regionId is string | number => regionId !== undefined && regionId !== null)
        : [1];
    const typeId = rawType?.id ?? 6;

    // Premine validation
    const amt = Number(premineAmount);
    if (!(amt >= 1 && amt <= 1000)) {
      toast("Premine amount must be between 1 and 1000", { status: "error" });
      return;
    }
    if (!REGEX_ETH_ADDRESS.test(premineAddress)) {
      toast("Enter valid premine address", { status: "error" });
      return;
    }

    const payload = {
      type_id: typeId,
      name,
      region_ids: regions,
      network_type: env,
      is_demo: false,
      premine_address: premineAddress,
      premine_amount: String(premineAmount),
      configuration: {
        settlement_layer: settlementLayer,
        external_d_a: mappedExternalDA,
        sequencer: sequencerType,
        chainId: chainId,
      },
      core_components: [],
      nodes: [],
    } as Record<string, unknown>;
    try {
      setIsSubmitting(true);
      const res = await deploy().request(payload);
      const response = res as RollupDeployResponse;
      const checkoutUrl = response.data?.checkout_url ?? response.checkout_url ?? undefined;
      const redirectionUrl = response.data?.redirectionUrl ?? response.redirectionUrl ?? undefined;
      const serviceId =
        response.data?.service?.service_id ??
        response.service?.service_id ??
        response.data?.id ??
        response.id ??
        undefined;
      if (checkoutUrl) {
        if (handleStripeRedirect(checkoutUrl)) {
          return;
        }
        return;
      }
      if (redirectionUrl) {
        if (redirectionUrl.startsWith("http")) {
          if (handleStripeRedirect(redirectionUrl)) {
            return;
          }
        } else {
          location.href = redirectionUrl;
        }
        return;
      }
      if (serviceId) {
        location.href = withBasePath(`/polygon-cdk/network/${serviceId}`);
        return;
      }
      toast("Deployment started", { status: "success" });
    } catch {
      toast("Failed to deploy", { status: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Field validations and helper messages
  const nameError = !networkName
    ? "Rollup Name is required."
    : networkName.length > 10
      ? "Maximum 10 characters allowed."
      : undefined;

  const chainIdDigitsOnly = /^[0-9]+$/;
  const chainIdError = !chainId
    ? "Chain ID is required."
    : !chainIdDigitsOnly.test(chainId)
      ? "Chain ID must contain only digits."
      : chainId.length > 10
        ? "Maximum 10 characters allowed."
        : undefined;

  const amountNum = Number(premineAmount);
  const premineAmountError = !premineAmount
    ? "Premine amount is required."
    : Number.isNaN(amountNum)
      ? "Premine amount must be a number."
      : amountNum < 1 || amountNum > 1000
        ? "Premine amount must be between 1 and 1000."
        : undefined;

  const premineAddressError = !premineAddress
    ? "Premine address is required."
    : !REGEX_ETH_ADDRESS.test(premineAddress)
      ? "Enter valid premine address."
      : undefined;

  const isFormValid = Boolean(
    !nameError && !chainIdError && !premineAmountError && !premineAddressError && slValue && daValue,
  );

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      <Z4Navigation
        heading={"Polygon CDK"}
        breadcrumb={{
          items: [
            { href: `${platformFrontendUrl}`, label: "Dashboard", as: Link },
            { href: "/polygon-cdk", label: "Polygon CDK", isActive: false, as: Link },
            { href: `/polygon-cdk/deploy`, label: `Deploy L2 testnet`, isActive: true, as: Link },
          ],
        }}
      />
      <form onSubmit={onSubmit} className="grid grid-cols-10 gap-3 lg:gap-6">
        <Heading as="h4" className="col-span-12">
          Deploy L2 testnet
        </Heading>
        <div className="col-span-12 flex flex-col gap-3 lg:gap-6 xl:col-span-6">
          <Card className="flex flex-col gap-3 rounded-xl border border-brand-outline p-3 shadow-xl lg:gap-4 lg:p-6">
            <div className="flex flex-row items-center gap-1">
              <Heading as="h5">Rollup Network Details</Heading>
              <Tooltip text="Rollup network name for your deployment" placement="top-start">
                <IconButton variant="text" colorScheme="gray">
                  <IconInfoCircle className="text-base" />
                </IconButton>
              </Tooltip>
            </div>
            <div className="grid grid-cols-12 gap-3 lg:gap-6">
              <FormField className="col-span-12 md:col-span-6" helper={{ status: "error", text: nameError }}>
                <span className="mb-1 text-sm font-medium text-[#09122D]">Rollup Name</span>
                <Input
                  type="text"
                  className="rounded-md bg-white"
                  size={"small"}
                  name="networkName"
                  maxLength={10}
                  onChange={(e) => setNetworkName(e.target.value)}
                  placeholder="Enter Rollup Name"
                />
              </FormField>
              <FormField className="col-span-12 md:col-span-6" helper={{ status: "error", text: chainIdError }}>
                <span className="mb-1 text-sm font-medium text-[#09122D]">Chain ID</span>
                <Input
                  type="text"
                  className="rounded-md bg-white"
                  size={"small"}
                  name="chainId"
                  maxLength={10}
                  onChange={(e) => setChainId(e.target.value)}
                  placeholder="Chain ID"
                />
              </FormField>
            </div>
          </Card>
          <Card className="flex flex-col gap-3 rounded-xl border border-brand-outline p-3 shadow-xl lg:gap-6 lg:p-6">
            <div className="flex flex-row items-center gap-1">
              <Heading as="h5">Settlement Layer</Heading>
              <Tooltip text="Final settlement layer" placement="top-start">
                <IconButton variant="text" colorScheme="gray">
                  <IconInfoCircle className="text-base" />
                </IconButton>
              </Tooltip>
            </div>
            <div className="grid grid-cols-12 gap-3 lg:gap-6">
              {slOptions.map((s) => (
                <Z4RadioCard
                  key={s.value}
                  value={s.value}
                  className="col-span-12 md:col-span-6"
                  isChecked={slValue === s.value}
                  onClick={() => setSlValue(s.value)}
                >
                  <div className="flex flex-row items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-white font-medium">
                      <Image
                        src={withBasePath(`/assets/images/protocol/partners/ethereum.svg`)}
                        alt="Ethereum"
                        width={14}
                        height={14}
                      />
                    </span>
                    {s.label}
                  </div>
                </Z4RadioCard>
              ))}
              <input type="hidden" name="settlementLayer" value={slValue} />
            </div>
          </Card>
          <Card className="flex flex-col gap-3 rounded-xl border border-brand-outline p-3 shadow-xl lg:gap-6 lg:p-6">
            <div className="flex flex-row items-center gap-1">
              <Heading as="h5">Data Availability (DA) Layer</Heading>
              <Tooltip text="Ensure transaction data is published and accessible" placement="top-start">
                <IconButton variant="text" colorScheme="gray">
                  <IconInfoCircle className="text-base" />
                </IconButton>
              </Tooltip>
            </div>
            <div className="grid grid-cols-12 gap-3 lg:gap-6">
              {daOptions.map((da) => (
                <Z4RadioCard
                  key={da.value}
                  value={da.value}
                  className="col-span-12 md:col-span-6"
                  isChecked={daValue === da.value}
                  onClick={() => setDaValue(da.value)}
                >
                  <div className="flex flex-row items-center gap-2">
                    <span className="flex size-5 items-center justify-center rounded-full bg-white p-1.5 font-medium">
                      <Image
                        src={withBasePath(`/assets/images/protocol/partners/ethereum.svg`)}
                        alt="Logo"
                        width={18}
                        height={18}
                      />
                    </span>
                    {da.label}
                  </div>
                </Z4RadioCard>
              ))}
              {altDA && altDA.length > 0 ? (
                <Z4RadioCard value="AltDA" className="col-span-12 md:col-span-6" isDisabled isChecked={false}>
                  <div className="flex flex-row items-center gap-3">
                    <span>Alt DA</span>
                    <div className="flex flex-row flex-wrap items-center gap-2">
                      {altDA.map((da, idx) => {
                        const { logo_url, logo } = da as { logo_url?: string; logo?: string };
                        return (
                          <span
                            key={`${String(da?.id ?? da?.name)}-${idx}`}
                            title={String(da?.name ?? "")}
                            className="inline-flex items-center justify-center rounded"
                          >
                            <Image
                              src={logo_url || logo || withBasePath(`/assets/images/protocol/partners/custom.svg`)}
                              alt={String(da?.name ?? "")}
                              width={24}
                              height={24}
                              unoptimized
                              style={{ objectFit: "contain", borderRadius: 4 }}
                            />
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </Z4RadioCard>
              ) : null}
              <input type="hidden" name="dataAvailability" value={daValue} />
            </div>
          </Card>

          {/* Sequencer */}
          <Card className="flex flex-col gap-3 rounded-xl border border-brand-outline p-3 shadow-xl lg:gap-6 lg:p-6">
            <div className="flex flex-row items-center gap-1">
              <Heading as="h5">Sequencer</Heading>
              <Tooltip text="Sequencer batches and posts transactions to L1/L2 for finality." placement="top-start">
                <IconButton variant="text" colorScheme="gray">
                  <IconInfoCircle className="text-base" />
                </IconButton>
              </Tooltip>
            </div>
            <div className="grid grid-cols-12 gap-3 lg:gap-6">
              <Z4RadioCard
                value="Centralized"
                className="col-span-12 md:col-span-6"
                isChecked={sequencerType === "Centralized"}
                onClick={() => setSequencerType("Centralized")}
              >
                Centralized
              </Z4RadioCard>
              <Z4RadioCard
                value="DeCentralized"
                className="col-span-12 md:col-span-6"
                isChecked={sequencerType === "DeCentralized"}
                isDisabled
                onClick={() => setSequencerType("DeCentralized")}
              >
                <div className="flex items-center gap-2">
                  <span>Decentralized</span>
                  <div className="flex items-center gap-1 opacity-80">
                    {comingSoonSequencers.map((sequencer, idx) => {
                      const { logo_url, logo } = sequencer as { logo_url?: string; logo?: string };
                      return (
                        <Tooltip
                          key={`${String(sequencer?.id ?? sequencer?.name)}-${idx}`}
                          text={String(sequencer?.name ?? "")}
                          placement="top-start"
                        >
                          <span className="inline-flex items-center justify-center rounded">
                            <Image
                              src={logo_url || logo || withBasePath(`/assets/images/protocol/partners/custom.svg`)}
                              alt={String(sequencer?.name ?? "")}
                              width={18}
                              height={18}
                              unoptimized
                            />
                          </span>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              </Z4RadioCard>
            </div>
          </Card>

          {/* Premine Account */}
          <Card className="flex flex-col gap-3 rounded-xl border border-brand-outline p-3 shadow-xl lg:gap-6 lg:p-6">
            <div className="flex flex-row items-center gap-1">
              <Heading as="h5">Premine Account</Heading>
              <Tooltip text="Premine account settings" placement="top-start">
                <IconButton variant="text" colorScheme="gray">
                  <IconInfoCircle className="text-base" />
                </IconButton>
              </Tooltip>
            </div>
            <div className="grid grid-cols-12 gap-3 lg:gap-6">
              <FormField className="col-span-12 md:col-span-6" helper={{ status: "error", text: premineAmountError }}>
                <span className="mb-1 text-sm font-medium text-[#09122D]">Premine Amount</span>
                <Input
                  type="number"
                  min={1}
                  max={1000}
                  className="rounded-md bg-white"
                  size="small"
                  value={premineAmount}
                  onChange={(e) => setPremineAmount(e.target.value)}
                  placeholder="1 - 1000"
                />
              </FormField>
              <FormField className="col-span-12 md:col-span-6" helper={{ status: "error", text: premineAddressError }}>
                <span className="mb-1 text-sm font-medium text-[#09122D]">Premine Address</span>
                <Input
                  type="text"
                  className="rounded-md bg-white"
                  size="small"
                  value={premineAddress}
                  onChange={(e) => setPremineAddress(e.target.value)}
                  placeholder="0x..."
                />
              </FormField>
            </div>
          </Card>

          {/* Removed duplicate Sequencer section */}
        </div>
        <div className="col-span-12 xl:col-span-4">
          <DeploySummary
            isSubmitting={isSubmitting}
            isValid={isFormValid}
            formState={
              { networkName, chainId, settlementLayer: slValue, dataAvailability: daValue } as PolygonDeploySummaryState
            }
          />
        </div>
      </form>
    </div>
  );
};

export default DeployPolygonCdkPageClient;
