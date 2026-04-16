"use client";

import React, { useEffect, useState } from "react";
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
  Password,
  Heading,
} from "@zeeve-platform/ui";
import axios, { AxiosError } from "axios";
import { useModalStore } from "@/store/modal";
import usePlatformService from "@/services/platform/use-platform-service";
import { PlatformServiceError } from "@/services/platform/types";

const ChangePasswordModal = () => {
  const [isLoading, setLoading] = useState(false);
  const [validatorPassword, setValidatorPassword] = useState("");
  const [confirmValidatorPassword, setConfirmValidatorPassword] = useState("");
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#^_\-+=~%?])[a-zA-Z\d!@#^_\-+=~%?]{8,20}$/;

  const { isOpen, onClose, type, data } = useModalStore();
  const toast = useToast();
  const isModalOpen = isOpen && type === "changePassword";

  const { request } = usePlatformService().protocol.changePassword({
    protocolId: data?.changePassword?.protocolId || "",
    networkId: data?.changePassword?.networkId || "",
    validatorPassword,
  });

  useEffect(() => {
    if (!isModalOpen) return;

    setValidatorPassword("");
    setConfirmValidatorPassword("");
  }, [isModalOpen]);

  const handleChangePassword = async () => {
    if (!validatorPassword || !confirmValidatorPassword) {
      toast("Validation Error", {
        status: "error",
        message: "Both password fields are required.",
      });
      return;
    }

    if (validatorPassword !== confirmValidatorPassword) {
      toast("Mismatch", {
        status: "error",
        message: "Passwords do not match.",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await request();

      if (res.data.success) {
        toast("Success", {
          status: "success",
          message: res.data.data.message || "Password change request submitted.",
        });
        onClose();
        window.location.reload(); // refresh page
      } else {
        toast("Error", {
          status: "error",
          message: res.data.data.message || "Some error occurred while changing password, pls try again later.",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<PlatformServiceError>;
        toast("Error", {
          status: "error",
          message: err.response?.data?.message || "Something went wrong.",
        });
      } else {
        toast("Unexpected Error", {
          status: "error",
          message: "An unexpected error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isModalOpen} handleClose={onClose} shouldBackdropDismiss={false}>
      <ModalOverlay />
      <ModalContent className="p-0">
        <ModalBody className="flex flex-col gap-2 px-6 pb-2 pt-6">
          <div className="flex flex-row items-center gap-3">
            <StatusIcon status="warning" />

            {/* <Heading className="mt-2 text-base font-semibold">Change Validator Dashboard Password</Heading> */}
            <Heading className="text-base font-medium">
              Please contact support for changing validator dashboard password.
            </Heading>
          </div>
          {/* <p className="text-xs text-gray-600">* This will be used to login into your Validator Dashboard</p> */}

          {/* <div className="flex flex-col gap-1"> */}
          {/* New Password */}
          {/* <div className="relative w-full">
              <label className="text-sm font-medium">New Password</label>
              <Password
                value={validatorPassword}
                onChange={(e) => setValidatorPassword(e.target.value)}
                placeholder="Enter new password"
                shouldToggleMask
                className={`mt-1 h-12 rounded-md border px-3 py-2 pr-10 text-sm font-normal ${
                  validatorPassword && passwordRegex.test(validatorPassword)
                    ? "border-brand-testnet bg-brand-testnet/10"
                    : "border-brand-outline"
                } focus:border-brand-testnet focus:ring-1`}
              />
              <p
                className={`mt-1 text-xs ${!validatorPassword ? "text-yellow-600" : passwordRegex.test(validatorPassword) ? "invisible" : "text-red-400"}`}
              >
                Password must be at least 8 characters long and include 1 uppercase, 1 lowercase, 1 number, and 1
                special character (!@#^_-+=~%?).
              </p>
            </div> */}

          {/* Confirm Password */}
          {/* <div className="relative w-full">
              <label className="text-sm font-medium">Confirm Password</label>
              <Password
                value={confirmValidatorPassword}
                onChange={(e) => setConfirmValidatorPassword(e.target.value)}
                placeholder="Confirm password"
                shouldToggleMask
                className={`mt-1 h-12 rounded-md border px-3 py-2 pr-10 text-sm font-normal ${
                  confirmValidatorPassword &&
                  passwordRegex.test(confirmValidatorPassword) &&
                  confirmValidatorPassword === validatorPassword
                    ? "border-brand-testnet bg-brand-testnet/10"
                    : "border-brand-outline"
                }`}
              />
              {confirmValidatorPassword && confirmValidatorPassword !== validatorPassword && (
                <p className="mt-1 text-xs text-red-500">Passwords do not match.</p>
              )}
            </div> */}
          {/* </div> */}
        </ModalBody>

        <ModalFooter placement="end" className="px-6 pb-4 pt-2">
          <Button variant="ghost" onClick={onClose} isDisabled={isLoading}>
            Close
          </Button>
          {/* <Button
            colorScheme="blue"
            onClick={handleChangePassword}
            isLoading={isLoading}
            isDisabled={!passwordRegex.test(validatorPassword) || confirmValidatorPassword !== validatorPassword}
          >
            Change Password
          </Button> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangePasswordModal;
