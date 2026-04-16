"use client";
import React from "react";
import RegistrationForm from "./_components/form-steps/step-1-registration-form";
import AccountVerification from "./_components/form-steps/step-2-account-verification";
import RegistrationSuccess from "./_components/form-steps/step-3-registration-success";
import { useRegistrationStore } from "@/store/registration";
import useBanner from "@/hooks/use-banner";

const RegisterPageClient = () => {
  // dynamic banner
  useBanner();

  const registrationStep = useRegistrationStore((state) => state.step);

  switch (registrationStep) {
    case "registrationForm":
      return <RegistrationForm />;
    case "accountVerification":
      return <AccountVerification />;
    case "registrationSuccess":
      return <RegistrationSuccess />;
    default:
      return null;
  }
};

export default RegisterPageClient;
