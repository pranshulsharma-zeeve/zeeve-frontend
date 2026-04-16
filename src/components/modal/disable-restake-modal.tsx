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
  ModalFooter,
} from "@zeeve-platform/ui";
import axios, { AxiosError } from "axios";
import { IconXMarkSquare } from "@zeeve-platform/icons/essential/outline";
import { useModalStore } from "@/store/modal";
import usePlatformService from "@/services/platform/use-platform-service";
import { CoreumServiceError } from "@/services/platform/types";
import HTTP_STATUS from "@/constants/http";
import { useVisionUserStore } from "@/store/vizionUser";
import { DisableRestakeRequestPayload } from "@/services/vizion/disable-restake";

const DisableRestakeModal = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { isOpen, onClose, type, data } = useModalStore();
  const vizionUser = useVisionUserStore((state) => state.visionUser);
  const toast = useToast();
  const isModalOpen = isOpen && type === "disableRestake";

  const { url: disableRestakeUrl, request: disableRestakeRequest } = usePlatformService().vizion.disableRestake(
    data.cosmosSettingsModals?.nodeId as string,
  );

  const onSubmit = async () => {
    const payload: DisableRestakeRequestPayload = {
      hostId:
        vizionUser?.hostData.find((item) => item.networkId === data.cosmosSettingsModals?.nodeId)?.hostIds[0] ?? "",
    };
    try {
      setIsSubmitting(true);
      const response = await disableRestakeRequest(disableRestakeUrl, payload);
      if (response.status === HTTP_STATUS.OK && response.data?.success) {
        toast("", {
          status: "success",
          message: "Successfully disabled restake!",
        });
        onClose();
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(typeof error, error);
        const err = error as AxiosError<CoreumServiceError>;
        toast("Axios Error", {
          status: "error",
          message: `${err.response?.data?.error?.reason ?? ""} ${err.response?.data?.error?.details ?? ""}`,
        });
      } else {
        console.log(typeof error, error);
        const err = error as Error;
        toast("An unexpected error occurred", {
          status: "error",
          message: err.message,
        });
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
            <ModalTitle className="text-2xl">Disable Restake</ModalTitle>
            <Button
              variant={"text"}
              onClick={onClose}
              isDisabled={isSubmitting}
              className="size-fit p-0 focus:ring-0 focus:ring-offset-0"
              iconLeft={<IconXMarkSquare className="size-8" />}
            />
          </div>
          <Heading className="text-base font-medium">Are you sure you want to disable restake ?</Heading>
        </ModalBody>
        <ModalFooter placement="end" className="px-6 pb-4 pt-2">
          <Button variant="ghost" onClick={onClose} isDisabled={isSubmitting}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={onSubmit} isLoading={isSubmitting}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DisableRestakeModal;
