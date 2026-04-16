import { DropdownMenuItem, DropdownMenuItemProps, tx } from "@zeeve-platform/ui";
import React, { forwardRef } from "react";

const EWXDropdownMenuItem = forwardRef<HTMLButtonElement, DropdownMenuItemProps & { selected?: boolean }>(
  (props, ref) => {
    const { children, className, ...rest } = props;

    return (
      <DropdownMenuItem
        className={tx("text-xs font-sans hover:bg-[#252E4B] focus:ring-0 focus:ring-offset-0", className)}
        ref={ref}
        {...rest}
      >
        {children}
      </DropdownMenuItem>
    );
  },
);

EWXDropdownMenuItem.displayName = "EWXDropdownMenuItem";

export default EWXDropdownMenuItem;
