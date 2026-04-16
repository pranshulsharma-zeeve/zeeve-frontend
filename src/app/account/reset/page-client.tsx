"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResetPasswordForm from "./_components/form-steps/step-1-reset-password-form";
import ResetPasswordSuccess from "./_components/form-steps/step-2-reset-password-success";
import { useResetPasswordStore } from "@/store/reset-password";
import ROUTES from "@/routes";
import useBanner from "@/hooks/use-banner";

const ResetPasswordPageClient = () => {
  // dynamic banner
  useBanner();

  // get "token" query string
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  // redirect to forgot password when token is missing
  useEffect(() => {
    if (!token) {
      router.replace(ROUTES.AUTH.PAGE.FORGOT_PASSWORD);
    }
  }, [router, token]);

  const resetPasswordStep = useResetPasswordStore((state) => state.step);

  if (!token) {
    return null;
  }

  switch (resetPasswordStep) {
    case "resetPasswordForm":
      return <ResetPasswordForm />;
    case "resetPasswordSuccess":
      return <ResetPasswordSuccess />;
    default:
      return null;
  }
};

export default ResetPasswordPageClient;
