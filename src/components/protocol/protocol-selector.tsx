import React, { useEffect, useState, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Card, Heading, IconButton, Tooltip, useToast } from "@zeeve-platform/ui";
import { IconInfoCircle } from "@zeeve-platform/icons/essential/outline";
import { RadioCard } from "@zeeve-platform/ui-common-components";
import axios, { AxiosError } from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconConnectCircle, IconConnectSquare } from "@zeeve-platform/icons/grid/outline";
import RadioItemCard from "./radio-item-card";
import {
  PurchaseFormSchemaType,
  purchaseFormValidationSchema,
} from "@/components/protocol/_schema/purchase-form-schema";
import SubscriptionCost from "@/components/protocol/subscription/subscription-cost";
import { ProtocolSelectionResponseData } from "@/services/platform/protocol/protocol-selection";
import { ProtocolSubscriptionRequestPayload } from "@/services/platform/protocol/subscribe";
import { kebabToTitleCase } from "@/utils/helpers";
import { redirectToStripeUrl } from "@/utils/redirects";
import usePlatformService from "@/services/platform/use-platform-service";
import { PlatformServiceError } from "@/services/platform/types";
import HTTP_STATUS from "@/constants/http";
import { NetworkType, NodeType } from "@/types/protocol";

interface ProtocolSelectorProps {
  data: ProtocolSelectionResponseData;
  isLoading: boolean;
}

