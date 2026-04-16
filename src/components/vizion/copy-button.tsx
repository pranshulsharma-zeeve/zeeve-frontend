"use client";
import React, { forwardRef, useState } from "react";
import { IconCopy, IconCopyCheck } from "@zeeve-platform/icons/design-tool/outline";
import Image from "next/image";

import { IconButton, IconButtonProps, RemoveProperties, Tooltip, tx } from "@zeeve-platform/ui";
import { useUserStore } from "@/store/user";
import { withBasePath } from "@/utils/helpers";

interface CopyButtonProps extends RemoveProperties<IconButtonProps, "children" | "size"> {
  text: string;
}

const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>((props, ref) => {
  const { text, className, ...rest } = props;

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const handleCopyButtonClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsCopied(false);
    }
  };

  return (
    <div className="group relative inline-flex flex-col items-center">
      {/* Tooltip image */}
      {!isCopied && (
        <div className="pointer-events-none absolute -top-10 left-1/2 z-20 mb-1 h-14 w-20 -translate-x-1/2 opacity-0 transition-opacity duration-100 group-hover:opacity-100">
          <Image
            src={withBasePath("/assets/images/vizion/copy-tooltip.svg")}
            alt="Tooltip"
            width={80}
            height={56}
            className="drop-shadow-md"
          />
        </div>
      )}

      {/* Tooltip image - copied state */}
      {isCopied && (
        <div className="pointer-events-none absolute -top-10 left-1/2 z-20 mb-1 h-14 w-20 -translate-x-1/2 opacity-0 transition-opacity duration-100 group-hover:opacity-100">
          <Image
            src={withBasePath("/assets/images/vizion/copied-tooltip.svg")}
            alt="Copied Tooltip"
            width={80}
            height={56}
            className="drop-shadow-md"
          />
        </div>
      )}

      {/* Copy button */}
      <IconButton
        variant="text"
        className={tx("rounded-md text-sm lg:text-base text-theme-gray focus:ring-0 focus:ring-offset-0", className, {
          "text-green-500": isCopied,
        })}
        onClick={handleCopyButtonClick}
        ref={ref}
        {...rest}
      >
        {!isCopied ? <IconCopy /> : <IconCopyCheck />}
      </IconButton>
    </div>
  );
});

CopyButton.displayName = "CopyButton";

export default CopyButton;
