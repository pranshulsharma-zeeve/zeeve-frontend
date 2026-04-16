"use client";
import { Button, ButtonProps, tx } from "@zeeve-platform/ui";
import React, { forwardRef } from "react";

const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <Button ref={ref} className={tx("h-10 lg:h-[56px] rounded px-5 py-3 text-lg font-semibold", className)} {...rest} />
  );
});

const SecondaryButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <Button
      ref={ref}
      variant="text"
      className={tx("h-10 lg:h-[56px] rounded text-sm lg:text-base font-semibold", className)}
      {...rest}
    />
  );
});

PrimaryButton.displayName = "PrimaryButton";
SecondaryButton.displayName = "SecondaryButton";

export { PrimaryButton, SecondaryButton };
