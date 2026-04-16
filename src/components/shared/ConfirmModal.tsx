"use client";
import React from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay } from "@zeeve-platform/ui";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  description?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} handleClose={onCancel} shouldBackdropDismiss={false}>
      <ModalOverlay />
      <ModalContent className="w-full max-w-md">
        <ModalBody className="gap-2">
          {title ? <h3 className="text-lg font-semibold">{title}</h3> : null}
          {description ? <div className="text-sm opacity-80">{description}</div> : null}
        </ModalBody>
        <ModalFooter className="flex gap-2 border-t border-brand-outline">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button colorScheme="red" onClick={onConfirm}>
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
