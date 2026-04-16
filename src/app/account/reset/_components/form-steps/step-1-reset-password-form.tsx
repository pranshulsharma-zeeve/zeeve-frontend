"use client";
import React from "react";
import axios, { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@zeeve-platform/ui";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useResetPasswordStore } from "@/store/reset-password";
import useAuthService from "@/services/auth/use-auth-service";
import { AuthServiceError } from "@/services/auth/types";
import HTTP_STATUS from "@/constants/http";
import NoAccountRedirect from "@/components/no-account-redirect";
import { REGEX_PASSWORD } from "@/constants/regex";
import { PrimaryButton } from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import Password from "@/components/ui/password";
import { unexpectedError } from "@/constants/error";
import FormHeading from "@/components/form-heading";
import FormSubheading from "@/components/form-subheading";
import Card from "@/components/card";

const resetPasswordFormValidationSchema = yup
  .object({
    password: yup
      .string()
      .required("New password is required.")
      .matches(
        REGEX_PASSWORD,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character.",
      ),
    confirmpass: yup
      .string()
      .required("Confirm password is required.")
      .oneOf([yup.ref("password")], "Passwords do not match."),
  })
  .required();

type ResetPasswordFormValidationSchemaType = yup.InferType<typeof resetPasswordFormValidationSchema>;

const ResetPasswordForm = () => {
  // get otp token from query string
  const otp = useSearchParams().get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ResetPasswordFormValidationSchemaType>({
    resolver: yupResolver(resetPasswordFormValidationSchema),
    mode: "all",
  });

  const setResetPasswordStep = useResetPasswordStore((state) => state.setStep);
  const toast = useToast();
  const { request, url } = useAuthService().resetPassword();

  const onSubmit = async (data: ResetPasswordFormValidationSchemaType) => {
    try {
      const response = await request(url, {
        ...data,
        client: "mobile",
        otp: otp as string,
      });
      if (response.status === HTTP_STATUS.OK && response?.data.success) {
        toast("Password changed successfully.", {
          status: "success",
        });
        setResetPasswordStep("resetPasswordSuccess");
      } else {
        toast("", {
          status: "error",
          message: response.data?.error?.message ?? unexpectedError,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<AuthServiceError>;
        toast("", {
          status: "error",
          message: axiosError.response?.data?.error?.message ?? unexpectedError,
        });
      } else {
        toast("", {
          status: "error",
          message: unexpectedError,
        });
      }
    }
  };

  return (
    <Card>
      <div className="flex flex-col gap-[20px]">
        <FormHeading>Reset your password</FormHeading>
        <FormSubheading>Enter new password that you will use to access Zeeve.</FormSubheading>
      </div>

      {/* form */}
      <form className="flex w-full flex-col gap-[20px] lg:gap-[40px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-[20px]">
          {/* password */}
          <FormField
            label={{
              text: "Password",
              isRequired: true,
            }}
            helper={{
              status: "error",
              text: errors.password?.message?.toString(),
            }}
          >
            <Password {...register("password")} shouldToggleMask />
          </FormField>

          {/* confirm password */}
          <FormField
            label={{
              text: "Confirm Password",
              isRequired: true,
            }}
            helper={{
              status: "error",
              text: errors.confirmpass?.message?.toString(),
            }}
          >
            <Password {...register("confirmpass")} shouldToggleMask />
          </FormField>
        </div>

        <div className="flex flex-col gap-[20px]">
          <PrimaryButton type="submit" isDisabled={!isValid} isLoading={isSubmitting}>
            Reset Password
          </PrimaryButton>
          <NoAccountRedirect />
        </div>
      </form>
    </Card>
  );
};

export default ResetPasswordForm;
