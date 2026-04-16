"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  ModalFooter,
  ModalText,
  ModalTitle,
  StatusIcon,
  useToast,
} from "@zeeve-platform/ui";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useModalStore } from "@orbit/store/modal";
import useArbitrumOrbitService from "@orbit/services/arbitrum-orbit/use-arbitrum-orbit-service";
import ROUTES from "@orbit/routes";
import { ArbitrumOrbitServiceError } from "@orbit/services/arbitrum-orbit/types";

const DeleteNetworkModal = () => {
  const [isLoading, setLoading] = useState(false);
  const { isOpen, onClose, type, data } = useModalStore();
  const toast = useToast();
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteNetwork";

  const { request, url } = useArbitrumOrbitService().network.deleteNetwork(data.deleteNetwork?.networkId as string);

  const deleteNetwork = async () => {
    try {
      setLoading(true);
      await request(url);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<ArbitrumOrbitServiceError>;
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
      setLoading(false);
      navigateToList();
    }
  };

  const navigateToList = () => {
    router.push(`${ROUTES.ARBITRUM_ORBIT.PAGE.LIST}`);
    onClose();
  };

  return (
    <Modal isOpen={isModalOpen} handleClose={navigateToList} shouldBackdropDismiss={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <StatusIcon status="error" />
          <div className="flex flex-col gap-y-1">
            <ModalTitle>Delete Network</ModalTitle>
            <ModalText>
              Are you sure? You want to delete <span className="font-bold">{data.deleteNetwork?.networkName}</span>{" "}
              network.
            </ModalText>
          </div>
        </ModalBody>
        <ModalFooter placement="end">
          <Button variant="ghost" className="text-brand-red" onClick={onClose} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={deleteNetwork} isLoading={isLoading}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteNetworkModal;
