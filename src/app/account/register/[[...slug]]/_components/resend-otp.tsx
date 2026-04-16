"use client";
import React, { useEffect, useState } from "react";
import { useToast } from "@zeeve-platform/ui";
import axios, { AxiosError } from "axios";
import { useRegistrationStore } from "@/store/registration";
import OTP from "@/constants/otp";
import HTTP_STATUS from "@/constants/http";
import useAuthService from "@/services/auth/use-auth-service";
import { AuthServiceError } from "@/services/auth/types";
import { SecondaryButton } from "@/components/ui/button";
import { unexpectedError } from "@/constants/error";

const ResendOTP = () => {
  const [otpSentCount, setOTPSentCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [minutes, setMinutes] = useState(9);
  const [seconds, setSeconds] = useState(59);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  const { registrationForm, accountVerification } = useRegistrationStore();
  const email = registrationForm?.email ?? accountVerification?.email;

  const { request, url } = useAuthService().resendOTP();
  const toast = useToast();

  const handleResendOTP = async () => {
    try {
      if (otpSentCount < OTP.maxResendCount) {
        setIsSubmitting(true);

        const response = await request(url, { email: email as string, client: "mobile" });

        if (response?.status === HTTP_STATUS.OK) {
          toast("New OTP sent.", {
            status: "success",
            message: "Please check your email for new verification code.",
          });
          setOTPSentCount((count) => count + 1);
          setMinutes(9);
          setSeconds(59);
        }
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
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center lg:flex-row lg:justify-between">
      {seconds > 0 || minutes > 0 ? (
        <p className="text-xs text-brand-gray lg:text-sm">
          Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </p>
      ) : (
        <p className="text-xs text-brand-gray lg:text-sm">
          {otpSentCount === OTP.maxResendCount ? "Exceeded maximum OTP requests." : "Didn't receive OTP?"}
        </p>
      )}

      <SecondaryButton
        type="button"
        isDisabled={otpSentCount === OTP.maxResendCount || seconds > 0 || minutes > 0}
        onClick={handleResendOTP}
        isLoading={isSubmitting}
      >
        Resend OTP
      </SecondaryButton>
    </div>
  );
};

export default ResendOTP;
