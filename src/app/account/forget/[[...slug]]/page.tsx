import React from "react";
import { Metadata } from "next";
import ForgotPasswordPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Recover your account",
};

const ForgotPasswordPage = () => {
  return <ForgotPasswordPageClient />;
};

export default ForgotPasswordPage;
