"use client";
import React from "react";
import { CopyButton } from "@zeeve-platform/ui";
import { truncateMiddle } from "@/utils/helpers";

interface TruncatedAddressProps {
  address: string;
  maxLength?: number;
  className?: string;
  textClassName?: string;
  color?: string;
}

const TruncatedAddress = ({
  address,
  maxLength = 20,
  className = "",
  textClassName = "",
  color,
}: TruncatedAddressProps) => {
  if (!address || address === "0") {
    return <span className={textClassName}>NA</span>;
  }

  const truncated = truncateMiddle(address, maxLength);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={textClassName}>{truncated}</span>
      <CopyButton text={address} className={color} />
    </div>
  );
};

export default TruncatedAddress;
