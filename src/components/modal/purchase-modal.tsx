"use client";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay } from "@zeeve-platform/ui";
import { useModalStore } from "@/store/modal";

const PurchaseModal = () => {
  const { isOpen, onClose, type, data } = useModalStore();

  const isModalOpen = isOpen && type === "purchase";

  return (
    <Modal isOpen={isModalOpen} handleClose={onClose} shouldBackdropDismiss={false}>
      <ModalOverlay />
      <ModalContent className="h-[90%] w-full max-w-xl">
        <ModalBody className="h-full gap-0 border-none p-0">
          <iframe src={data.purchase?.url} width="100%" height="100%" className="p-3" />
        </ModalBody>
        <ModalFooter className="border-t border-brand-outline">
          <Button colorScheme="red" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PurchaseModal;
