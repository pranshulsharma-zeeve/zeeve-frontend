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
import { WithdrawRewardsSchemaType, withdrawRewardsValidationSchema } from "./schema/withdraw-rewards-schema";
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

const WithdrawRewardsModal = () => {
  const [isLoading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { isOpen, onClose, type, data } = useModalStore();
  const toast = useToast();
  const router = useRouter();
  const isModalOpen = isOpen && type === "withdrawRewards";
  const [selectedWallet, setSelectedWallet] = useState<"cosmostation" | "keplr" | "leap">("keplr");

  const { withdrawRewards, initializeKeplr } = useKeplr(
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
    formState: { errors, isValid },
  } = useForm<WithdrawRewardsSchemaType>({
    resolver: yupResolver(withdrawRewardsValidationSchema),
    mode: "all",
    defaultValues: {
      wallet: "keplr",
      rewardsOnly: false,
    },
  });

  const onSubmit = async (formData: WithdrawRewardsSchemaType) => {
    try {
      console.log("inside on submit of withdrawRewards");
      setIsSubmitting(true);
      // Initialize Keplr only when Update button is clicked
      await initializeKeplr();
      const response = await withdrawRewards(
        data.cosmosSettingsModals?.validatorAddress as string,
        formData.rewardsOnly,
      );
      if (response) {
        // setComponentError(undefined);
        // setComponentSuccess(`Successfully Unbounded the token!`);
        await saveTxnHash({ txhash: response, method: "withdraw-reward" });
        console.log("response is saved", response);
        // toggleSuccessResponse(true);

        toast("", {
          status: "success",
          message: "Successfully withdrew the rewards!",
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
          <div className="flex w-full justify-between gap-x-12">
            <ModalTitle className="text-2xl">Withdraw Rewards and Commission</ModalTitle>
            <Button
              variant={"text"}
              onClick={() => {
                reset();
                onClose();
              }}
              className="size-fit p-0"
              iconLeft={<IconXMarkSquare className="size-8" />}
            />
          </div>
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-y-10">
            <div className="flex flex-col gap-y-8">
              <div className="flex w-fit items-center">
                <Input
                  type="checkbox"
                  {...register("rewardsOnly")}
                  className="!h-6 !w-6 p-0"
                  // floatingLabel={{ labelText: "utectcore" }}
                />
                <span className="ml-2 whitespace-nowrap text-sm font-normal text-[#696969]">Rewards Only</span>
              </div>
              <div className="flex gap-x-6">
                {/* <FormField
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                  helper={{ status: "error", text: errors.amount?.message?.toString() }}
                >
                  <Heading as="h6" className="font-medium">
                    Amount
                  </Heading>
                  <Input
                    {...register("amount")}
                    placeholder="Enter Amount"
                    // floatingLabel={{ labelText: "utectcore" }}
                  />
                </FormField> */}
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
              Withdraw
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WithdrawRewardsModal;
