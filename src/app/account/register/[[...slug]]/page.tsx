import React from "react";
import { Metadata } from "next";
import RegisterPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a Zeeve account",
};

const RegisterPage = () => {
  return <RegisterPageClient />;
};

export default RegisterPage;
