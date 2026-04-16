import React, { Suspense } from "react";
import { Metadata } from "next";
import ResetPasswordPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset password of your account",
};

const ResetPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0B1220]/5 text-sm font-medium text-[#4B5365]">
          Loading reset form...
        </div>
      }
    >
      <ResetPasswordPageClient />
    </Suspense>
  );
};

export default ResetPasswordPage;
