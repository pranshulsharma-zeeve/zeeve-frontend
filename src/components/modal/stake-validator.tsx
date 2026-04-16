"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
  Input,
  Label,
  Switch,
  Link,
  IconButton,
} from "@zeeve-platform/ui";
import Image from "next/image";
import { IconXMarkSquare } from "@zeeve-platform/icons/essential/outline";
import { FormField } from "@zeeve-platform/ui-common-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "next/navigation";
import IconInfo from "../icons/info";
import { StakeValidatorSchemaType, stakeValidatorValidationSchema } from "./schema/stake-validator-schema";
import { useModalStore } from "@/store/modal";
import { withBasePath } from "@/utils/helpers";
import { useSaveTxn } from "@/hooks/save-txn";
import { useKeplr } from "@/hooks/use-keplr";
import { TxnMethods } from "@/types/network";
import usePlatformService from "@/services/platform/use-platform-service";

type WalletKey = "keplr" | "cosmostation" | "leap";
const wallets = [
  { name: "Keplr", key: "keplr" as WalletKey, icon: withBasePath(`/assets/images/wallets/keplr-logo.svg`) },
  {
    name: "Cosmostation",
    key: "cosmostation" as WalletKey,
    icon: withBasePath(`/assets/images/wallets/cosmostation-logo.svg`),
  },
  { name: "Leap", key: "leap" as WalletKey, icon: withBasePath(`/assets/images/wallets/leap-logo.svg`) },
];

