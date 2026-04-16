import { IconButton, IconButtonProps, tx } from "@zeeve-platform/ui";
import React, { forwardRef } from "react";

const SecondarySolidIconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const { className, children, ...rest } = props;

  return (
    <IconButton {...rest} className={tx("rounded bg-brand-secondary text-xs text-white", className)} ref={ref}>
      {children}
    </IconButton>
  );
});

SecondarySolidIconButton.displayName = "SecondarySolidIconButton";

const SecondaryOutlinedIconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const { className, children, ...rest } = props;

  return (
    <IconButton
      {...rest}
      className={tx("rounded border border-[#A1A7C0] bg-white text-xs text-brand-blue-gray", className)}
      ref={ref}
    >
      {children}
    </IconButton>
  );
});

SecondaryOutlinedIconButton.displayName = "SecondaryOutlinedIconButton";

export { SecondarySolidIconButton, SecondaryOutlinedIconButton };
