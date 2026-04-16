"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  ModalTitle,
  useToast,
  Heading,
  Input,
  IconButton,
  CopyButton,
} from "@zeeve-platform/ui";
import axios, { AxiosError } from "axios";
import { IconXMarkSquare } from "@zeeve-platform/icons/essential/outline";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormField, ReactSelect } from "@zeeve-platform/ui-common-components";
import { EnableRestakeSchemaType, enableRestakeValidationSchema } from "./schema/enable-restake-schema";
import { useModalStore } from "@/store/modal";
import usePlatformService from "@/services/platform/use-platform-service";
import { CoreumServiceError } from "@/services/platform/types";
import HTTP_STATUS from "@/constants/http";
import { EnableRestakeRequestPayload } from "@/services/vizion/enable-restake";
import { NetworkType } from "@/types/common";
import { getAddressBalanceApi } from "@/utils/helpers";
import { useVisionUserStore } from "@/store/vizionUser";

export const intervals: {
  label: string;
  value: number;
}[] = [
  {
    label: "1",
    value: 1,
  },
  {
    label: "3",
    value: 3,
  },
  {
    label: "6",
    value: 6,
  },
  {
    label: "12",
    value: 12,
  },
  {
    label: "24",
    value: 24,
  },
];

const getDenom = (network: NetworkType): "utestcore" | "ucore" => {
  return network === "testnet" ? "utestcore" : "ucore";
};

const convertUnitToMicro = (amount: number): number => Math.round(amount * 1e6);

// check address balance if it is more than 1 core
const checkBalance = async (network?: NetworkType, address?: string): Promise<boolean | undefined> => {
  if (!network || !address) {
    throw new Error("Restake wallet address or Network type missing");
  }
  const balance = await getAddressBalanceApi(network, address);
  for (const e of balance.balances) {
    if (e.denom === getDenom(network)) {
      if (parseFloat(e.amount) < 10 * 6) {
        return false;
      }
      return true;
    }
  }
  return undefined;
};

const EnableRestakeModal = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { isOpen, onClose, type, data } = useModalStore();
  const vizionUser = useVisionUserStore((state) => state.visionUser);
  const toast = useToast();
  const isModalOpen = isOpen && type === "enableRestake";

  const {
    register,
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EnableRestakeSchemaType>({
    resolver: yupResolver(enableRestakeValidationSchema),
    mode: "all",
    defaultValues: {
      interval: 1,
    },
  });

  const { url: enableRestakeUrl, request: enableRestakeRequest } = usePlatformService().vizion.enableRestake(
    data.cosmosSettingsModals?.nodeId as string,
  );

  const onSubmit = async (formData: EnableRestakeSchemaType) => {
    const payload: EnableRestakeRequestPayload = {
      hostId:
        vizionUser?.hostData.find((item) => item.networkId === data.cosmosSettingsModals?.nodeId)?.hostIds[0] ?? "",
      interval: formData.interval,
      minimumReward: convertUnitToMicro(formData.amount),
    };
    try {
      console.log("inside on submit of enableRestake");
      setIsSubmitting(true);
      const isEnoughBalance =
        data.cosmosSettingsModals?.botBalance.amount &&
        parseFloat(data.cosmosSettingsModals?.botBalance.amount) >= 10 * 6;
      if (!isEnoughBalance) {
        toast(
          `Balance is less than 1 ${data.cosmosSettingsModals?.networkType === "testnet" ? "testcore" : "core"}, restake might fail`,
          {
            status: "error",
            // message: err.message,
            duration: 6000,
          },
        );
        return;
      }
      const response = await enableRestakeRequest(enableRestakeUrl, payload);
      if (response.status === HTTP_STATUS.OK && response.data?.success) {
        toast("", {
          status: "success",
          message: "Successfully enabled restake!",
        });
        reset();
        window.location.reload();
        onClose();
      } else if (response.status === HTTP_STATUS.OK && response.data?.success === false) {
        const apiErrorMessage =
          (response.data as { data?: { error?: string }; message?: string })?.data?.error ||
          (response.data as { message?: string })?.message ||
          "Enable restake failed.";
        toast("Enable restake failed", {
          status: "error",
          message: apiErrorMessage,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(typeof error, error);
        const err = error as AxiosError<CoreumServiceError & { data?: { error?: string }; message?: string }>;
        const responseData = err.response?.data;
        const apiErrorMessage =
          responseData?.data?.error ||
          responseData?.message ||
          responseData?.error?.reason ||
          responseData?.error?.details;
        toast("Enable restake failed", {
          status: "error",
          message: apiErrorMessage || err.message || "Request failed.",
        });
      } else {
        console.log(typeof error, error);
        const err = error as Error;
        toast("An unexpected error occurred", {
          status: "error",
          message: err.message,
        });
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }, 4000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isModalOpen} handleClose={onClose} shouldBackdropDismiss={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody className="flex flex-col justify-between">
          <div className="flex w-full justify-between">
            <ModalTitle className="text-2xl">Enable Restake</ModalTitle>
            <Button
              variant={"text"}
              onClick={() => {
                reset();
                onClose();
              }}
              className="size-fit p-0 focus:ring-0 focus:ring-offset-0"
              iconLeft={<IconXMarkSquare className="size-8" />}
            />
          </div>
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
            <FormField>
              <Heading as="h6" className="font-medium">
                Restake Wallet Address
              </Heading>
              <div className="relative w-[480px]">
                <Input
                  placeholder="Address"
                  className="disabled:opacity-100"
                  isDisabled
                  value={data.cosmosSettingsModals?.botAddress}
                />
                <IconButton className="absolute right-3 top-1/4 size-7 rounded-[4px] border border-brand-gray bg-white lg:size-8">
                  <CopyButton
                    text={data.cosmosSettingsModals?.botAddress ?? ""}
                    className="text-sm text-brand-gray focus:ring-0 focus:ring-offset-0 lg:text-base"
                  />
                </IconButton>
              </div>
            </FormField>
            <FormField helper={{ status: "error", text: errors.amount?.message?.toString() }}>
              <Heading as="h6" className="font-medium">
                Minimum Reward Amount
              </Heading>
              <div className="relative">
                <Input {...register("amount")} placeholder="Enter Amount" className="pr-20" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#696969]">
                  {data.cosmosSettingsModals?.networkType === "testnet" ? "testcore" : "core"}
                </span>
              </div>
            </FormField>
            <FormField helper={{ status: "error", text: errors.interval?.message?.toString() }}>
              <Heading as="h6" className="font-medium">
                Restaking Interval (In Hours)
              </Heading>
              <Controller
                name="interval"
                control={control}
                render={({ field }) => (
                  <ReactSelect
                    className="w-full"
                    {...field}
                    {...register("interval")}
                    isRequired
                    options={intervals}
                    onChange={(selectedOption) => {
                      const option = selectedOption as {
                        label: string;
                        value: number;
                      };
                      setValue("interval", option.value);
                    }}
                    value={intervals.find((interval) => interval.value === field.value)}
                    placeholder="Interval"
                  />
                )}
              />
            </FormField>
            <Button type="submit" isLoading={isSubmitting} isDisabled={!isValid} className="w-full rounded-[4px]">
              Enable Restake
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EnableRestakeModal;
