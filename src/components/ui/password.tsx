"use client";
import { Password as DefaultPassword, PasswordProps, tx } from "@zeeve-platform/ui";
import React, { forwardRef } from "react";

const Password = forwardRef<HTMLInputElement, PasswordProps>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <DefaultPassword
      ref={ref}
      className={tx(
        "h-10 bg-white text-sm text-brand-gray placeholder:text-brand-gray/50 placeholder:text-sm shadow-sm pl-5 pr-10 py-2.5",
        className,
      )}
      iconRightContainerProps={{
        className: "*:text-brand-gray/50",
      }}
      placeholder="********"
      {...rest}
    />
  );
});

Password.displayName = "Password";

export default Password;
