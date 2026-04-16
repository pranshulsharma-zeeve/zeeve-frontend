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
} from "@zeeve-platform/ui";
import axios, { AxiosError } from "axios";
import { IconXMarkSquare } from "@zeeve-platform/icons/essential/outline";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormField, ReactSelect } from "@zeeve-platform/ui-common-components";
import { UnjailSchemaType, unjailValidationSchema } from "./schema/unjail-schema";
import { useModalStore } from "@/store/modal";
import { PlatformServiceError } from "@/services/platform/types";
import { OptionType } from "@/types/react-select";
import { useKeplr } from "@/hooks/use-keplr";
import { useSaveTxn } from "@/hooks/save-txn";

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

const UnjailModal = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { isOpen, onClose, type, data } = useModalStore();
  const toast = useToast();
  const isModalOpen = isOpen && type === "unjail";
  const [selectedWallet, setSelectedWallet] = useState<"cosmostation" | "keplr" | "leap">("keplr");

  const { unjail, initializeKeplr } = useKeplr(
    data.cosmosSettingsModals?.networkType as string,
    selectedWallet,
    data.cosmosSettingsModals?.delegationAddress as string,
  );

  const { saveTxnHash } = useSaveTxn(data.cosmosSettingsModals?.nodeId as string);

  const {
    register,
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { isValid },
  } = useForm<UnjailSchemaType>({
    resolver: yupResolver(unjailValidationSchema),
    mode: "all",
    defaultValues: {
      wallet: "keplr",
    },
  });

  const onSubmit = async () => {
    try {
      console.log("inside on submit of unjail");
      setIsSubmitting(true);
      // Initialize Keplr only when Update button is clicked
      await initializeKeplr();
      const response = await unjail(data.cosmosSettingsModals?.validatorAddress as string);
      if (response) {
        await saveTxnHash({ txhash: response, method: "unjail" });
        console.log("response is saved", response);

        toast("", {
          status: "success",
          message: "Successfully unjailed validator!",
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
        <ModalBody className="flex flex-col justify-between md:w-[500px]">
          <div className="flex w-full justify-between gap-x-12">
            <ModalTitle className="text-2xl">Unjail Validator</ModalTitle>
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
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-y-10">
            <div className="flex flex-col gap-y-8">
              <div className="flex gap-x-6">
                <FormField className="w-full">
                  <Heading as="h6" className="font-medium">
                    Select Your Wallet
                  </Heading>
                  <Controller
                    name="wallet"
                    control={control}
                    render={({ field }) => (
                      <ReactSelect
                        className="w-full"
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
            </div>
            <Button type="submit" isLoading={isSubmitting} isDisabled={!isValid} className="w-full rounded-[4px]">
              Unjail
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UnjailModal;
