"use client";
import { Input as DefaultInput, InputProps, tx } from "@zeeve-platform/ui";
import React, { forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <DefaultInput
      ref={ref}
      className={tx(
        "h-10 bg-white text-sm text-brand-gray placeholder:text-brand-gray/50 placeholder:text-sm shadow-sm px-5 py-2.5",
        className,
      )}
      {...rest}
    />
  );
});

Input.displayName = "Input";

export default Input;
