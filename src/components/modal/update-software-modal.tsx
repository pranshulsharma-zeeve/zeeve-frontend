"use client";
import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody, Button, ModalFooter, Heading } from "@zeeve-platform/ui";
import { useModalStore } from "@/store/modal";

const UpdateSoftwareModal = () => {
  const { isOpen, onClose, type, data } = useModalStore();
  const isModalOpen = isOpen && type === "updateSoftware";

  const handleUpdate = () => {
    data?.updateSoftware?.toggle();

    onClose();
    return true;
  };

  return (
    <Modal isOpen={isModalOpen} handleClose={onClose} shouldBackdropDismiss={false}>
      <ModalOverlay />
      <ModalContent className="rounded-2xl">
        <ModalBody>
          <Heading className="text-[24px]">
            Are you sure you want to Node software update rule to be set{" "}
            {data?.updateSoftware?.value == "automatically" ? "manually" : "automatically"}?
          </Heading>
        </ModalBody>
        <ModalFooter placement="end">
          <Button colorScheme="blue" className="flex-1 rounded-lg" onClick={handleUpdate}>
            Yes
          </Button>
          <Button variant="ghost" className="flex-1 rounded-lg" onClick={onClose}>
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateSoftwareModal;
