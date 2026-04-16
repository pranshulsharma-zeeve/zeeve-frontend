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
import { useModalStore } from "@/store/modal";
import usePlatformService from "@/services/platform/use-platform-service";
import { PlatformServiceError } from "@/services/platform/types";
import ROUTES from "@/routes";

const DeleteProtocolModal = () => {
  const [isLoading, setLoading] = useState(false);
  const { isOpen, onClose, type, data } = useModalStore();
  const toast = useToast();
  const router = useRouter();
  const isModalOpen = isOpen && type === "deleteProtocol";
  const { request, url } = usePlatformService().protocol.deleteProtocol(data.deleteProtocol?.protocolId as string);

  const deleteProtocol = async () => {
    try {
      setLoading(true);
      await request(url);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<PlatformServiceError>;
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
    switch (data.deleteProtocol?.nodeType) {
      case "full":
        router.push(`${ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES}`);
        break;
      case "archive":
        router.push(`${ROUTES.PLATFORM.PAGE.MANAGE_ARCHIVE_NODES}`);
        break;
      default:
        console.error(`Unknown nodeType: ${data.deleteProtocol?.nodeType}`);
    }

    onClose();
  };

  return (
    <Modal isOpen={isModalOpen} handleClose={onClose} shouldBackdropDismiss={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <StatusIcon status="error" />
          <div className="flex flex-col gap-y-1">
            <ModalTitle>Delete Node</ModalTitle>
            <ModalText>
              Are you sure? You want to delete <span className="font-bold">{data.deleteProtocol?.protocolId}</span>{" "}
              node.
            </ModalText>
          </div>
        </ModalBody>
        <ModalFooter placement="end">
          <Button variant="ghost" className="text-brand-red" onClick={onClose} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={deleteProtocol} isLoading={isLoading}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteProtocolModal;
