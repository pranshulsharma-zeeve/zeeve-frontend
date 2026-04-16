/* eslint-disable prettier/prettier */
"use client";
import React from "react";
import DeleteProtocolModal from "@/components/modal/delete-protocol-modal";
import PurchaseModal from "@/components/modal/purchase-modal";
import UpdateSoftwareModal from "@/components/modal/update-software-modal";
import UnboundTokenModal from "@/components/modal/unbound-token-modal";
import ChangePasswordModal from "@/components/modal/change-password-modal";
import EditValidatordModal from "@/components/modal/edit-validator-modal";
import WithdrawRewardsModal from "@/components/modal/withdraw-rewards-modal";
import SetRewardsModal from "@/components/modal/set-rewards-modal";
import EnableRestakeModal from "@/components/modal/enable-restake-modal";
import StakeValidatorModal from "@/components/modal/stake-validator";
import ReStakeValidatorModal from "@/components/modal/restake-modal";
import ContactUsModal from "@/components/modal/contact-us-modal";
import DisableRestakeModal from "@/components/modal/disable-restake-modal";
import UnjailModal from "@/components/modal/unjail-modal";

const ModalProvider = () => {
  return (
    <>
      {/* Register modals here */}
      <PurchaseModal />
      <DeleteProtocolModal />
      <UpdateSoftwareModal />
      <UnboundTokenModal />
      <ChangePasswordModal />
      <EditValidatordModal />
      <WithdrawRewardsModal />
      <SetRewardsModal />
      <EnableRestakeModal />
      <StakeValidatorModal />
      <ReStakeValidatorModal />
      <ContactUsModal />
      <DisableRestakeModal />
      <UnjailModal />
    </>
  );
};

export default ModalProvider;
