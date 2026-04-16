"use client";
import { Heading } from "@zeeve-platform/ui";
import React, { PropsWithChildren } from "react";

const FormHeading = ({ children }: PropsWithChildren) => {
  return (
    <Heading as="h2" className="text-xl font-medium leading-none text-brand-primary lg:text-[28px]">
      {children}
    </Heading>
  );
};

export default FormHeading;
