"use client";

import React, { useEffect, useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter, Button, Input, useToast } from "@zeeve-platform/ui";
import Image from "next/image";
import { IconXMarkSquare } from "@zeeve-platform/icons/essential/outline";
import { useParams } from "next/navigation";
import { useModalStore } from "@/store/modal";
import { useKeplr } from "@/hooks/use-keplr";
import { validateInput, withBasePath } from "@/utils/helpers";
import { useSaveTxn } from "@/hooks/save-txn";
import { TxnMethods } from "@/types/network";

type WalletKey = "keplr" | "cosmostation" | "leap";
const wallets: { name: string; key: WalletKey; icon: string }[] = [
  { name: "Keplr", key: "keplr", icon: withBasePath(`/assets/images/wallets/keplr-logo.svg`) },
  { name: "Cosmostation", key: "cosmostation", icon: withBasePath(`/assets/images/wallets/cosmostation-logo.svg`) },
  { name: "Leap", key: "leap", icon: withBasePath(`/assets/images/wallets/leap-logo.svg`) },
];
const EditValidatordModal = () => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setLoading] = useState(false);
  const params = useParams();
  const nodeId = params.id as string;

  const { isOpen, onClose, type, data } = useModalStore();
  const [selectedWallet, setSelectedWallet] = useState<"keplr" | "cosmostation" | "leap">("keplr");
  const isModalOpen = isOpen && type === "editValidator";

  const toast = useToast();

  // const validatorNodeResp = data?.editValidator?.validatorNodeDetails?.data?.[0];
  const validatorNodeDetails = data?.editValidator?.validatorNodeDetails?.data;
  const validatorPublicDetails = data?.editValidator?.validatorPublicDetails?.data;
  const initialValue = data?.editValidator?.value ?? "";
  const initialKey = data?.editValidator?.key ?? "";
  const initialMethod = data?.editValidator?.methodName;

  const networkType = validatorNodeDetails?.network_type ?? "";
  const delegationAddress = data?.editValidator?.validatorNodeDetails?.data?.delegation_address ?? "";

  // Only initialize useKeplr when shouldInitializeKeplr is true
  const { updateValidatorDetails, initializeKeplr } = useKeplr(networkType, selectedWallet, delegationAddress);
  const { saveTxnHash } = useSaveTxn(nodeId as string);

  useEffect(() => {
    if (!isModalOpen) return;
    setInputValue("");
  }, [isModalOpen]);

  const validateCommissionRate = (
    inputValue: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validatorPublicDetails: any, // use correct type
  ): string | null => {
    const newRate = parseFloat(inputValue);
    const currentRate = parseFloat(String(validatorPublicDetails.summary.commission.rate || "0")) * 100; // stored as decimal
    const maxChangeRate = parseFloat(String(validatorPublicDetails.summary.commission.max_change_rate || "0")) * 100; // decimal → %
    const maxRate = parseFloat(String(validatorPublicDetails.summary.commission.max_rate || "0")) * 100; // decimal → %

    // Debug logging to understand the values
    console.log("Commission Rate Validation Debug:", {
      inputValue,
      newRate,
      currentRate,
      maxChangeRate,
      maxRate,
      rateChange: Math.abs(newRate - currentRate),
      validatorPublicDetails,
      rawValues: {
        commissionRate: validatorPublicDetails.summary.commission.rate,
        commissionMaxChangeRate: validatorPublicDetails.summary.commission.max_change_rate,
        commissionMaxRate: validatorPublicDetails.summary.commission.max_rate,
      },
    });

    if (isNaN(newRate)) {
      console.log("Validation failed: newRate is NaN");
      return "Commission rate must be a number.";
    }

    // 1. Commission rate >= 0
    if (newRate < 0) {
      console.log("Validation failed: newRate < 0");
      return "Commission rate cannot be less than 0%.";
    }

    // 2. Commission rate <= max rate
    if (newRate > maxRate) {
      console.log("Validation failed: newRate > maxRate");
      return `Commission rate cannot be more than ${maxRate}%.`;
    }

    // 3. Change must be within ± max change rate
    const rateChange = Math.abs(newRate - currentRate);
    // Use a small epsilon to handle floating-point precision issues
    const epsilon = 0.0001; // 0.0001% tolerance
    const willFail = rateChange > maxChangeRate + epsilon;

    console.log("Rate change calculation:", {
      rateChange,
      maxChangeRate,
      epsilon,
      willFail,
      comparison: `${rateChange} > ${maxChangeRate + epsilon}`,
    });

    if (willFail) {
      console.log("Validation failed: rateChange > maxChangeRate");
      return `Commission rate change (${rateChange.toFixed(2)}%) cannot exceed max change rate (${maxChangeRate}%).`;
    }

    // 4. No more than 2 decimal places
    const precision = inputValue.split(".")[1]?.length || 0;
    if (precision > 2) {
      console.log("Validation failed: precision > 2");
      return "Commission rate precision cannot be more than 2 decimal places.";
    }

    console.log("Commission rate validation PASSED");
    return null; // means valid
  };

  const handleSubmit = async () => {
    console.log("validatorNodeResp", selectedWallet);
    if (!inputValue.trim() && initialKey !== "email") {
      toast("Validation Error", {
        status: "error",
        message: `${initialValue} is required.`,
      });
      return;
    }
    if (!validatorPublicDetails) {
      toast("Error", {
        status: "error",
        message: "Validator data not loaded. Please try again.",
      });
      return;
    }
    // Add commission rate validation
    if (initialKey === "commissionRate") {
      const error = validateCommissionRate(inputValue, validatorPublicDetails);
      if (error) {
        toast("Validation Error", { status: "error", message: error });
        return;
      }
    }
    const errorMessage = validateInput(initialKey, inputValue);
    if (errorMessage) {
      toast("Validation Error", {
        status: "error",
        message: errorMessage,
      });
      return;
    }

    try {
      setLoading(true);

      // Initialize Keplr only when Update button is clicked
      await initializeKeplr();

      const updatedPayload = {
        validatorName: validatorPublicDetails.summary.moniker,
        email: validatorNodeDetails?.email,
        description: validatorPublicDetails.summary.description,
        validatorIdentity: validatorPublicDetails.summary.identity,
        website: validatorPublicDetails.summary.website,
        accountValidatorMonikerId: "",
        minDelegationAmount: validatorPublicDetails.summary.min_self_delegation,
        [initialKey]: inputValue, // This updates only the field being edited
      };
      // Build request object and omit unchanged commission fields
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validatorUpdate: any = {
        validatorName: updatedPayload.validatorName,
        email: updatedPayload.email,
        description: updatedPayload.description,
        validatorIdentity: updatedPayload.validatorIdentity,
        website: updatedPayload.website,
        accountValidatorMonikerId: updatedPayload.accountValidatorMonikerId,
        minDelegationAmount: updatedPayload.minDelegationAmount,
      };

      // Include commission fields only if they are being changed
      if (initialKey === "commissionRate") {
        // Convert percentage to decimal (5% -> 0.05) as expected by Cosmos SDK
        validatorUpdate.commissionRate = (parseFloat(inputValue) / 100).toString();
        // Remove other commission fields to avoid validation issues
        delete validatorUpdate.commissionMaxRate;
        delete validatorUpdate.commissionMaxChangeRate;
      }
      if (initialKey === "commissionMaxRate") {
        // Convert percentage to decimal (20% -> 0.20) as expected by Cosmos SDK
        validatorUpdate.commissionMaxRate = (parseFloat(inputValue) / 100).toString();
        // Remove other commission fields to avoid validation issues
        delete validatorUpdate.commissionRate;
        delete validatorUpdate.commissionMaxChangeRate;
      }
      if (initialKey === "commissionMaxChangeRate") {
        // Convert percentage to decimal (1% -> 0.01) as expected by Cosmos SDK
        validatorUpdate.commissionMaxChangeRate = (parseFloat(inputValue) / 100).toString();
        // Remove other commission fields to avoid validation issues
        delete validatorUpdate.commissionMaxRate;
        delete validatorUpdate.commissionRate;
      }

      // Add debugging
      console.log("Commission update - initialKey:", initialKey);
      console.log("Commission values being sent:", {
        commissionRate: validatorUpdate.commissionRate,
        commissionMaxRate: validatorUpdate.commissionMaxRate,
        commissionMaxChangeRate: validatorUpdate.commissionMaxChangeRate,
      });
      console.log("Updated payload:", updatedPayload);

      console.log("Final validatorUpdate object:", validatorUpdate);

      const response = await updateValidatorDetails(
        data?.editValidator?.validatorNodeDetails?.data?.validator_address as string,
        validatorUpdate,
      );
      if (!!response) {
        await saveTxnHash({ txhash: response, method: initialMethod as TxnMethods });
        toast("Updated", {
          status: "success",
          message: `${initialValue} updated successfully.`,
        });
        window.location.reload();
      }
      onClose();
    } catch (error) {
      console.error(error);

      // Handle specific Cosmos SDK validation errors
      let errorMessage = "Something went wrong while updating.";

      if (error instanceof Error) {
        const errorStr = error.message;

        if (errorStr.includes("commission cannot be changed more than max change rate")) {
          errorMessage =
            "Commission rate change exceeds the maximum allowed change rate. Please reduce the change amount.";
        } else if (errorStr.includes("commission cannot be changed more than once in 24h")) {
          errorMessage = "Commission rate can only be changed once every 24 hours. Please try again later.";
        } else if (errorStr.includes("commission rate must be between 0 and 1")) {
          errorMessage = "Commission rate must be between 0% and 100%.";
        } else if (errorStr.includes("failed to execute message")) {
          errorMessage = "Transaction failed due to validation rules. Please check your input values.";
        } else {
          errorMessage = error.message;
        }
      }

      toast("Error", {
        status: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isModalOpen} handleClose={onClose} shouldBackdropDismiss={false}>
      <ModalOverlay />
      <ModalContent className="w-full max-w-xl rounded-2xl p-0">
        <ModalBody className={`flex flex-col gap-6 pt-6 ${initialKey === "selectWallet" ? "pb-6" : "pb-2"}`}>
          <div className="flex w-full flex-row justify-between ">
            <span className="text-2xl font-semibold text-[#080E12]">
              {initialKey === "selectWallet" ? `Select Wallet` : `Update ${initialValue}`}
            </span>

            <Button
              variant="text"
              onClick={onClose}
              className="p-0 text-[#080E12]"
              iconLeft={<IconXMarkSquare className="size-6" />}
            />
          </div>

          <div className="flex w-full flex-col">
            {/* <label className="pb-3 text-sm font-medium">{initialValue}</label> */}

            {initialKey === "selectWallet" ? (
              <div className="flex flex-col gap-6 md:flex-row">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.key}
                    onClick={async () => {
                      setSelectedWallet(wallet.key);
                      try {
                        setLoading(true);
                        toast("Wallet Updated", {
                          status: "success",
                          message: `${wallet.name} selected successfully.`,
                        });
                        // Close modal after selection
                        onClose();
                      } catch (error) {
                        console.error(error);
                        toast("Error", {
                          status: "error",
                          message: "Failed to update wallet selection.",
                        });
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className={`flex flex-row items-center gap-2 rounded-xl border px-6 py-4 transition-all duration-150 hover:scale-105 hover:shadow-lg 
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
            ) : (
              <Input
                className="mt-1 w-full border border-[#E3E3E3]"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={initialKey === "email" ? "Security Contact (optional)" : `Enter ${initialValue}`}
              />
            )}
          </div>
        </ModalBody>

        {initialKey !== "selectWallet" && (
          <ModalFooter placement="end" className="px-6 pb-4 pt-3">
            <Button
              colorScheme="blue"
              className="w-full"
              onClick={handleSubmit}
              isLoading={isLoading}
              isDisabled={initialKey !== "email" && !inputValue.trim()}
            >
              Update
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditValidatordModal;
