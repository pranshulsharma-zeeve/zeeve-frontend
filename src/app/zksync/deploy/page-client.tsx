"use client";
import { useMemo, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, Heading, IconButton, Input, Tooltip, useToast, Z4Navigation } from "@zeeve-platform/ui";
import { IconInfoCircle } from "@zeeve-platform/icons/essential/outline";
import { FormField, Z4RadioCard } from "@zeeve-platform/ui-common-components";
import DeploySummary, { ZkDeploySummaryState } from "./_components/deploy-summary";
import { withBasePath } from "@/utils/helpers";
import useRollupService, { RollupKey } from "@/services/rollups/use-rollup-service";
import useRollupConfiguration, { RollupConfigType } from "@/services/rollups/use-rollup-configuration";
import ROUTES from "@/routes";
import { redirectToStripeUrl } from "@/utils/redirects";

const DeployZkSyncPageClient = () => {
  const env = (useSearchParams().get("env") ?? "testnet") as "testnet" | "mainnet";
  const key = "zksync" as RollupKey;
  const toast = useToast();
  const router = useRouter();

  const { deploy } = useRollupService();
  const { options, request: cfgReq } = useRollupConfiguration(key);
  const slOptions = useMemo(() => options.settlementLayers, [options.settlementLayers]);
  const daOptions = useMemo(() => options.dataAvailabilityLayers, [options.dataAvailabilityLayers]);
  const configurationTypes = useMemo<RollupConfigType[]>(() => {
    const types = cfgReq.data?.data?.types;
    if (!Array.isArray(types)) return [];
    return types as RollupConfigType[];
  }, [cfgReq.data?.data?.types]);
  const rawType = useMemo(() => {
    const types = cfgReq.data?.data?.types ?? [];
    return types.find((t: any) => String(t?.name ?? "").toLowerCase() === key) ?? types[0];
  }, [cfgReq.data?.data?.types, key]);
  const altDA = useMemo(() => {
    const arr = Array.isArray(rawType?.data_availability) ? rawType.data_availability : [];
    return arr.filter((da: any) => da?.comming_soon || da?.coming_soon || da?.comingSoon);
  }, [rawType]);
  const sequencers = useMemo(() => (Array.isArray(rawType?.sequencers) ? rawType.sequencers : []), [rawType]);
  const comingSoonSequencers = useMemo(
    () => sequencers.filter((s: any) => s?.comming_soon || s?.coming_soon || s?.comingSoon),
    [sequencers],
  );
  const [slValue, setSlValue] = useState<string>("");
  const [daValue, setDaValue] = useState<string>("");
  const [networkName, setNetworkName] = useState<string>("");
  const [chainId, setChainId] = useState<string>("");
  const [sequencerType, setSequencerType] = useState<"Centralized" | "DeCentralized">("Centralized");
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
    // Build payload as per new requirement similar to Arbitrum structure
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("networkName") || "");
    const chainIdVal = String(formData.get("chainId") || "");
    const settlementLayer = String(formData.get("settlementLayer") || slValue);
    const externalDA = String(formData.get("dataAvailability") || daValue);
    const mappedExternalDA = externalDA.toLowerCase().includes("ethereum") ? "OnChainDataAvailability" : externalDA;
    const typeId = configurationTypes[0]?.id ?? 6;
    const defaultRegions =
      (configurationTypes[0] as { default_regions?: Array<{ id?: string | number }> })?.default_regions ?? [];
    const regionIds = defaultRegions
      .map((region) => region?.id)
      .filter((regionId): regionId is string | number => regionId !== undefined && regionId !== null);
    const regionIdsPayload = regionIds.length > 0 ? regionIds : [1];

    const payload = {
      type_id: typeId,
      name,
      region_ids: regionIdsPayload,
      network_type: env,
      is_demo: false,
      configuration: {
        settlement_layer: settlementLayer,
        external_d_a: mappedExternalDA,
        sequencer: "Centralized",
        chain_id: chainIdVal,
      },
      core_components: [],
      nodes: [],
    } as Record<string, unknown>;
    try {
      setIsSubmitting(true);
      const res = await deploy().request(payload);
      const checkoutUrl = (res as any)?.data?.checkout_url || (res as any)?.checkout_url;
      const redirectionUrl = (res as any)?.data?.redirectionUrl || (res as any)?.redirectionUrl;
      const serviceId =
        (res as any)?.data?.service?.service_id || (res as any)?.service?.service_id || (res as any)?.data?.id;
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
          router.push(redirectionUrl);
        }
        return;
      }
      if (serviceId) {
        router.push(withBasePath(`/zksync/network/${serviceId}`));
        return;
      }
      toast("Deployment started", { status: "success" });
    } catch {
      toast("Failed to deploy", { status: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      <Z4Navigation
        heading={"zkSync Hyperchains"}
        breadcrumb={{
          items: [
            { href: ROUTES.PLATFORM.PAGE.DASHBOARD, label: "Dashboard", isActive: false, as: Link },
            { href: "/zksync", label: "zkSync Hyperchains", isActive: false, as: Link },
            { href: `/zksync/deploy?env=${env}`, label: `Deploy L2 ${env}`, isActive: true, as: Link },
          ],
        }}
      />
      <form onSubmit={onSubmit} className="grid grid-cols-10 gap-3 lg:gap-6">
        <Heading as="h4" className="col-span-10">{`Deploy L2 ${env}`}</Heading>
        <div className="col-span-10 flex flex-col gap-3 lg:gap-6 xl:col-span-6">
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
              <FormField className="col-span-12 md:col-span-6 ">
                <span className="mb-1 text-sm font-medium text-[#09122D]">Rollup Name</span>
                <Input
                  className="rounded-md bg-white"
                  name="networkName"
                  placeholder="Enter Rollup Name"
                  size="small"
                  isRequired
                  value={networkName}
                  onChange={(e) => setNetworkName(e.target.value)}
                />
              </FormField>
              <FormField className="col-span-12 md:col-span-6 ">
                <span className="mb-1 text-sm font-medium text-[#09122D]">Chain ID</span>
                <Input
                  className="rounded-md bg-white"
                  name="chainId"
                  placeholder="Chain ID"
                  size="small"
                  value={chainId}
                  onChange={(e) => setChainId(e.target.value)}
                />
              </FormField>
            </div>
          </Card>

          <Card className="flex flex-col gap-3 rounded-xl border border-brand-outline p-3 shadow-xl lg:gap-6 lg:p-6">
            <div className="flex flex-row items-center gap-1">
              <Heading as="h5">Settlement Layer</Heading>
              <Tooltip text="Base layer for finality and consensus" placement="top-start">
                <IconButton variant="text" colorScheme="gray">
                  <IconInfoCircle className="text-base" />
                </IconButton>
              </Tooltip>
            </div>
            <div className="grid grid-cols-12 gap-3 lg:gap-6">
              {slOptions.map((sl) => (
                <Z4RadioCard
                  key={sl.value}
                  value={sl.value}
                  className="col-span-12 md:col-span-6"
                  isChecked={slValue === sl.value}
                  onClick={() => setSlValue(sl.value)}
                >
                  <div className="flex flex-row items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-full bg-white font-medium">
                      <Image
                        src={withBasePath(`/assets/images/partners/ethereum.svg`)}
                        alt="Logo"
                        width={18}
                        height={18}
                      />
                    </span>
                    {sl.label}
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
                    <span className="flex size-8 items-center justify-center rounded-full bg-white font-medium">
                      <Image
                        src={withBasePath(`/assets/images/partners/ethereum.svg`)}
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
                      {altDA.map((da: any, idx: number) => (
                        <span
                          key={`${String(da?.id ?? da?.name)}-${idx}`}
                          title={String(da?.name ?? "")}
                          className="inline-flex items-center justify-center rounded"
                        >
                          <Image
                            src={da?.logo_url || da?.logo}
                            alt={String(da?.name ?? "")}
                            width={24}
                            height={24}
                            unoptimized
                            style={{ objectFit: "contain", borderRadius: 4 }}
                          />
                        </span>
                      ))}
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
                    {comingSoonSequencers.map((s: any, idx: number) => (
                      <Tooltip
                        key={`${String(s?.id ?? s?.name)}-${idx}`}
                        text={String(s?.name ?? "")}
                        placement="top-start"
                      >
                        <span className="inline-flex items-center justify-center rounded">
                          <Image
                            src={s?.logo_url || withBasePath(`/assets/images/partners/custom.svg`)}
                            alt={String(s?.name ?? "")}
                            width={18}
                            height={18}
                            unoptimized
                          />
                        </span>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </Z4RadioCard>
            </div>
          </Card>

          {/* Single deploy button lives in the summary card on the right */}
        </div>
        {/* Summary Card */}
        <div className="col-span-10 xl:col-span-4">
          <DeploySummary
            isSubmitting={isSubmitting}
            isValid={Boolean(networkName && slValue && daValue)}
            formState={
              { networkName, chainId, settlementLayer: slValue, dataAvailability: daValue } as ZkDeploySummaryState
            }
          />
        </div>
      </form>
    </div>
  );
};

export default DeployZkSyncPageClient;