const StakeValidatorModal = () => {
  const [showSpan, setShowSpan] = useState(false);
  const params = useParams();
  const { isOpen, onClose, type, data } = useModalStore();
  const isModalOpen = isOpen && type === "stakevalidator";
  const toast = useToast();

  const validatorNodeDetails = data?.stakevalidator?.validatorNodeDetails;
  const validatorPublicDetails = data?.stakevalidator?.validatorPublicDetails?.data;
  const nodeId = params.id as string;

  const [selectedWallet, setSelectedWallet] = useState<WalletKey>("keplr");
  const [isLoading, setIsLoading] = useState(false);

  const { saveTxnHash } = useSaveTxn(nodeId as string);
  const { url: stakeValidatorUrl, request: stakeValidatorRequest } = usePlatformService().vizion.stakeValidator();

  // This hook now uses selectedWallet dynamically
  const { createValidator, initializeKeplr } = useKeplr(
    validatorNodeDetails?.data?.network_type as string,
    selectedWallet,
    validatorNodeDetails?.data?.delegation_address as string,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<StakeValidatorSchemaType>({
    resolver: yupResolver(stakeValidatorValidationSchema),
    mode: "all",
  });

  const onSubmit = async (formData: StakeValidatorSchemaType) => {
    try {
      setIsLoading(true);

      if (!validatorNodeDetails?.data?.key) {
        throw new Error("Public key is required");
      }

      const pubKey = {
        type: validatorNodeDetails?.data?.type,
        value: validatorNodeDetails?.data?.key,
      };

      // Initialize Keplr only when Update button is clicked
      await initializeKeplr();
      const { delegationAddress, txHash, validatorAddress } = await createValidator({
        validatorName: formData.validatorName,
        commissionRate: formData.commissionRate,
        commissionMaxRate: formData.maxCommissionRate,
        commissionMaxChangeRate: formData.maxCommissionChangeRate,
        email: validatorNodeDetails?.data?.email as string,
        description: formData.description as string,
        validatorIdentity: validatorPublicDetails?.summary.identity as string,
        website: formData.website as string,
        minDelegationAmount: formData.minDelegationAmount,
        delegationAmount: formData.delegationAmount,
        pubKey,
      });

      if (txHash) {
        toast("Created", {
          status: "success",
          message: `Successfully created the validator!`,
        });

        await saveTxnHash({ txhash: txHash, method: "stake-validator" as TxnMethods });

        const payload = {
          nodeId: nodeId as string,
          validatorInfo: {
            validatorName: formData.validatorName,
            description: formData.description,
            delegationAmount: formData.delegationAmount,
            minDelegationAmount: formData.minDelegationAmount,
            commissionRate: formData.commissionRate,
            maxCommissionRate: formData.maxCommissionRate,
            maxCommissionChangeRate: formData.maxCommissionChangeRate,
            website: formData.website,
            enableStateSync: formData.enableStateSync,
            validatorAddress,
            delegationAddress,
          },
        };
        await stakeValidatorRequest(stakeValidatorUrl, payload);
        window.location.reload();
      }
      onClose();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      toast("Error", {
        status: "error",
        message: `${error.message || error}`,
      });
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }, 4000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedWallet("keplr");
    }
  }, [isModalOpen]);

  return (
    <Modal isOpen={isModalOpen} handleClose={onClose} shouldBackdropDismiss={false}>
      <ModalOverlay />
      <ModalContent className="w-full max-w-4xl rounded-2xl p-0">
        <ModalBody className="flex h-96 flex-col gap-6 overflow-y-auto pb-4 pt-6 md:h-fit">
          <div className="flex w-full flex-row justify-between">
            <span className="text-2xl font-semibold text-[#080E12]">Stake Validator</span>
            <Button
              variant="text"
              onClick={onClose}
              className="p-0 text-[#080E12] focus:ring-transparent"
              iconLeft={<IconXMarkSquare className="size-6" />}
            />
          </div>

          <div className="flex w-full flex-col gap-4">
            <span className="text-sm font-medium">Select Wallet</span>
            <div className="flex flex-col gap-10 md:flex-row">
              {wallets.map((wallet) => (
                <button
                  key={wallet.key}
                  onClick={() => setSelectedWallet(wallet.key)}
                  className={`flex items-center gap-2 rounded-xl border px-6 py-4 transition-all duration-150 hover:scale-105 hover:shadow-lg 
                    ${selectedWallet === wallet.key ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-300"}
                  `}
                >
                  <Image
                    src={wallet.icon}
                    alt={wallet.name}
                    width={50}
                    height={50}
                    className="rounded-lg object-contain"
                  />
                  <span className="text-sm font-medium">{wallet.name}</span>
                </button>
              ))}
            </div>
            <form id="stakeForm" autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="mt-6">
              <span className="text-sm font-medium">Validator Configurations</span>
              <div className="pt-8">
                <div className="grid grid-cols-12 gap-3 lg:gap-4">
                  <FormField
                    className="col-span-12 md:col-span-4"
                    helper={{
                      status: "error",
                      text: errors.validatorName?.message?.toString(),
                    }}
                  >
                    <Label className="text-sm font-normal text-[#09122D]" isRequired>
                      Validator Name
                    </Label>
                    <Input
                      className="rounded-md border-gray-300 bg-white"
                      type="text"
                      size={"small"}
                      {...register("validatorName")}
                      isRequired
                    />
                  </FormField>
                  <FormField
                    className="col-span-12 md:col-span-4"
                    helper={{
                      status: "error",
                      text: errors.description?.message?.toString(),
                    }}
                  >
                    <Label className="text-sm font-normal text-[#09122D]">Description (Optional)</Label>
                    <Input
                      className="rounded-md border-gray-300 bg-white"
                      type="text"
                      size={"small"}
                      {...register("description")}
                    />
                  </FormField>
                  <FormField
                    className="col-span-12 md:col-span-4"
                    helper={{
                      status: "error",
                      text: errors.delegationAmount?.message?.toString(),
                    }}
                  >
                    <Label className="text-sm font-normal text-[#09122D]" isRequired>
                      Delegation Amount
                    </Label>
                    <Input
                      className="rounded-md border-gray-300 bg-white"
                      type="number"
                      step="0.0000000001" // allows up to 10 decimal places
                      size={"small"}
                      {...register("delegationAmount")}
                      isRequired
                    />
                  </FormField>
                  <FormField
                    className="col-span-12 md:col-span-4"
                    helper={{
                      status: "error",
                      text: errors.minDelegationAmount?.message?.toString(),
                    }}
                  >
                    <Label className="text-sm font-normal text-[#09122D]" isRequired>
                      Minimum Delegation Amount
                    </Label>
                    <Input
                      className="rounded-md border-gray-300 bg-white"
                      type="number"
                      step="0.0000000001" // allows up to 10 decimal places
                      size={"small"}
                      {...register("minDelegationAmount")}
                      isRequired
                    />
                  </FormField>
                  <FormField
                    className="col-span-12 md:col-span-4"
                    helper={{
                      status: "error",
                      text: errors.commissionRate?.message?.toString(),
                    }}
                  >
                    <Label className="text-sm font-normal text-[#09122D]" isRequired>
                      Commission Rate (%)
                    </Label>
                    <Input
                      className="rounded-md border-gray-300 bg-white"
                      type="number"
                      step="0.0000000001" // allows up to 10 decimal places
                      size={"small"}
                      {...register("commissionRate")}
                      isRequired
                    />
                  </FormField>
                  <FormField
                    className="col-span-12 md:col-span-4"
                    helper={{
                      status: "error",
                      text: errors.maxCommissionRate?.message?.toString(),
                    }}
                  >
                    <Label className="text-sm font-normal text-[#09122D]" isRequired>
                      Commission Max. Rate (%)
                    </Label>
                    <Input
                      className="rounded-md border-gray-300 bg-white"
                      type="number"
                      step="0.0000000001" // allows up to 10 decimal places
                      size={"small"}
                      {...register("maxCommissionRate")}
                      isRequired
                    />
                  </FormField>
                  <FormField
                    className="col-span-12 md:col-span-4"
                    helper={{
                      status: "error",
                      text: errors.maxCommissionChangeRate?.message?.toString(),
                    }}
                  >
                    <Label className="text-sm font-normal text-[#09122D]" isRequired>
                      Commission Max. Change Rate (%)
                    </Label>
                    <Input
                      className="rounded-md border-gray-300 bg-white"
                      type="number"
                      step="0.0000000001" // allows up to 10 decimal places
                      size={"small"}
                      {...register("maxCommissionChangeRate")}
                      isRequired
                    />
                  </FormField>
                  <FormField
                    className="col-span-12 md:col-span-4"
                    helper={{
                      status: "error",
                      text: errors.website?.message?.toString(),
                    }}
                  >
                    <Label className="text-sm font-normal text-[#09122D]">Website (Optional)</Label>
                    <Input
                      className="rounded-md border-gray-300 bg-white"
                      type="text"
                      size={"small"}
                      {...register("website")}
                      // floatingLabel={{
                      //   labelText: "Enter Website (Optional)",
                      //   floatingLabelProps: {
                      //     className: "!text-sm",
                      //   },
                      // }}
                      // placeholder="Enter Website (Optional)"
                    />
                  </FormField>
                  <div className="col-span-12 flex items-center">
                    <Switch {...register("enableStateSync")} className="mr-3" defaultChecked />
                    <Label className="text-sm font-medium text-gray-500">Enable State Sync</Label>
                    <IconButton
                      className="size-7 bg-white focus:ring-0 focus:ring-offset-0"
                      onClick={() => {
                        setShowSpan((prev) => !prev);
                      }}
                    >
                      <IconInfo className="text-sm text-brand-gray" />
                    </IconButton>
                    {showSpan && (
                      <div className="w-[72%] rounded-md bg-yellow-200 p-2 text-xs font-medium">
                        By enabling state sync your node will download data related to the head or near the head of the
                        chain and verify the data. This leads to drastically shorter times for joining a network.&nbsp;
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://docs.tendermint.com/v0.34/tendermint-core/state-sync.html"
                          className="text-brand-primary underline"
                        >
                          Read more
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </ModalBody>

        <ModalFooter placement="end" className="px-6 pb-4 pt-3">
          <Button
            type="submit"
            form="stakeForm"
            colorScheme="blue"
            className="w-full"
            isLoading={isLoading}
            isDisabled={!selectedWallet || !isValid}
          >
            Stake
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StakeValidatorModal;