const ProtocolForm = ({ data, isLoading }: ProtocolSelectorProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const toast = useToast();
  const path = window.location.pathname;
  const isFullNode = path.includes("full");

  // Memoize networkTypes and regions
  const networkTypes = useMemo(() => data?.networkType || { full: [], validator: [] }, [data?.networkType]);
  const regions = useMemo(() => data?.regions || {}, [data?.regions]);

  // Memoize filtered network types and default values
  const filteredNetworkTypes = useMemo(() => {
    return isFullNode
      ? (networkTypes?.full || []).filter((networkType) => networkType.enabled)
      : (networkTypes?.validator || []).filter((networkType) => networkType.enabled);
  }, [isFullNode, networkTypes]);

  // const defaultRegion = useMemo(() => Object.keys(regions)[0] || "", [regions]);

  const methods = useForm<PurchaseFormSchemaType>({
    resolver: yupResolver(purchaseFormValidationSchema),
    mode: "all",
    defaultValues: {
      networkType: "mainnet",
      nodeType: `${isFullNode ? "full" : "validator"}`,
      cloud: "managed",
      node: {
        count: 1,
      },
      continent: "north-america",
    },
  });

  const { register, handleSubmit, watch, reset, setValue } = methods;
  // const watchRegionId = watch("region.id");
  const watchContinent = watch("continent");
  const watchNetworkType = watch("networkType");

  const { url: createProtocolSubscriptionUrl, request: createProtocolSubscriptionRequest } =
    usePlatformService().protocol.subscribe(data?.protocolId as string);
  const handleStripeRedirect = (url: string) => {
    if (redirectToStripeUrl(url)) {
      return true;
    }
    toast("", { status: "error", message: "Invalid payment link. Please contact support." });
    return false;
  };

  const onSubmit = async (formData: PurchaseFormSchemaType) => {
    const selectedRegionId = regions[formData.continent]?.[0]?.id;
    const selectedRegion = Object.values(regions)
      .flat()
      .find((region) => region.id === selectedRegionId);
    const regionName = selectedRegion ? selectedRegion.name : "";

    const body: ProtocolSubscriptionRequestPayload = {
      cloud: formData.cloud,
      nodeType: formData.nodeType as NodeType,
      networkType: formData.networkType as NetworkType,
      regionId: selectedRegionId,
      regionName: regionName,
      count: formData.node.count,
      continent: formData.continent,
    };

    try {
      setIsSubmitting(true);
      const response = await createProtocolSubscriptionRequest(createProtocolSubscriptionUrl, body);
      if (response.status === HTTP_STATUS.OK && response.data) {
        handleStripeRedirect(response.data.redirectionUrl);
        reset();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<PlatformServiceError>;
        toast("", {
          status: "error",
          message: err.response?.data?.message,
        });
      } else {
        toast("An unexpected error occurred", {
          status: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (regions && !selectedRegion) {
      const defaultRegionKey = Object.keys(regions)[0];
      setSelectedRegion(defaultRegionKey);
      setValue("continent", defaultRegionKey);
      // const defaultRegion = regions[defaultRegionKey]?.[0];
      // if (defaultRegion) {
      //   setValue("region.id", defaultRegion.id);
      //   setValue("region.name", defaultRegion.name);
      // }
    }
  }, [regions, selectedRegion, setValue]);

  const handleContinentChange = (continentKey: string) => {
    setSelectedRegion(continentKey);
    setValue("continent", continentKey);
    // const firstRegion = regions[continentKey]?.[0];
    // if (firstRegion) {
    //   setValue("region.id", firstRegion.id);
    //   setValue("region.name", firstRegion.name);
    // }
  };

  return (
    <>
      {!isLoading && (
        <Card className="min-h-[36.5rem]">
          <FormProvider {...methods}>
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-12 gap-3 p-1 lg:gap-6">
                {/* left grid section */}
                <div className="col-span-12 gap-3 lg:col-span-8 lg:gap-6">
                  <div className="flex flex-col gap-3 bg-white lg:gap-6">
                    {data?.networkType && (
                      <div className="flex flex-col gap-3 lg:gap-6">
                        <div className="flex flex-row items-center gap-1">
                          <Heading as="h5">Select Network</Heading>
                          <Tooltip text="Select the network type." placement="top-start">
                            <IconButton variant="text" colorScheme="gray">
                              <IconInfoCircle className="text-base" />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div className="grid grid-cols-12 gap-3 lg:gap-6">
                          {filteredNetworkTypes?.map((networkType, index) => (
                            <div key={index} className="col-span-12 md:col-span-6 lg:col-span-6">
                              <RadioItemCard
                                value={networkType.name}
                                isChecked={networkType.name === watchNetworkType}
                                isDisabled={!networkType.enabled}
                                {...register("networkType")}
                                text={networkType.name}
                                icon={
                                  networkType.type === "mainnet" ? (
                                    <IconConnectCircle className="text-2xl text-brand-cyan" />
                                  ) : (
                                    <IconConnectSquare className="text-2xl text-brand-cyan" />
                                  )
                                }
                                description="This is the Description for Network Selection from mainnet and testnet"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {data?.regions && (
                      <div className="flex flex-col gap-3 lg:gap-6">
                        <div className="flex flex-row items-center gap-1">
                          <Heading as="h5">Select Server Location</Heading>
                          <Tooltip text="Select your server location" placement="top-start">
                            <IconButton variant="text" colorScheme="gray">
                              <IconInfoCircle className="text-base" />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div className="grid grid-cols-12 gap-3 lg:gap-6">
                          {Object.keys(regions).map((regionKey, index) => (
                            <RadioCard
                              key={index}
                              {...register("continent")}
                              value={regionKey}
                              onChange={() => handleContinentChange(regionKey)}
                              className="col-span-12 capitalize md:col-span-4"
                              isChecked={watchContinent === regionKey}
                            >
                              {kebabToTitleCase(regionKey)}
                            </RadioCard>
                          ))}
                        </div>
                        {/* {selectedRegion && (
                          <>
                            <div className="flex flex-row items-center gap-1">
                              <Heading as="h6" className="text-brand-cyan">
                                Select Region - {capitalizeFirstLetter(selectedRegion)}
                              </Heading>
                              <Tooltip text="Select region on the basis of server location." placement="top-start">
                                <IconButton variant="text" colorScheme="gray">
                                  <IconInfoCircle className="text-base" />
                                </IconButton>
                              </Tooltip>
                            </div>
                            <div className="grid grid-cols-12 gap-2 lg:gap-6">
                              {regions[selectedRegion]?.map((region, index) => (
                                <RadioCard
                                  key={index}
                                  value={region.id}
                                  size="small"
                                  className="col-span-12 h-12 capitalize md:col-span-3"
                                  isChecked={watchRegionId === (region.id as string)}
                                  {...register("region.id")}
                                >
                                  {region.name}
                                </RadioCard>
                              ))}
                            </div>
                          </>
                        )} */}
                      </div>
                    )}
                  </div>
                </div>
                {/* right grid section */}
                <div className="col-span-12 gap-3 lg:col-span-4 lg:gap-6">
                  <SubscriptionCost data={data} isSubmitting={isSubmitting} />
                </div>
              </div>
            </form>
          </FormProvider>
        </Card>
      )}
    </>
  );
};

export default ProtocolForm;
