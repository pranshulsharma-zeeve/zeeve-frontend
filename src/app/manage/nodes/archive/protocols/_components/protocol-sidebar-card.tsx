/* eslint-disable tailwindcss/no-custom-classname */
"use client";
import { Card, Heading } from "@zeeve-platform/ui";
import React, { ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import { capitalizeFirstLetter } from "@/utils/helpers";

interface ProtocolsListSidebarCardProps extends ComponentPropsWithoutRef<"div"> {
  protocolId: string;
  protocolName: string;
  isFocused: boolean;
  isLoading: boolean;
  onCardFocus: (id: string, name: string) => void;
  iconSrc?: string;
}

const ProtocolsListSidebarCard = ({
  protocolId,
  protocolName,
  isFocused,
  onCardFocus,
  iconSrc,
}: ProtocolsListSidebarCardProps) => {
  return (
    <Card
      className={`flex h-[60px] flex-row items-center gap-[12px] rounded-[8px]
       border-0 px-[16px] py-[12px] hover:cursor-pointer
      ${isFocused ? "bg-white" : "bg-transparent hover:bg-[#C5CBEA]"} `}
      onClick={() => onCardFocus(protocolId, protocolName)}
      tabIndex={0}
    >
      {iconSrc ? (
        <Image src={iconSrc} alt={`${protocolName} Icon`} width={32} height={32} unoptimized />
      ) : (
        <div className="flex size-8 items-center justify-center rounded-full bg-brand-archive text-sm font-semibold text-white">
          {protocolName.charAt(0).toUpperCase()}
        </div>
      )}
      <Heading as={"h5"} className="text-[16px] font-medium leading-[24px] text-brand-mainnet">
        {capitalizeFirstLetter(protocolName ?? "NA")}
      </Heading>
    </Card>
  );
};

export { ProtocolsListSidebarCard };
