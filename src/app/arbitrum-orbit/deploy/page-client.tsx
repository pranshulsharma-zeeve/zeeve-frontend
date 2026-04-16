"use client";
import Image from "next/image";
import { Card, Heading, IconButton, Input, Tooltip, useToast } from "@zeeve-platform/ui";
import { IconInfoCircle } from "@zeeve-platform/icons/essential/outline";
import { useCallback, useEffect, useState } from "react";
import { FormField, Z4RadioCard } from "@zeeve-platform/ui-common-components";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import useOrbitRollupConfiguration, {
  RollupComingSoonIndicator,
  RollupConfigType,
  RollupConfigOption,
} from "../../../services/rollups/use-rollup-configuration";
import DeploySummary from "./_components/deploy-summary";
import { toCapitalize, withBasePath } from "@orbit/utils/helpers";
import ROUTES from "@orbit/routes";
import { REGEX_ETH_ADDRESS, REGEX_NAME } from "@orbit/constants/regex";
import { useDeployNetworkFormStore } from "@orbit/store/deploy-network";
import { ArbitrumOrbitServiceError } from "@orbit/services/arbitrum-orbit/types";
import { getPartnerIconPath } from "@orbit/constants/partner-icons";
import { backendAxiosInstance as orbitAxios } from "@orbit/utils/axios";
import PageHeader from "@/components/shared/PageHeader";
import { withApiBasePath } from "@/constants/api";
import { redirectToStripeUrl } from "@/utils/redirects";

export const externalDaPartners = ["celestia", "near", "avail", "eigen", "0g"];
export const sequencerPartners = ["cero"];

const deployNetworkConfigValidationSchema = yup
  .object({
    networkName: yup
      .string()
      .required("Rollup Name is required.")
      .min(3, "Minimum 3 characters required.")
      .max(10, "Maximum 10 characters allowed.")
      .matches(REGEX_NAME, "Arbitrum Orbit name must be alphanumeric and can have spaces."),
    // Use a general string to support dynamic options from configuration API
    settlementLayer: yup.string().required("Please select Settlement Layer."),
    externalDA: yup
      .object({
        externalDaType: yup
          .string<"OffChainDataAvailability" | "LocalDA" | "OnChainDataAvailability">()
          .required("Please select External DA."),
        offChainPartner: yup.string().when("externalDaType", {
          is: "OffChainDataAvailability",
          then: (schema) => schema.required("Please select External DA partner."),
          otherwise: (schema) => schema.optional(),
        }),
        NativeGasToken: yup.string<"Custom" | "ETH">().when("externalDaType", {
          is: "LocalDA",
          then: (schema) => schema.required("Please select native gas token."),
          otherwise: (schema) => schema.optional(),
        }),
        premineAmount: yup.number().when("NativeGasToken", {
          is: "Custom",
          then: (schema) =>
            schema
              .required("Premine amount is required.")
              .moreThan(0, "Premine amount must be greater than 0.")
              .max(10000, "Premine amount cannot exceed 10000.")
              .typeError("Please enter Premine amount."),
          otherwise: (schema) => schema.optional(),
        }),
        premineAddress: yup.string().when("NativeGasToken", {
          is: "Custom",
          then: (schema) =>
            schema
              .required("Premine address is required.")
              .matches(REGEX_ETH_ADDRESS, "Please enter a valid ethereum address."),
          otherwise: (schema) => schema.optional(),
        }),

        tokenName: yup.string().when("NativeGasToken", {
          is: "Custom",
          then: (schema) =>
            schema
              .required("Please enter token name.")
              .min(3, "Minimum 3 characters required.")
              .max(18, "Maximum 18 characters allowed.")
              .matches(/^[A-Za-z][A-Za-z0-9]*$/, "Token name must be alphanumeric and starts with alphabet."),
          otherwise: (schema) => schema.optional(),
        }),
        tokenSymbol: yup.string().when("NativeGasToken", {
          is: "Custom",
          then: (schema) =>
            schema
              .required("Please enter token symbol.")
              .min(3, "Minimum 3 characters required.")
              .max(6, "Maximum 6 characters allowed.")
              .matches(/^[A-Za-z][A-Za-z0-9]*$/, "Token symbol must be alphanumeric and starts with alphabet."),
          otherwise: (schema) => schema.optional(),
        }),
      })
      .required(),
    sequencer: yup
      .object({
        sequencerType: yup.string().required("Please select sequencer."),
        deCentralizedPartner: yup.string().when("sequencerType", {
          is: "DeCentralized",
          then: (schema) => schema.required("Please select sequencer partner."),
          otherwise: (schema) => schema.optional(),
        }),
      })
      .required(),
    // deployerKey: yup.string().required("Please enter deployer key."),
    integrations: yup.object({
      bridge: yup.boolean(),
      rpc: yup.boolean(),
      blockExplorer: yup.boolean(),
      faucet: yup.boolean(),
      deCentalizedOracles: yup.boolean(),
      otherBlockExplorer: yup.boolean(),
      deCentalizedStorage: yup.boolean(),
      mpcWallets: yup.boolean(),
      onOffRamps: yup.boolean(),
      web3Functions: yup.boolean(),
      developerTools: yup.boolean(),
    }),
  })
  .required();

