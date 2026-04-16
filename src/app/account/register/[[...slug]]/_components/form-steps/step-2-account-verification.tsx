"use client";
import React, { useCallback, useEffect, useState } from "react";
import { PinInput, useToast } from "@zeeve-platform/ui";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import ResendOTP from "../resend-otp";
import { useRegistrationStore } from "@/store/registration";
import OTP from "@/constants/otp";
import HTTP_STATUS from "@/constants/http";
import useAuthService from "@/services/auth/use-auth-service";
import ContactUs from "@/components/contact-us";
import { AuthServiceError } from "@/services/auth/types";
import { PrimaryButton } from "@/components/ui/button";
import { unexpectedError } from "@/constants/error";
import FormHeading from "@/components/form-heading";
import FormSubheading from "@/components/form-subheading";
import Card from "@/components/card";
import ROUTES from "@/routes";
import useAxios from "@/hooks/use-axios";
import { withBasePath } from "@/utils/helpers";
import { authAxiosInstance } from "@/utils/auth-axios";
import { withApiBasePath } from "@/constants/api";

const AccountVerification = () => {
  const [otp, setOTP] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const { registrationForm, accountVerification, setStep, reset } = useRegistrationStore();
  const email = registrationForm?.email ?? accountVerification?.email;

  const toast = useToast();
  const { request, url } = useAuthService().verifyOTP();
  const router = useRouter();
  const { setAuthToken } = useAxios();

  const extractToken = useCallback((payload: unknown): string | null => {
    if (!payload) {
      return null;
    }

    if (typeof payload === "string" && payload.trim().length > 0) {
      return payload;
    }

    if (typeof payload === "object") {
      const record = payload as Record<string, unknown>;
      const possibleKeys = [
        "access_token",
        "accessToken",
        "token",
        "bearer_token",
        "bearerToken",
        "jwt",
        "accesstoken",
      ];
      for (const key of possibleKeys) {
        const candidate = record[key];
        if (typeof candidate === "string" && candidate.trim().length > 0) {
          return candidate;
        }
      }
    }

    return null;
  }, []);

  useEffect(() => {
    if (otp.trim().length === OTP.length) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [otp]);

  const getOtpErrorMessage = (message?: string | null) => {
    const normalized = (message ?? "").trim().toLowerCase();
    if (normalized === "record not found") return "Invalid OTP";
    if (normalized.length > 0) return message as string;
    return unexpectedError;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await request(
        url,
        {
          email: email as string,
          otp,
          client: "mobile",
        },
        { withCredentials: true },
      );
      if (response.status === HTTP_STATUS.OK && response?.data.success) {
        const headerToken = (() => {
          const authHeader = response.headers?.authorization ?? response.headers?.Authorization;
          if (typeof authHeader === "string" && authHeader.toLowerCase().startsWith("bearer ")) {
            return authHeader.slice(7);
          }
          return null;
        })();

        let accessToken =
          extractToken(response.data?.data) ?? extractToken(response.data) ?? headerToken ?? extractToken(response);

        try {
          let refreshResp: unknown;
          try {
            refreshResp = await authAxiosInstance.get(withApiBasePath("/access_token"));
          } catch (err) {
            refreshResp = await authAxiosInstance.post(withApiBasePath("/refresh"), {});
          }
          const refreshed = (() => {
            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const resp = refreshResp as any;
              return extractToken(resp?.data?.data) ?? extractToken(resp?.data) ?? null;
            } catch {
              return null;
            }
          })();
          if (refreshed) {
            accessToken = refreshed;
          }
        } catch (refreshError) {
          console.warn("[AccountVerification] Token refresh after verification failed", refreshError);
        }

        if (accessToken) {
          setAuthToken(accessToken);
          toast("Account successfully verified.", {
            status: "success",
            message: response.data?.data?.message ?? response.data?.message ?? "",
          });
          reset();
          router.replace(withBasePath(ROUTES.PLATFORM.PAGE.DASHBOARD));
          return;
        }

        toast("Account verified but session missing", {
          status: "error",
          message: "Verification succeeded but we could not establish a session. Please login manually.",
        });
        setStep("registrationSuccess");
      } else {
        // if success is false
        toast("Account verification failed", {
          status: "error",
          message: getOtpErrorMessage(response.data?.message),
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<AuthServiceError>;
        const backendMessage =
          axiosError.response?.data?.error?.message ?? (axiosError.response?.data as { message?: string })?.message;
        toast("", {
          status: "error",
          message: getOtpErrorMessage(backendMessage),
        });
      } else {
        toast("", {
          status: "error",
          message: unexpectedError,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <div className="flex flex-col gap-[20px]">
        <FormHeading>Confirm your email</FormHeading>
        <FormSubheading>
          We have sent a code to your email
          {email ? <span className="text-brand-primary"> {email}</span> : null}. The code will expire in 10 minutes.
        </FormSubheading>
      </div>

      {/* form */}
      <form className="flex w-full flex-col gap-[20px] lg:gap-[40px]" onSubmit={handleSubmit}>
        {/* OTP input */}
        <PinInput
          className="flex justify-center"
          length={OTP.length}
          pin={otp}
          onChange={(value: string) => setOTP(value)}
          pinInputFieldProps={{
            className:
              "h-10 w-10 bg-white text-sm text-brand-gray placeholder:text-brand-gray/50 placeholder:text-sm shadow-sm",
          }}
        />

        <div className="flex flex-col gap-[20px]">
          <PrimaryButton type="submit" isDisabled={isDisabled} isLoading={isSubmitting}>
            Submit
          </PrimaryButton>
          <ResendOTP />
          <ContactUs />
        </div>
      </form>
    </Card>
  );
};

export default AccountVerification;
