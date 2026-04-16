"use client";
import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody, Heading, ModalTitle } from "@zeeve-platform/ui";
import { IconXMarkSquare } from "@zeeve-platform/icons/essential/outline";
import InfoRow from "../info-row";
import { useModalStore } from "@orbit/store/modal";
import { toCapitalize } from "@orbit/utils/helpers";
import { formatIntoAge } from "@orbit/utils/date";

const NodeDetailsModal = () => {
  const { isOpen, onClose, type, data: modalData } = useModalStore();
  const isModalOpen = isOpen && type === "nodeDetails";
  const data = modalData.nodeDetails;

  return (
    <Modal isOpen={isModalOpen} handleClose={onClose}>
      <ModalOverlay />
      <ModalContent className="max-h-screen w-1/2 min-w-[340px] overflow-y-auto bg-[#f8fafa]">
        <ModalBody className="grid grid-cols-12">
          <div className="col-span-12 flex flex-col">
            <ModalTitle className="flex w-full flex-row items-start justify-between text-xl">
              <div>{toCapitalize(modalData.nodeDetails?.nodeType ?? "", "all")} Node Details</div>
              <IconXMarkSquare className="size-6 cursor-pointer" onClick={onClose} />
            </ModalTitle>
            <div className="my-2 flex flex-col gap-4 rounded-xl bg-white p-4">
              <Heading as="h5">Node General Info</Heading>

              <div className="grid grid-cols-2 gap-5">
                <InfoRow label="Name" value={data?.nodeName} />
                <InfoRow label="Type" value={data?.nodeType.toUpperCase()} textAlign="right" />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <InfoRow label="Duration" value={formatIntoAge(data?.nodeCreatedAt, new Date())} />
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NodeDetailsModal;
