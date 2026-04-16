"use client";
import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  ModalTitle,
  Password,
} from "@zeeve-platform/ui";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { ChangePasswordFormValues } from "../hooks/useSettings";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  onSubmit: (values: ChangePasswordFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

const schema = yup
  .object({
    email: yup.string().email("Enter a valid email").required("Email is required"),
    current_password: yup.string().min(6, "Must be at least 6 characters").required("Current password is required"),
    new_password: yup
      .string()
      .min(8, "Must be at least 8 characters")
      .required("New password is required")
      .test("different-from-current", "New password must be different from current password", function validate(value) {
        const currentPassword = this.parent?.current_password;
        if (!value || !currentPassword) {
          return true;
        }
        return value !== currentPassword;
      }),
    confirm_new_password: yup
      .string()
      .oneOf([yup.ref("new_password")], "Passwords must match")
      .required("Confirm the new password"),
  })
  .required();

const PasswordModal = ({ isOpen, onClose, email, onSubmit, isSubmitting = false }: PasswordModalProps) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid, isSubmitting: isFormSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: {
      email: email ?? "",
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        email: email ?? "",
        current_password: "",
        new_password: "",
        confirm_new_password: "",
      });
    }
  }, [email, isOpen, reset]);

  const handleClose = () => {
    reset({
      email: email ?? "",
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    });
    onClose();
  };

  const onFormSubmit = async (values: ChangePasswordFormValues) => {
    try {
      await onSubmit(values);
      handleClose();
    } catch (error) {
      // Feedback already provided via toast in caller.
    }
  };

  const isProcessing = isSubmitting || isFormSubmitting;

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} shouldBackdropDismiss={!isProcessing}>
      <ModalOverlay />
      <ModalContent className="w-full max-w-xl rounded-3xl sm:max-w-lg">
        <ModalBody className="mx-auto flex w-full max-w-[420px] flex-col gap-6 px-6 pb-4 pt-6">
          <ModalTitle className="text-lg font-semibold text-[#0F172A]">Change Password</ModalTitle>
          <input type="hidden" readOnly value={email ?? ""} {...register("email")} />

          <div className="space-y-2">
            <label htmlFor="settings-password-current" className="text-sm font-medium text-[#4B5563]">
              Current Password
            </label>
            <Password
              id="settings-password-current"
              {...register("current_password")}
              autoComplete="current-password"
              shouldToggleMask
              className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-sm font-medium text-[#111827]"
            />
            {errors.current_password ? (
              <p className="text-xs text-[#B91C1C]">{errors.current_password.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="settings-password-new" className="text-sm font-medium text-[#4B5563]">
              New Password
            </label>
            <Password
              id="settings-password-new"
              {...register("new_password")}
              autoComplete="new-password"
              shouldToggleMask
              className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-sm font-medium text-[#111827]"
            />
            {errors.new_password ? <p className="text-xs text-[#B91C1C]">{errors.new_password.message}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="settings-password-confirm" className="text-sm font-medium text-[#4B5563]">
              Confirm New Password
            </label>
            <Password
              id="settings-password-confirm"
              {...register("confirm_new_password")}
              autoComplete="new-password"
              shouldToggleMask
              className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-sm font-medium text-[#111827]"
            />
            {errors.confirm_new_password ? (
              <p className="text-xs text-[#B91C1C]">{errors.confirm_new_password.message}</p>
            ) : null}
          </div>
        </ModalBody>

        <ModalFooter className="mx-auto flex w-full max-w-[420px] items-center justify-start gap-4 border-t border-[#E5E7EB] p-6">
          <Button
            type="button"
            onClick={handleClose}
            className="h-11 min-w-[140px] rounded-full border border-[#CBD5F5] bg-white px-6 text-sm font-semibold text-brand-primary"
            isDisabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(onFormSubmit)}
            className="h-11 min-w-[160px] rounded-full bg-gradient-to-r from-brand-primary to-brand-primary px-6 text-sm font-semibold text-white transition duration-200 hover:brightness-105 focus:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            isDisabled={!isValid}
            isLoading={isProcessing}
          >
            Update Password
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PasswordModal;
