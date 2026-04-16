"use client";
import React from "react";
import FormSubheading from "./form-subheading";
import { getConfig } from "@/config";

const ContactUs = () => {
  const config = getConfig();
  const supportEmail = config.other?.supportEmail ?? "support@zeeve.io";

  return (
    <FormSubheading>
      Need help?{" "}
      <a href={`mailto:${supportEmail}`} className="font-semibold text-brand-primary">
        Contact us
      </a>
    </FormSubheading>
  );
};

export default ContactUs;
