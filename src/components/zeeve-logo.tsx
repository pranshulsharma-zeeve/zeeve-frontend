"use client";
import React from "react";
import { tx } from "@zeeve-platform/ui";
import Image from "next/image";
import { withBasePath } from "@/utils/helpers";

interface ZeeveLogoProps {
  className?: string;
}

const ZeeveLogo = ({ className }: ZeeveLogoProps) => {
  return (
    <Image
      src={withBasePath("/assets/images/zeeve/zeeve-logo-on-light-bg.svg")}
      alt="Zeeve logo"
      width={0}
      height={0}
      className={tx("h-12 w-[85px] lg:h-[60px]", className)}
    />
  );
};

export default ZeeveLogo;
