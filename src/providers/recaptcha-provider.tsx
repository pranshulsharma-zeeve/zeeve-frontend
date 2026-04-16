"use client";
import React, { PropsWithChildren } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { getConfig } from "@/config";

const FALLBACK_RECAPTCHA_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Google test key

const ReCaptchaProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const config = getConfig();
  const siteKey = config.reCaptcha?.siteKey || FALLBACK_RECAPTCHA_KEY;
  const isEnabled = config.reCaptcha?.enabled ?? true;

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey} useEnterprise>
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default ReCaptchaProvider;
