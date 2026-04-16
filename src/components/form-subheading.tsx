"use client";
import React, { PropsWithChildren } from "react";

const FormSubheading = ({ children }: PropsWithChildren) => {
  return <p className="text-sm font-normal leading-none text-brand-gray lg:text-lg">{children}</p>;
};

export default FormSubheading;
