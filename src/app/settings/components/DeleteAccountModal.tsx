"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, ModalTitle } from "@zeeve-platform/ui";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  isProcessing?: boolean;
  userName?: string | null;
  userEmail?: string | null;
}

const DeleteAccountModal = ({
  isOpen,
  onCancel,
  onConfirm,
  isProcessing = false,
  userName,
  userEmail,
}: DeleteAccountModalProps) => {
  const displayName = userName?.trim() || "your Zeeve account";
  return (
    <Modal isOpen={isOpen} handleClose={isProcessing ? () => {} : onCancel} shouldBackdropDismiss={!isProcessing}>
      <ModalOverlay />
      <ModalContent className="w-full max-w-xl rounded-3xl">
        <ModalBody className="flex flex-col gap-5 p-6">
          <ModalTitle className="text-lg font-semibold text-[#0F172A]">Confirm account deletion request</ModalTitle>
          <p className="text-sm text-[#4B5563]">
            We will create a support ticket on your behalf and our team will reach out to complete the deletion of{" "}
            <span className="font-semibold text-[#0F172A]">{displayName}</span>.
          </p>
          <div className="rounded-2xl border border-[#FECACA] bg-[#FFF5F5] p-4 text-sm text-[#991B1B] shadow-[0_12px_26px_rgba(248,113,113,0.15)]">
            <p className="font-semibold">Please note:</p>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-[#B91C1C]">
              <li>The request will be sent to Zeeve Support as a high-priority ticket.</li>
              <li>Our support team may contact you for additional verification.</li>
              <li>Any active subscriptions must be cancelled before your account can be removed.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-sm text-[#1F2937]">
            <p className="font-medium text-[#111827]">Request details</p>
            <dl className="mt-3 space-y-2">
              <div className="flex flex-wrap gap-2 text-sm">
                <dt className="font-medium text-[#4B5563]">Name:</dt>
                <dd>{userName || "Not available"}</dd>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <dt className="font-medium text-[#4B5563]">Email:</dt>
                <dd>{userEmail || "Not available"}</dd>
              </div>
            </dl>
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
            Keep my account
          </Button>
          <Button
            type="button"
            className="min-w-[170px] bg-[#EF4444] hover:bg-[#DC2626]"
            onClick={onConfirm}
            isLoading={isProcessing}
          >
            Submit request
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteAccountModal;
