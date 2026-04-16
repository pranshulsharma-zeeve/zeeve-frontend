"use client";
import React from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { Breadcrumb as ZeeveBreadcrumb, BreadcrumbItem } from "@zeeve-platform/ui";

interface BreadcrumbProps {
  items: {
    label: string | React.ReactNode;
    href: string;
    onClick?: () => void;
    isActive?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    as?: React.ElementType<any>;
  }[];
}

const Breadcrumb = (props: BreadcrumbProps) => {
  const { items } = props;

  const pathname = usePathname();

  return (
    <ZeeveBreadcrumb className="flex-wrap text-sm lg:gap-1.5" activeLink={pathname}>
      {items.length
        ? items.map((item) => {
            const Component = item.as ?? NextLink;
            return (
              <BreadcrumbItem
                key={typeof item.label === "string" ? item.label : item.href}
                as={Component}
                href={item.href}
                onClick={item.onClick}
                isActive={item.isActive}
              >
                {item.label}
              </BreadcrumbItem>
            );
          })
        : null}
    </ZeeveBreadcrumb>
  );
};

export type { BreadcrumbProps };
export default Breadcrumb;