type DeployNetworkSchemaType = yup.InferType<typeof deployNetworkConfigValidationSchema>;

const isComingSoon = (value?: RollupComingSoonIndicator) =>
  Boolean(value?.comming_soon ?? value?.coming_soon ?? value?.comingSoon);

const DeployPageClient = ({ demoNetworkId }: { demoNetworkId?: string }) => {
  const isDemo = demoNetworkId ? true : false;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const toast = useToast();
  const router = useRouter();
  const handleStripeRedirect = (url: string) => {
    if (redirectToStripeUrl(url)) {
      return true;
    }
    toast("", { status: "error", message: "Invalid payment link. Please contact support." });
    return false;
  };

  // Access deploy form store BEFORE initializing useForm (used for defaultValues)
  const { deployNetworkConfiguration, setFormData } = useDeployNetworkFormStore();

  // form state (declare before any effects that use watch/setValue)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<DeployNetworkSchemaType>({
    resolver: yupResolver(deployNetworkConfigValidationSchema),
    mode: "all",
    defaultValues: deployNetworkConfiguration ?? {
      networkName: "",
      // workspaceId removed (not used)
      settlementLayer: "ArbSepolia",
      externalDA: {
        externalDaType: "OnChainDataAvailability",
        offChainPartner: "",
        NativeGasToken: "ETH",
      },
      sequencer: { sequencerType: "Centralized", deCentralizedPartner: "" },
      integrations: {
        bridge: true,
        rpc: true,
        blockExplorer: true,
        faucet: true,
        deCentalizedOracles: false,
        otherBlockExplorer: false,
        mpcWallets: false,
        web3Functions: false,
        deCentalizedStorage: false,
        developerTools: false,
        onOffRamps: false,
      },
    },
  });

  // removed workspace list (not used)

  // store reference is already captured above

  // Load backend-driven configuration (settlement layer, DA, sequencer) using SWR + app axios
  const { request: configRequest } = useOrbitRollupConfiguration("arbitrum-orbit");
  const orbitConfigTypes = Array.isArray(configRequest.data?.data?.types)
    ? (configRequest.data?.data?.types as RollupConfigType[])
    : [];
  const orbitTypeConfig =
    orbitConfigTypes.find((type) => String(type?.name ?? "").toLowerCase() === "arbitrum-orbit") ?? orbitConfigTypes[0];
  const daList = Array.isArray(orbitTypeConfig?.data_availability)
    ? (orbitTypeConfig.data_availability as RollupConfigOption[])
    : [];
  const altDAOptions = daList.filter((da) => isComingSoon(da));
  const hasEthereumDA = daList.some((d) => {
    const nm = String(d?.name ?? "")
      .trim()
      .toLowerCase();
    return d?.active && (nm === "ethereum da" || nm.includes("ethereum"));
  });
  const hasAnyTrustDA = daList.some((d) => {
    const nm = String(d?.name ?? "")
      .trim()
      .toLowerCase();
    return d?.active && (nm === "anytrust da" || nm.includes("anytrust") || nm.includes("any trust"));
  });
  const sequencersList = Array.isArray(orbitTypeConfig?.sequencers)
    ? (orbitTypeConfig.sequencers as RollupConfigOption[])
    : [];
  const hasCentralizedSeq = sequencersList.some((s) => {
    const nm = String(s?.name ?? "")
      .trim()
      .toLowerCase();
    return s?.active && (nm === "centralized" || nm.includes("central"));
  });
  const hasDecentralizedSeq = sequencersList.some((s) => {
    const nm = String(s?.name ?? "")
      .trim()
      .toLowerCase();
    return s?.active && (nm === "decentralized" || nm.includes("decentral"));
  });
  const comingSoonSequencers = sequencersList.filter((s) => isComingSoon(s));

  // Coerce defaults once config is available
  useEffect(() => {
    if (!orbitTypeConfig) return;
    // Settlement Layer default to first active from config
    const availableSL = Array.isArray(orbitTypeConfig?.settlement_layer)
      ? orbitTypeConfig.settlement_layer.filter((sl) => sl?.active)
      : [];
    if (availableSL.length > 0) {
      const currentSL = watch("settlementLayer");
      const hasCurrent = availableSL.some((sl) => String(sl?.name ?? "") === String(currentSL));
      if (!hasCurrent) {
        setValue("settlementLayer", String(availableSL[0].name));
        void trigger("settlementLayer");
      }
    }
    // If Ethereum DA not present, always use LocalDA
    if (!hasEthereumDA && watch("externalDA.externalDaType") !== "LocalDA") {
      setValue("externalDA.externalDaType", "LocalDA");
      void trigger("externalDA.externalDaType");
    }
    // Sequencer default
    const currentSeq = watch("sequencer.sequencerType");
    if (hasCentralizedSeq) {
      if (currentSeq !== "Centralized") {
        setValue("sequencer.sequencerType", "Centralized");
        void trigger("sequencer.sequencerType");
      }
    } else if (hasDecentralizedSeq) {
      if (currentSeq !== "DeCentralized") {
        setValue("sequencer.sequencerType", "DeCentralized");
        void trigger("sequencer.sequencerType");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orbitTypeConfig, hasEthereumDA, hasCentralizedSeq, hasDecentralizedSeq]);

  // Proactively validate name as user types so summary button updates
  const networkNameValue = watch("networkName");
  useEffect(() => {
    if (typeof networkNameValue === "string") {
      void trigger("networkName");
    }
  }, [networkNameValue, trigger]);

  const watchExternalDaType = watch("externalDA.externalDaType");
  const watchSequencerType = watch("sequencer.sequencerType");
  const watchNativeGasToken = watch("externalDA.NativeGasToken");

  // Removed prefill from demo network overview on deploy page per requirement.

  // workspace auto-select removed

  const onNativeGasTokenChange = useCallback(() => {
    if (watchNativeGasToken === "ETH") {
      setValue("externalDA.premineAmount", 0);
      setValue("externalDA.premineAddress", "");
      setValue("externalDA.tokenName", "");
      setValue("externalDA.tokenSymbol", "");
      setValue("integrations.faucet", false);
    }
    if (watchNativeGasToken === "Custom") {
      setValue("integrations.faucet", true);
    }
  }, [setValue, watchNativeGasToken]);

  const onExternalDAChange = useCallback(() => {
    if (watchExternalDaType !== "LocalDA") {
      setValue("externalDA.NativeGasToken", "ETH");
      setValue("externalDA.premineAmount", 0);
      setValue("externalDA.premineAddress", "");
      setValue("externalDA.tokenName", "");
      setValue("externalDA.tokenSymbol", "");
    }
    if (watchExternalDaType !== "OffChainDataAvailability") {
      setValue("externalDA.offChainPartner", "");
    }
  }, [setValue, watchExternalDaType]);

  const onSequencerChange = useCallback(() => {
    if (watchSequencerType !== "DeCentralized") {
      setValue("sequencer.deCentralizedPartner", "");
    }
  }, [setValue, watchSequencerType]);

  useEffect(() => {
    onNativeGasTokenChange();
    onExternalDAChange();
    onSequencerChange();
  }, [onExternalDAChange, onNativeGasTokenChange, onSequencerChange]);

  const onSubmit = async (data: DeployNetworkSchemaType) => {
    setFormData({ step: "deployNetworkConfiguration", data });
    try {
      setIsSubmitting(true);
      const regions = Array.isArray(orbitTypeConfig?.default_regions)
        ? (orbitTypeConfig.default_regions as Array<{ id?: string | number }>)
            .map((region) => region?.id)
            .filter((regionId): regionId is string | number => regionId !== undefined && regionId !== null)
        : [];
      const typeId = orbitTypeConfig?.id;
      const payload = {
        typeId,
        name: data.networkName,
        regionIds: regions,
        networkType: "testnet",
        isDemo: false,
        configuration: {
          settlementLayer: data.settlementLayer,
          externalDA: data.externalDA.externalDaType,
          offChainPartner: data.externalDA.offChainPartner,
          nativeGasToken: data.externalDA.NativeGasToken,
          premineAmount: data.externalDA.premineAmount,
          premineAddress: data.externalDA.premineAddress,
          tokenName: data.externalDA.tokenName,
          tokenSymbol: data.externalDA.tokenSymbol,
          sequencer: data.sequencer.sequencerType,
          sequencerPartner: data.sequencer.deCentralizedPartner,
        },
        coreComponents: [],
        nodes: [],
      };
      const toSnake = (obj: unknown): unknown => {
        if (Array.isArray(obj)) return obj.map((item) => toSnake(item));
        if (obj && typeof obj === "object") {
          return Object.fromEntries(
            Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
              k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`),
              toSnake(v),
            ]),
          );
        }
        return obj;
      };
      const resp = await orbitAxios.post(withApiBasePath("/rollup/service/deploy"), toSnake(payload));
      const checkoutUrl = resp?.data?.data?.checkout_url;
      const service = resp?.data?.data?.service;
      if (checkoutUrl) {
        if (handleStripeRedirect(checkoutUrl)) {
          return;
        }
        return;
      }
      if (service?.service_id) {
        router.push(withBasePath(`/arbitrum-orbit/network/${service.service_id}`));
        return;
      }
      toast("Deployment initiated", { status: "success" });
    } catch (error) {
      const err = error as AxiosError<ArbitrumOrbitServiceError>;
      if (axios.isAxiosError(error) && err.response?.data?.message) {
        toast("", { status: "error", message: err.response?.data.message });
      } else {
        toast("An unexpected error occurred", { status: "error" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      <PageHeader
        title="Arbitrum Orbit"
        breadcrumbs={[
          { href: ROUTES.PLATFORM.PAGE.HOME, label: "Dashboard" },
          { href: ROUTES.ARBITRUM_ORBIT.PAGE.LIST, label: "Arbitrum Orbit" },
          { href: ROUTES.ARBITRUM_ORBIT.PAGE.DEPLOY, label: "Deploy L3 Testnet", isActive: true },
        ]}
      />
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-10 gap-3 lg:gap-6">
        <Heading as="h4" className="col-span-12">
          {isDemo ? "Demo Configuration" : "Deploy L3 Testnet"}
        </Heading>
        <div className="col-span-12 flex flex-col gap-3 lg:gap-6 xl:col-span-6">
          {/* Select Network Details Section */}
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
              <FormField
                className="col-span-12 md:col-span-6 "
                helper={{
                  status: "error",
                  text: errors.networkName?.message?.toString(),
                }}
              >
                <span className="mb-1 text-sm font-medium text-[#09122D]">Rollup Name</span>
                <Input
                  className="rounded-md bg-white"
                  type="text"
                  size={"small"}
                  {...register("networkName")}
                  isRequired
                  floatingLabel={{
                    labelText: "Enter Rollup Name",
                    floatingLabelProps: {
                      className: "!text-sm",
                    },
                  }}
                  placeholder="Enter Rollup Name"
                  isDisabled={isDemo}
                />
              </FormField>
              {/* <FormField
                className="col-span-12 md:col-span-6 "
                helper={{
                  status: "error",
                  text: errors.workspaceId?.value?.message?.toString(),
                }}
              >
                <span className="mb-1 text-sm font-medium text-[#09122D]">Select Workspace</span>
                <Controller
                  name="workspaceId"
                  control={control}
                  render={({ field }) => (
                    <Z4ReactSelect
                      isDisabled={isDemo}
                      size="small"
                      options={workspaceListOptions}
                      isRequired
                      placeholder={isDemo ? "Default Workspace" : "Select Workspace"}
                      {...field}
                    />
                  )}
                />
              </FormField> */}
            </div>
          </Card>
          {/* Select Settlement Layer Section (from configuration API) */}
          <Card className="flex flex-col gap-3 rounded-xl border border-brand-outline p-3 shadow-xl    lg:gap-6 lg:p-6">
            <div className="flex flex-row items-center gap-1">
              <Heading as="h5">Settlement Layer</Heading>
              <Tooltip
                text="The base layer where final transaction validation, dispute resolution, and state commitments occur, ensuring security and consensus."
                placement="top-start"
              >
                <IconButton variant="text" colorScheme="gray">
                  <IconInfoCircle className="text-base" />
                </IconButton>
              </Tooltip>
            </div>
            <div className="grid grid-cols-12 gap-3 lg:gap-6">
              {Array.isArray(orbitTypeConfig?.settlement_layer)
                ? orbitTypeConfig.settlement_layer
                    .filter((sl) => sl?.active !== false)
                    .map((sl) => (
                      <Z4RadioCard
                        key={String(sl.id)}
                        value={String(sl.name)}
                        className="col-span-12 md:col-span-6"
                        {...register("settlementLayer")}
                        isDisabled={isDemo}
                        isChecked={watch("settlementLayer") === String(sl.name)}
                      >
                        <div className="flex flex-row items-center gap-2">
                          <span className="flex size-8 items-center justify-center rounded-full bg-white font-medium">
                            <Image
                              src={withBasePath(getPartnerIconPath("arbitrum-orbit"))}
                              alt="Arbitrum Logo"
                              width={26}
                              height={26}
                            />
                          </span>
                          {String(sl.name)}
                        </div>
                      </Z4RadioCard>
                    ))
                : null}
            </div>
          </Card>
          {/* Select External DA Section */}
          <Card className="flex flex-col gap-3 rounded-xl border border-brand-outline p-3 shadow-xl lg:gap-6 lg:p-6">
            <div className="flex flex-row items-center gap-1">
              <Heading as="h5">Data Availability (DA) Layer</Heading>
              <Tooltip
                text="A protocol that ensures transaction data is published and accessible so anyone can verify and reconstruct the blockchain state."
                placement="top-start"
              >
                <IconButton variant="text" colorScheme="gray">
                  <IconInfoCircle className="text-base" />
                </IconButton>
              </Tooltip>
            </div>
            <div className="grid grid-cols-12 gap-3 lg:gap-6">
              {hasEthereumDA ? (
                <Z4RadioCard
                  key="onChain"
                  value="OnChainDataAvailability"
                  className="col-span-12 lg:col-span-4 "
                  isDisabled={isDemo}
                  {...register("externalDA.externalDaType")}
                  isChecked={watch("externalDA.externalDaType") == "OnChainDataAvailability"}
                >
                  <div className="flex flex-row items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-full border border-brand-light bg-white p-1.5 font-medium">
                      <Image
                        src={withBasePath(getPartnerIconPath("ethereum"))}
                        alt="Ethereum Logo"
                        width={24}
                        height={24}
                      />
                    </span>
                    Ethereum DA
                  </div>
                </Z4RadioCard>
              ) : null}
              {hasAnyTrustDA ? (
                <Z4RadioCard
                  value="LocalDA"
                  className="col-span-12 lg:col-span-4 "
                  isDisabled={isDemo}
                  {...register("externalDA.externalDaType")}
                  isChecked={watch("externalDA.externalDaType") == "LocalDA"}
                >
                  <div className="flex flex-row items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-full bg-white font-medium">
                      <Image
                        src={withBasePath(getPartnerIconPath("arbitrum-orbit"))}
                        alt="Arbitrum Logo"
                        width={24}
                        height={24}
                      />
                    </span>
                    AnyTrust DA
                  </div>
                </Z4RadioCard>
              ) : null}
              <Z4RadioCard
                value="OffChainDataAvailability"
                className="col-span-12 !border-[#d0d0d0] lg:col-span-4"
                {...register("externalDA.externalDaType")}
                isDisabled
                isChecked={watch("externalDA.externalDaType") == "OffChainDataAvailability"}
              >
                <div className="flex flex-row items-center justify-around gap-3">
                  <span>Alt DA</span>
                  {altDAOptions.map((da, index) => (
                    <Tooltip key={`${da.id}-${index}`} text={String(da.name)} placement="top-start">
                      <span
                        className="pointer-events-auto inline-flex items-center justify-center rounded"
                        title={String(da.name)}
                      >
                        <Image
                          src={da.logo_url || withBasePath(getPartnerIconPath("custom"))}
                          alt={String(da.name)}
                          width={28}
                          height={28}
                          unoptimized
                          style={{ objectFit: "contain", borderRadius: 4 }}
                        />
                      </span>
                    </Tooltip>
                  ))}
                </div>
              </Z4RadioCard>
            </div>
            {watchExternalDaType == "OffChainDataAvailability" ? (
              <FormField
                helper={{
                  status: "error",
                  text: errors.externalDA?.offChainPartner?.message?.toString(),
                }}
              >
                <div className="flex flex-row items-center gap-1 pb-4">
                  <Heading as="h6" className="text-brand-cyan">
                    OFF Chain External DA
                  </Heading>
                  <Tooltip text="Select partner for your OFF Chain External DA." placement="top-start">
                    <IconButton variant="text" colorScheme="gray">
                      <IconInfoCircle className="text-base" />
                    </IconButton>
                  </Tooltip>
                </div>
                <div className="grid grid-cols-12 gap-3 lg:gap-6">
                  {externalDaPartners.map((partner, index) => (
                    <Z4RadioCard
                      key={index}
                      value={partner}
                      className="col-span-12 lg:col-span-3"
                      {...register("externalDA.offChainPartner")}
                      isDisabled={isDemo}
                      isChecked={watch("externalDA.offChainPartner") == partner}
                    >
                      <div className="flex flex-row items-center gap-3">
                        <Image src={withBasePath(getPartnerIconPath(partner))} alt={partner} width={28} height={28} />
                        {partner === "0g" ? "0G Labs" : toCapitalize(partner)}
                      </div>
                    </Z4RadioCard>
                  ))}
                </div>
              </FormField>
            ) : null}
          </Card>
          {/* Select Native Gas Token Section */}
          {watchExternalDaType == "LocalDA" ? (
            <Card className="flex flex-col gap-3 rounded-xl border border-brand-outline p-3 shadow-xl lg:gap-6 lg:p-6">
              <FormField
                helper={{
                  status: "error",
                  text: errors.externalDA?.NativeGasToken?.message?.toString(),
                }}
              >
                <div className="flex flex-row items-center gap-1 pb-4">
                  <Heading as="h5">Native Gas Token</Heading>
                  <Tooltip
                    text="The native gas token is the fundamental currency used to pay for execution costs (gas fees) on a blockchain or rollup network."
                    placement="top-start"
                  >
                    <IconButton variant="text" colorScheme="gray">
                      <IconInfoCircle className="text-base" />
                    </IconButton>
                  </Tooltip>
                </div>
                <div className="grid grid-cols-12 gap-3 lg:gap-6">
                  <Z4RadioCard
                    value="ETH"
                    className="col-span-12 lg:col-span-6"
                    {...register("externalDA.NativeGasToken")}
                    isChecked={watch("externalDA.NativeGasToken") == "ETH"}
                    isDisabled={isDemo}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full border border-brand-light bg-white p-1.5 font-medium">
                        <Image
                          src={withBasePath(getPartnerIconPath("ethereum"))}
                          alt="Ethereum Logo"
                          width={28}
                          height={28}
                        />
                      </div>
                      ETH
                    </div>
                  </Z4RadioCard>
                  <Z4RadioCard
                    value="Custom"
                    className="col-span-12 lg:col-span-6"
                    {...register("externalDA.NativeGasToken")}
                    isChecked={watch("externalDA.NativeGasToken") == "Custom"}
                    isDisabled={isDemo}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <Image
                        src={withBasePath(getPartnerIconPath("custom"))}
                        alt="Custom Logo"
                        width={26}
                        height={26}
                        className="size-7"
                      />
                      Custom
                    </div>
                  </Z4RadioCard>
                </div>
              </FormField>
              {/* Custom Native Gas Token Fields*/}
              {watchNativeGasToken == "Custom" ? (
                <div className="grid grid-cols-12 gap-3 lg:gap-6">
                  <FormField
                    className="col-span-12 lg:col-span-4"
                    helper={{
                      status: "error",
                      text: errors.externalDA?.tokenName?.message?.toString(),
                    }}
                  >
                    <span className="mb-1 text-sm font-medium text-[#09122D]">Token Name</span>
                    <Input
                      className="rounded-md bg-white"
                      type="text"
                      size={"small"}
                      {...register("externalDA.tokenName")}
                      isRequired={watchNativeGasToken == "Custom" && watchExternalDaType == "LocalDA"}
                      floatingLabel={{
                        labelText: "Token Name",
                        floatingLabelProps: {
                          className: "!text-sm",
                        },
                      }}
                      placeholder="Token Name"
                      isDisabled={isDemo}
                    />
                  </FormField>
                  <FormField
                    className="col-span-12 lg:col-span-4"
                    helper={{
                      status: "error",
                      text: errors.externalDA?.tokenSymbol?.message?.toString(),
                    }}
                  >
                    <span className="mb-1 text-sm font-medium text-[#09122D]">Token Symbol</span>
                    <Input
                      type="text"
                      className="rounded-md bg-white"
                      size={"small"}
                      {...register("externalDA.tokenSymbol")}
                      isRequired={watchNativeGasToken == "Custom" && watchExternalDaType == "LocalDA"}
                      floatingLabel={{
                        labelText: "Token Symbol",
                        floatingLabelProps: {
                          className: "!text-sm",
                        },
                      }}
                      isDisabled={isDemo}
                      placeholder="Token Symbol"
                    />
                  </FormField>
                  <FormField
                    className="col-span-12 lg:col-span-4"
                    helper={{
                      status: "error",
                      text: errors.externalDA?.premineAmount?.message?.toString(),
                    }}
                  >
                    <span className="mb-1 text-sm font-medium text-[#09122D]">Premine Amount</span>
                    <Input
                      type="number"
                      className="rounded-md bg-white"
                      size={"small"}
                      {...register("externalDA.premineAmount")}
                      min={0}
                      floatingLabel={{
                        labelText: "Premine Amount",
                        floatingLabelProps: {
                          className: "!text-sm",
                        },
                      }}
                      isDisabled={isDemo}
                      isRequired={watchNativeGasToken == "Custom" && watchExternalDaType == "LocalDA"}
                    />
                  </FormField>
                  <FormField
                    className="col-span-12 lg:col-span-4"
                    helper={{
                      status: "error",
                      text: errors.externalDA?.premineAddress?.message?.toString(),
                    }}
                  >
                    <span className="mb-1 text-sm font-medium text-[#09122D]">Premine Address</span>
                    <Input
                      type="text"
                      className="rounded-md bg-white"
                      size={"small"}
                      {...register("externalDA.premineAddress")}
                      isRequired={watchNativeGasToken == "Custom" && watchExternalDaType == "LocalDA"}
                      floatingLabel={{
                        labelText: "Premine Address",
                        floatingLabelProps: {
                          className: "!text-sm",
                        },
                      }}
                      isDisabled={isDemo}
                      placeholder="Premine Address"
                    />
                  </FormField>
                </div>
              ) : null}
            </Card>
          ) : null}
          {/* Select Sequencer Section */}
          <Card className="flex flex-col gap-3 rounded-xl border border-brand-outline p-3 shadow-xl    lg:gap-6 lg:p-6">
            <div className="flex flex-row items-center gap-1">
              <Heading as="h5">Sequencer</Heading>
              <Tooltip
                text="Sequencer is responsible for organizing and processing transactions by aggregating them into batches and submitting them to the L1/L2 chain, ensuring efficient and scalable transaction processing."
                placement="top-start"
              >
                <IconButton variant="text" colorScheme="gray">
                  <IconInfoCircle className="text-base" />
                </IconButton>
              </Tooltip>
            </div>
            <div className="grid grid-cols-12 gap-3 lg:gap-6">
              <Z4RadioCard
                value="Centralized"
                className="col-span-12 lg:col-span-6"
                {...register("sequencer.sequencerType")}
                isDisabled={isDemo}
                isChecked={watch("sequencer.sequencerType") === "Centralized"}
              >
                Centralized
              </Z4RadioCard>
              <Z4RadioCard
                value="DeCentralized"
                className="col-span-12 lg:col-span-6"
                {...register("sequencer.sequencerType")}
                isDisabled
                isChecked={watch("sequencer.sequencerType") === "DeCentralized"}
              >
                <div className="flex items-center gap-2">
                  <span>De-Centralized</span>
                  <div className="flex items-center gap-1 opacity-80">
                    {comingSoonSequencers.map((s, idx) => (
                      <Tooltip
                        key={`${String(s?.id ?? s?.name)}-${idx}`}
                        text={String(s?.name ?? "")}
                        placement="top-start"
                      >
                        <span className="inline-flex items-center justify-center rounded">
                          <Image
                            src={s?.logo_url || withBasePath(getPartnerIconPath("custom"))}
                            alt={String(s?.name ?? "")}
                            width={18}
                            height={18}
                            unoptimized
                            style={{ objectFit: "contain", borderRadius: 4 }}
                          />
                        </span>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </Z4RadioCard>
            </div>
            {watchSequencerType == "DeCentralized" ? (
              <FormField
                helper={{
                  status: "error",
                  text: errors.sequencer?.deCentralizedPartner?.message?.toString(),
                }}
              >
                <div className="flex flex-row items-center gap-1 pb-4">
                  <Heading as="h6" className="text-brand-cyan">
                    De-Centralized Sequencer
                  </Heading>
                  <Tooltip text="Select partner for your De-Centralized Sequencer." placement="top-start">
                    <IconButton variant="text" colorScheme="gray">
                      <IconInfoCircle className="text-base" />
                    </IconButton>
                  </Tooltip>
                </div>
                <div className="grid grid-cols-12 gap-3 lg:gap-6">
                  {sequencerPartners.map((partner, index) => (
                    <Z4RadioCard
                      key={index}
                      value={partner}
                      className="col-span-12 lg:col-span-2"
                      {...register("sequencer.deCentralizedPartner")}
                      isDisabled={isDemo}
                      isChecked={watch("sequencer.deCentralizedPartner") == partner}
                    >
                      <div className="flex flex-row items-center gap-3">
                        <Image src={withBasePath(getPartnerIconPath(partner))} alt={partner} width={28} height={28} />
                        {toCapitalize(partner)}
                      </div>
                    </Z4RadioCard>
                  ))}
                </div>
              </FormField>
            ) : null}
          </Card>
          {/* Select integrations Section */}
          {/* <Card className="flex flex-col gap-3 rounded-xl border border-brand-outline p-0 shadow-xl  lg:gap-6 lg:p-0">
            <div className="flex flex-row items-center gap-1 p-3 pb-0 lg:p-6 lg:pb-0">
              <Heading as="h5">Integrations</Heading>
              <Tooltip text="Select integrations to include within your rollup." placement="top-start">
                <IconButton variant="text" colorScheme="gray">
                  <IconInfoCircle className="text-base" />
                </IconButton>
              </Tooltip>
            </div>
            <div className="grid grid-cols-12 gap-3 p-3 text-sm lg:gap-6 lg:px-6">
              <IntegrationItemCard
                className="col-span-12 !border-brand-blue lg:col-span-6"
                text="Bridge"
                icon={<IconChevronSwapLeftRight width={iconSize} height={iconSize} className=" text-brand-cyan" />}
                description="A bridge in blockchain acts like a gateway connecting different, isolated blockchain networks."
                partners={["superbridge"]}
                isDisabled
                isChecked={watch("integrations.bridge")}
                {...register("integrations.bridge")}
              />
              <IntegrationItemCard
                className="col-span-12 !border-brand-blue lg:col-span-6"
                text="RPC"
                icon={<IconHex width={iconSize} height={iconSize} className=" text-brand-cyan" />}
                description="Remote Procedure Call (RPC) refers to a communication protocol that allows applications to interact with a blockchain network."
                isDisabled
                partners={["rpc"]}
                isChecked={watch("integrations.rpc")}
                {...register("integrations.rpc")}
              />
              <IntegrationItemCard
                className="col-span-12 !border-brand-blue lg:col-span-6"
                text="Block Explorer"
                icon={<IconGlobal width={iconSize} height={iconSize} className=" text-brand-cyan" />}
                description="Blockexplorer serves as a vital tool for interacting with and examining data within a blockchain network."
                isDisabled
                partners={["tracehawk"]}
                isChecked={watch("integrations.blockExplorer")}
                {...register("integrations.blockExplorer")}
              />
              {watchNativeGasToken == "Custom" && (
                <IntegrationItemCard
                  className="col-span-12 lg:col-span-6"
                  text="Faucet"
                  icon={<IconWallet1 width={iconSize} height={iconSize} className=" text-brand-cyan" />}
                  description="A faucet is a service that provides free cryptocurrency to users, typically in small amounts, to help them test and interact with the blockchain network."
                  isDisabled
                  isChecked={watch("integrations.faucet")}
                  {...register("integrations.faucet")}
                />
              )}
            </div>
            <Z4Accordion className="col-span-12 rounded-none">
              <Z4AccordionItem>
                <div className="overflow-hidden">
                  <Z4AccordionHeader
                    iconExpanded={<IconArrow1Up />}
                    iconCollapsed={<IconArrow1Down />}
                    className="bg-[#E0E5F7]"
                    variant={"text"}
                  >
                    Third Party Integrations
                  </Z4AccordionHeader>
                </div>
                <Z4AccordionBody className="bg-[#E0E5F7]">
                  <div className="grid grid-cols-12 gap-3 p-3 text-sm lg:gap-6 lg:px-6">
                    <IntegrationItemCard
                      className="col-span-12 lg:col-span-6"
                      text="Decentralized Oracles"
                      icon={<IconSecurityKey width={iconSize} height={iconSize} className=" text-brand-cyan" />}
                      isDisabled
                      description="Decentralized oracles bridge external data to smart contracts, facilitating interaction with real-world events."
                      partners={["chainlink", "pyth"]}
                      isChecked={watch("integrations.deCentalizedOracles")}
                      {...register("integrations.deCentalizedOracles")}
                    />
                    <IntegrationItemCard
                      className="col-span-12 lg:col-span-6"
                      text="Other Block Explorers"
                      icon={<IconGlobal width={iconSize} height={iconSize} className=" text-brand-cyan" />}
                      isDisabled
                      description="Blockexplorer serves as a vital tool for interacting with and examining data within a blockchain network."
                      partners={["blockscout", "chainlens"]}
                      isChecked={watch("integrations.otherBlockExplorer")}
                      {...register("integrations.otherBlockExplorer")}
                    />
                    <IntegrationItemCard
                      className="col-span-12 lg:col-span-6"
                      text="Decentralized Storage"
                      icon={<IconStorageLocker width={iconSize} height={iconSize} className=" text-brand-cyan" />}
                      isDisabled
                      description="Decentralized storage stores and replicates data across a network of computers instead of a single centralized server."
                      partners={["arweave", "filecoin", "ipfs"]}
                      isChecked={watch("integrations.deCentalizedStorage")}
                      {...register("integrations.deCentalizedStorage")}
                    />
                    <IntegrationItemCard
                      className="col-span-12 lg:col-span-6"
                      text="MPC Wallets"
                      icon={<IconWallet2 width={iconSize} height={iconSize} className=" text-brand-cyan" />}
                      isDisabled
                      isChecked={watch("integrations.mpcWallets")}
                      description="New crypto wallets use MPC tech for heightened security by distributing private keys."
                      {...register("integrations.mpcWallets")}
                    />
                    <IntegrationItemCard
                      className="col-span-12 lg:col-span-6"
                      text="ON/OFF Ramps"
                      icon={
                        <IconArrowDoubleRotateRight width={iconSize} height={iconSize} className=" text-brand-cyan" />
                      }
                      isDisabled
                      isChecked={watch("integrations.onOffRamps")}
                      description="Entering the crypto world via fiat-to-crypto on-ramp and exiting it through crypto-to-fiat off-ramp."
                      {...register("integrations.onOffRamps")}
                    />
                    <IntegrationItemCard
                      className="col-span-12 lg:col-span-6"
                      text="WEB3 Functions"
                      icon={<IconSun2 width={iconSize} height={iconSize} className=" text-brand-cyan" />}
                      isDisabled
                      description="Comprehensive automation solution supporting both on & off-chain data."
                      isChecked={watch("integrations.web3Functions")}
                      {...register("integrations.web3Functions")}
                    />
                    <IntegrationItemCard
                      className="col-span-12 lg:col-span-6"
                      text="Developer Tools"
                      icon={<IconGlobalEdit width={iconSize} height={iconSize} className=" text-brand-cyan" />}
                      isDisabled
                      description="Onboard users with wallets, build & deploy smart contracts, accept fiat with payments, and scale apps with infrastructure on any EVM chain."
                      partners={["thirdweb"]}
                      isChecked={watch("integrations.developerTools")}
                      {...register("integrations.developerTools")}
                    />
                  </div>
                </Z4AccordionBody>
              </Z4AccordionItem>
            </Z4Accordion>
          </Card> */}

          {/* Deploy button */}
          {/* <div className="grid grid-cols-12 gap-3 lg:gap-6">
            <Button
              type="submit"
              variant="solid"
              colorScheme="primary"
              className="col-span-12 text-base md:col-span-2 md:col-start-11"
              iconLeft={<IconPlusSquare className="text-xl" />}
              isDisabled={!isValid}
              isLoading={isSubmitting}
            >
              DEPLOY
            </Button>
          </div> */}
        </div>
        <div className="col-span-12 flex h-min gap-3 rounded-xl border xl:col-span-4">
          <DeploySummary
            isValid={isValid}
            isSubmitting={isSubmitting}
            formState={watch()}
            demoNetworkId={demoNetworkId}
          />
        </div>
      </form>
    </div>
  );
};
export type { DeployNetworkSchemaType };
export default DeployPageClient;
