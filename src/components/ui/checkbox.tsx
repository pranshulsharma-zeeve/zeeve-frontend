"use client";
import React, { forwardRef } from "react";
import { Checkbox as DefaultCheckbox, CheckboxProps, tx } from "@zeeve-platform/ui";

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <DefaultCheckbox
      ref={ref}
      className={tx("h-[18px] w-[18px]", className)}
      checkboxLabelProps={{
        className: "text-sm font-normal text-brand-gray gap-x-2.5 items-start",
      }}
      {...rest}
    />
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;
