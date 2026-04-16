import { Heading, tx } from "@zeeve-platform/ui";
import React, { PropsWithChildren } from "react";
import Breadcrumb, { BreadcrumbProps } from "./breadcrumb";

interface NavigationProps extends PropsWithChildren {
  heading?: string | React.ReactElement;
  logo?: React.ReactElement;
  sub_heading?: string;
  breadcrumb?: BreadcrumbProps;
  className?: string;
}

const Navigation = ({ heading, logo, breadcrumb, sub_heading, children, className }: NavigationProps) => {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-baseline lg:justify-between lg:gap-6">
      <div className="flex flex-row items-center gap-3">
        {/* {logo ? (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-brand-outline p-2">
            {logo}
          </div>
        ) : null} */}
        {/** Add gap-0 if there is sub_heading */}
        <div className={tx("flex flex-col gap-1", className)}>
          <Heading as="h4">{heading}</Heading>
          {sub_heading && <p className="text-xs font-light text-black">{sub_heading}</p>}
          {breadcrumb ? <Breadcrumb {...breadcrumb} /> : null}
        </div>
      </div>
      {/* children element to be rendered on left side */}
      {children}
    </div>
  );
};

export default Navigation;
