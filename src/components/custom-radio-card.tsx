"use client";
import React from "react";
import Image from "next/image";
import { tx } from "@zeeve-platform/ui";

const selectedStyle = {
  background: "linear-gradient(284.49deg, rgba(24, 50, 174, 0.1) 34.91%, rgba(88, 117, 255, 0.1) 103.05%)",
  border: "1px solid transparent",
  borderImageSource: "linear-gradient(284.49deg, #1832AE 34.91%, #5875FF 103.05%)",
  borderImageSlice: 1,
};

const CustomRadioCard = ({
  value,
  isChecked,
  className,
  onSelect,
  children,
}: {
  value: string;
  isChecked: boolean;
  className?: string;
  onSelect: (val: string) => void;
  children: React.ReactNode;
}) => {
  return (
    <div
      role="radio"
      aria-checked={isChecked}
      tabIndex={0}
      className={tx(
        `col-span-12 flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all lg:col-span-6 
      `,
        className,
      )}
      style={isChecked ? selectedStyle : {}}
      onClick={() => onSelect(value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect(value);
        }
      }}
    >
      <span>{children}</span>

      {/* Show tick image if selected */}
      {isChecked && <Image src="/tick-circle.svg" alt="Selected" className="size-6" width={24} height={24} />}

      {/* Hidden Radio Input */}
      <input type="radio" value={value} checked={isChecked} onChange={() => {}} className="hidden" />
    </div>
  );
};

export default CustomRadioCard;
