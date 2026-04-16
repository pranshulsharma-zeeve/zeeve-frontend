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
} from "@zeeve-platform/ui";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { IconXMarkSquare } from "@zeeve-platform/icons/essential/outline";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormField, ReactSelect } from "@zeeve-platform/ui-common-components";
import * as yup from "yup";
import { getValidationSchema } from "./schema/unbound-token-schema";
import { useModalStore } from "@/store/modal";
import { PlatformServiceError } from "@/services/platform/types";
import { OptionType } from "@/types/react-select";
import { useKeplr } from "@/hooks/use-keplr";
import { useSaveTxn } from "@/hooks/save-txn";
import { convertMicroToUnit } from "@/utils/helpers";

export const wallets: {
  label: string;
  value: string;
}[] = [
  {
    label: "Keplr",
    value: "keplr",
  },
  {
    label: "Cosmostation",
    value: "cosmostation",
  },
  {
    label: "Leap",
    value: "leap",
  },
];

const UnboundTokenModal = () => {
  const [isLoading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { isOpen, onClose, type, data } = useModalStore();
  const toast = useToast();
  const router = useRouter();
  const isModalOpen = isOpen && type === "unboundToken";
  const [selectedWallet, setSelectedWallet] = useState<"cosmostation" | "keplr" | "leap">("keplr");

  const { unboundToken, initializeKeplr } = useKeplr(
    data.cosmosSettingsModals?.networkType as string,
    selectedWallet,
    data.cosmosSettingsModals?.delegationAddress as string,
  );
  const { saveTxnHash } = useSaveTxn(data.cosmosSettingsModals?.nodeId as string);

  const delegationBalance = data.cosmosSettingsModals?.validatorPublicDetails?.data?.summary.tokens || 1;
  // const maxAmount = convertMicroToUnit(delegationBalance); // divide delegation balance by 10^6

  const unboundTokenValidationSchema = getValidationSchema(Number(delegationBalance));
  type UnboundTokenSchemaType = yup.InferType<typeof unboundTokenValidationSchema>;

  const {
    register,
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UnboundTokenSchemaType>({
    resolver: yupResolver(unboundTokenValidationSchema),
    mode: "all",
    defaultValues: {
      wallet: "keplr",
    },
  });

  const onSubmit = async (formData: UnboundTokenSchemaType) => {
    try {
      console.log("inside on submit of unbondToken");
      setIsSubmitting(true);
      // Initialize Keplr only when Update button is clicked
      await initializeKeplr();
      console.log(typeof unboundToken);
      const response = await unboundToken(
        data.cosmosSettingsModals?.validatorAddress as string,
        formData.amount ? formData.amount * 1000000 : 0,
      );
      if (response) {
        // setComponentError(undefined);
        // setComponentSuccess(`Successfully Unbounded the token!`);
        await saveTxnHash({ txhash: response, method: "unbound-token" });
        console.log("response is saved", response);
        // toggleSuccessResponse(true);
        toast("", {
          status: "success",
          message: "Successfully unbonded the token!",
        });
        reset();
        window.location.reload();
        onClose();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<PlatformServiceError>;
        toast("Axios Error", {
          status: "error",
          message: err.response?.data?.message,
        });
      } else {
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
        console.log(typeof error, error);
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
            <ModalTitle className="text-2xl">Unbond Tokens</ModalTitle>
            <Button
              variant={"text"}
              onClick={() => {
                reset();
                onClose();
              }}
              className="size-fit p-0 focus:ring-0"
              iconLeft={<IconXMarkSquare className="size-8" />}
            />
          </div>
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-y-6 md:flex-row md:gap-x-6">
              <FormField
                className="col-span-12 md:col-span-6 lg:col-span-4"
                helper={{ status: "error", text: errors.amount?.message?.toString() }}
              >
                <Heading as="h6" className="font-medium">
                  Amount
                </Heading>
                <div className="relative">
                  <Input {...register("amount")} placeholder="Enter Amount" className="pr-20" />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#696969]">
                    {data.cosmosSettingsModals?.networkType === "testnet" ? "testcore" : "core"}
                  </span>
                </div>
              </FormField>
              <FormField className="">
                <Heading as="h6" className="font-medium">
                  Select Your Wallet
                </Heading>
                <Controller
                  name="wallet"
                  control={control}
                  render={({ field }) => (
                    <ReactSelect
                      className="w-52"
                      {...field}
                      {...register("wallet")}
                      isRequired
                      options={wallets}
                      onChange={(selectedOption) => {
                        const option = selectedOption as OptionType;
                        setValue("wallet", option.value);
                        setSelectedWallet(option.value as "cosmostation" | "keplr" | "leap");
                        toast("Wallet changed successfully", {
                          status: "success",
                        });
                      }}
                      value={wallets.find((wallet) => wallet.value === field.value)}
                      placeholder="Wallet"
                    />
                  )}
                />
              </FormField>
            </div>
            <Button type="submit" isLoading={isSubmitting} isDisabled={!isValid} className="w-full rounded-[4px]">
              Unbond Tokens
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UnboundTokenModal;
