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
  Badge,
} from "@zeeve-platform/ui";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { IconInfoSquare, IconXMarkSquare } from "@zeeve-platform/icons/essential/outline";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormField, ReactSelect } from "@zeeve-platform/ui-common-components";
import * as yup from "yup";
import { getSetRewardsValidationSchema } from "./schema/set-rewards-schema";
import { useModalStore } from "@/store/modal";
import { PlatformServiceError } from "@/services/platform/types";
import { OptionType } from "@/types/react-select";
import { useKeplr } from "@/hooks/use-keplr";
import { useSaveTxn } from "@/hooks/save-txn";
import { getExplorerUrl } from "@/utils/helpers";

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

const SetRewardsModal = () => {
  const [isLoading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { isOpen, onClose, type, data } = useModalStore();
  const toast = useToast();
  const router = useRouter();
  const isModalOpen = isOpen && type === "setRewards";
  const [selectedWallet, setSelectedWallet] = useState<"cosmostation" | "keplr" | "leap">("keplr");

  const { setRewardWallet, initializeKeplr } = useKeplr(
    data.cosmosSettingsModals?.networkType as string,
    selectedWallet,
    data.cosmosSettingsModals?.delegationAddress as string,
  );

  const { saveTxnHash } = useSaveTxn(data.cosmosSettingsModals?.nodeId as string);
  const networkType = data.cosmosSettingsModals?.networkType ?? "";
  const prefix = getExplorerUrl(networkType.toLowerCase()).notation.toLowerCase();

  const setRewardsValidationSchema = getSetRewardsValidationSchema(prefix);
  type SetRewardsSchemaType = yup.InferType<typeof setRewardsValidationSchema>;

  const {
    register,
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SetRewardsSchemaType>({
    resolver: yupResolver(setRewardsValidationSchema),
    mode: "all",
    defaultValues: {
      wallet: "keplr",
    },
  });

  const onSubmit = async (formData: SetRewardsSchemaType) => {
    try {
      console.log("inside on submit of setRewardWallet");
      setIsSubmitting(true);
      // Initialize Keplr only when Update button is clicked
      await initializeKeplr();
      const response = await setRewardWallet(formData.address);
      if (response) {
        // setComponentError(undefined);
        // setComponentSuccess(`Successfully Unbounded the token!`);
        await saveTxnHash({ txhash: response, method: "withdraw-reward-to-address" });
        console.log("response is saved", response);
        // toggleSuccessResponse(true);
        toast("", {
          status: "success",
          message: "Successfully changed the reward wallet!",
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
            <ModalTitle className="text-2xl">Change Reward Wallet</ModalTitle>
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
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="flex flex-col gap-y-6">
              <FormField helper={{ status: "error", text: errors.address?.message?.toString() }}>
                <Heading as="h6" className="font-medium">
                  Address
                </Heading>
                <Input
                  {...register("address")}
                  placeholder="Enter Address"
                  className="w-fit sm:w-[500px]"
                  // floatingLabel={{ labelText: "utectcore" }}
                />
              </FormField>
              <FormField>
                <Heading as="h6" className="font-medium">
                  Select Your Wallet
                </Heading>
                <Controller
                  name="wallet"
                  control={control}
                  render={({ field }) => (
                    <ReactSelect
                      className="w-[350px] sm:w-[500px]"
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
            <Badge className="mt-6 flex w-[350px] items-start gap-x-2 border-[#DBA800] bg-[#DBA80033] p-4 text-sm font-normal text-[#DBA800] sm:w-[500px]">
              <IconInfoSquare className="size-12 h-fit" />
              <span>
                <span className="font-semibold">Note: </span>
                Claim rewards to a seperate cold wallet. Just make sure that you have the mnemonics saved for both the
                wallets.
              </span>
            </Badge>
            <Button
              type="submit"
              isLoading={isSubmitting}
              isDisabled={!isValid}
              className="mt-6 w-[350px] rounded-[4px] sm:w-full"
            >
              Set
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SetRewardsModal;
