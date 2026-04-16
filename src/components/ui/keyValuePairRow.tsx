"use client";
import React, { JSXElementConstructor, ReactElement } from "react";
import { tx, CopyButton } from "@zeeve-platform/ui";
import { toShortString } from "@/utils/helpers";

interface KeyValuePairRowProps {
  title: string;
  value: string | ReactElement<unknown, string | JSXElementConstructor<unknown>>;
  isCopy?: boolean;
  isLoading: boolean;
  className?: string;
}

const KeyValuePairRow = ({ title, value, isCopy, isLoading, className }: KeyValuePairRowProps) => {
  return isLoading ? (
    <div className="h-3 w-full rounded  bg-slate-200"></div>
  ) : (
    <div
      className={tx(
        "col-span-12 flex flex-row items-center justify-between text-xs lg:col-span-6 lg:text-sm",
        className,
      )}
    >
      <span className="text-brand-gray">{title}</span>
      <div className="flex items-center gap-1">
        {typeof value === "string" && value.length > 30 ? toShortString(value) : value}
        {isCopy ? <CopyButton text={value.toString()} className="text-base" /> : null}
      </div>
    </div>
  );
};

export default KeyValuePairRow;
