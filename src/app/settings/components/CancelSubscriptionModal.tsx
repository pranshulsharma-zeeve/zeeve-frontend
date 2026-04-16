"use client";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, ModalTitle } from "@zeeve-platform/ui";

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  subscriptionName?: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  isProcessing?: boolean;
}

const CancelSubscriptionModal = ({
  isOpen,
  subscriptionName,
  onCancel,
  onConfirm,
  isProcessing = false,
}: CancelSubscriptionModalProps) => {
  return (
    <Modal isOpen={isOpen} handleClose={isProcessing ? () => {} : onCancel} shouldBackdropDismiss={!isProcessing}>
      <ModalOverlay />
      <ModalContent className="w-full max-w-xl rounded-3xl">
        <ModalBody className="flex flex-col gap-4 p-6">
          <ModalTitle className="text-lg font-semibold text-[#0F172A]">
            Cancel Subscription{subscriptionName ? ` — ${subscriptionName}` : "?"}
          </ModalTitle>
          <div className="space-y-3 text-sm text-[#4B5563]">
            <p>
              {subscriptionName
                ? `You are about to cancel your ${subscriptionName} subscription. This action will:`
                : "You are about to cancel this subscription. This action will:"}
            </p>
            <ul className="list-disc space-y-2 pl-5 text-[#4B5563]">
              <li>Stop all future billing for this plan.</li>
              <li>End your access to related features and services after the current term expires.</li>
              <li>
                Keep your node active until the end of the current subscription period, ensuring uninterrupted service
                until then.
              </li>
            </ul>
            <p className="font-medium text-[#374151]">Are you sure you want to proceed with the cancellation?</p>
          </div>
        </ModalBody>
        <ModalFooter className="flex flex-wrap items-center justify-end gap-3 border-t border-[#E5E7EB] p-6">
          <Button
            type="button"
            variant="outline"
            className="min-w-[150px]"
            onClick={onCancel}
            isDisabled={isProcessing}
          >
            Keep Subscription
          </Button>
          <Button
            type="button"
            className="min-w-[170px] bg-[#EF4444] hover:bg-[#DC2626]"
            onClick={onConfirm}
            isLoading={isProcessing}
          >
            Cancel Subscription
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CancelSubscriptionModal;
