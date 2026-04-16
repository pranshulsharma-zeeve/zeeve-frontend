import { Button, ButtonProps, tx } from "@zeeve-platform/ui";
import React, { forwardRef } from "react";

const PrimarySolidButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, children, ...rest } = props;

  return (
    <Button className={tx("rounded bg-brand-primary text-xs text-white font-sans", className)} {...rest} ref={ref}>
      {children}
    </Button>
  );
});

PrimarySolidButton.displayName = "PrimarySolidButton";

const SecondarySolidButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, children, ...rest } = props;

  return (
    <Button className={tx("rounded bg-brand-secondary text-xs text-white font-sans", className)} {...rest} ref={ref}>
      {children}
    </Button>
  );
});

SecondarySolidButton.displayName = "SecondarySolidButton";

const PrimaryOutlinedButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, children, ...rest } = props;

  return (
    <Button
      className={tx("rounded border border-brand-primary bg-white text-xs text-brand-primary font-sans", className)}
      {...rest}
      ref={ref}
    >
      {children}
    </Button>
  );
});

PrimaryOutlinedButton.displayName = "PrimaryOutlinedButton";

const SecondaryOutlinedButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, children, ...rest } = props;

  return (
    <Button
      className={tx("rounded border border-brand-outline bg-white text-xs text-brand-blue-gray font-sans", className)}
      {...rest}
      ref={ref}
    >
      {children}
    </Button>
  );
});

SecondaryOutlinedButton.displayName = "SecondaryOutlinedButton";

export { PrimarySolidButton, SecondarySolidButton, PrimaryOutlinedButton, SecondaryOutlinedButton };
