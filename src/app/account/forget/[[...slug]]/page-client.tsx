"use client";
import React, { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@zeeve-platform/ui";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import useAuthService from "@/services/auth/use-auth-service";
import HTTP_STATUS from "@/constants/http";
import NoAccountRedirect from "@/components/no-account-redirect";
import { AuthServiceError } from "@/services/auth/types";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import { PrimaryButton } from "@/components/ui/button";
import { unexpectedError } from "@/constants/error";
import FormHeading from "@/components/form-heading";
import FormSubheading from "@/components/form-subheading";
import Card from "@/components/card";
import useBanner from "@/hooks/use-banner";
import { getConfig } from "@/config";

const forgotPasswordValidationSchema = yup
  .object({
    email: yup.string().required("Email address is required.").email("Must be a valid email address."),
  })
  .required();

type ForgotPasswordValidationSchemaType = yup.InferType<typeof forgotPasswordValidationSchema>;

const ForgotPasswordPageClient = () => {
  // dynamic banner
  useBanner();

  const [reCaptchaToken, setReCaptchaToken] = useState<string | null>(null);
  const config = getConfig();
  const isRecaptchaEnabled = config.reCaptcha?.enabled ?? true;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordValidationSchemaType>({
    resolver: yupResolver(forgotPasswordValidationSchema),
    mode: "all",
  });

  const toast = useToast();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { request, url } = useAuthService().forgotPassword();

  const handleReCaptchaVerify = useCallback(async () => {
    if (!isRecaptchaEnabled) {
      setReCaptchaToken(null);
      return;
    }

    if (!executeRecaptcha) {
      return;
    }

    const token = await executeRecaptcha("forgotPassword");
    setReCaptchaToken(token);
  }, [executeRecaptcha, isRecaptchaEnabled]);

  const onSubmit = async (data: ForgotPasswordValidationSchemaType) => {
    // if there is no reCaptcha token then return
    if (isRecaptchaEnabled && !reCaptchaToken) {
      return;
    }

    try {
      const payload = {
        ...data,
        client: "mobile" as const,
        ...(isRecaptchaEnabled && reCaptchaToken ? { recaptcha: reCaptchaToken } : {}),
      };
      const response = await request(url, payload);
      if (response?.status === HTTP_STATUS.OK && response?.data.success) {
        toast("Password reset link sent.", {
          message: "Please check your email.",
          status: "success",
        });
      } else {
        // if success is false
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
    } finally {
      if (isRecaptchaEnabled) {
        handleReCaptchaVerify();
      }
    }
  };

  useEffect(() => {
    if (!isRecaptchaEnabled) {
      setReCaptchaToken(null);
      return;
    }

    handleReCaptchaVerify();
  }, [handleReCaptchaVerify, isRecaptchaEnabled]);

  return (
    <Card>
      <div className="flex flex-col gap-[20px]">
        <FormHeading>Forgot Password?</FormHeading>
        <FormSubheading>Enter your email address and we will send you a link to reset password.</FormSubheading>
      </div>

      {/* form */}
      <form className="flex w-full flex-col gap-[20px] lg:gap-[40px]" onSubmit={handleSubmit(onSubmit)}>
        {/* email */}
        <FormField
          label={{
            text: "Email Address",
            isRequired: true,
          }}
          helper={{
            status: "error",
            text: errors.email?.message?.toString(),
          }}
        >
          <Input {...register("email")} type="email" placeholder="your.email@gmail.com" />
        </FormField>

        <div className="flex flex-col gap-[20px]">
          <PrimaryButton type="submit" isDisabled={!isValid} isLoading={isSubmitting}>
            Submit
          </PrimaryButton>
          <NoAccountRedirect />
        </div>
      </form>
    </Card>
  );
};

export default ForgotPasswordPageClient;
