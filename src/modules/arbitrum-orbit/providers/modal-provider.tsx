/* eslint-disable prettier/prettier */
"use client";
import React from "react";
import PurchaseModal from "@orbit/components/modals/purchase-modal";
import DeleteNetworkModal from "@orbit/components/modals/delete-network-modal";
import NodeDetailsModal from "@orbit/components/modals/node-details-modal";
import DeployNetworkModal from "@orbit/components/modals/deploy-network-modal";

const ModalProvider = () => {
  return (
    <>
      {/* Register modals here */}
      <PurchaseModal />
      <DeleteNetworkModal />
      <NodeDetailsModal />
      <DeployNetworkModal />
    </>
  );
};

export default ModalProvider;
