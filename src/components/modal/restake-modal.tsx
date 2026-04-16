/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter, Button, useToast } from "@zeeve-platform/ui";
import { IconXMarkSquare } from "@zeeve-platform/icons/essential/outline";
import { useModalStore } from "@/store/modal";
import usePlatformService from "@/services/platform/use-platform-service";
import HTTP_STATUS from "@/constants/http";

const ReStakeValidatorModal = () => {
  const { isOpen, onClose, type, data } = useModalStore();
  const isModalOpen = isOpen && type === "restakeModal";
  const toast = useToast();

  const nodeId = data?.restakeModal?.nodeId;
  const networkId = data?.restakeModal?.networkId;
  const restakeStatus = data?.restakeModal?.restakeStatus;

  const [isLoading, setIsLoading] = useState(false);

  const { url: enableStakeUrl, request: enableStakeRequest } = usePlatformService().vizion.enableDisableRestake(
    nodeId as string,
    networkId as string,
    false, // disable = false → enable
  );

  const { url: disableStakeUrl, request: disableStakeRequest } = usePlatformService().vizion.enableDisableRestake(
    nodeId as string,
    networkId as string,
    true, // disable = true → disable
  );

  const restakeStatusHandler = async () => {
    try {
      setIsLoading(true);
      if (!restakeStatus) {
        console.log("Enabling restake");
        const response: any = await enableStakeRequest();
        if (response?.status === HTTP_STATUS.OK) {
          toast("Restake enabled successfully", {
            status: "success",
          });
        }
      } else {
        console.log("Disabling restake");
        const response: any = await disableStakeRequest();
        if (response?.status === HTTP_STATUS.OK) {
          toast("Restake disabled successfully", {
            status: "success",
          });
        }
      }
      onClose();
      window.location.reload();
    } catch (error: any) {
      console.log(error);
      toast("Error", {
        status: "error",
        message: `${error.message || error}`,
      });
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isModalOpen} handleClose={onClose} shouldBackdropDismiss={false}>
      <ModalOverlay />
      <ModalContent className="w-full max-w-xl rounded-2xl p-0">
        <ModalBody className="flex flex-col gap-6 pb-4 pt-6">
          <div className="flex w-full flex-row justify-between">
            <span className="text-2xl font-semibold text-[#080E12]">Changing Restake Status</span>
            <Button
              variant="text"
              onClick={onClose}
              className="p-0 text-[#080E12]"
              iconLeft={<IconXMarkSquare className="size-6" />}
            />
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-sm font-medium">
              Are you sure you want to {restakeStatus ? "deactivate" : "activate"} the restake?
            </span>
          </div>
        </ModalBody>

        <ModalFooter placement="end" className="px-6 pb-4 pt-3">
          <Button colorScheme="blue" className="w-full" onClick={restakeStatusHandler} isLoading={isLoading}>
            Yes
          </Button>
          <Button colorScheme="gray" className="w-full" onClick={onClose} isLoading={isLoading}>
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReStakeValidatorModal;
