"use client";
import React from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { Breadcrumb as ZeeveBreadcrumb, BreadcrumbItem } from "@zeeve-platform/ui";

interface BreadcrumbProps {
  items: {
    label: string | React.ReactElement;
    href: string;
    onClick?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    as?: React.ElementType<any>;
    isActive?: boolean;
  }[];
}

const Breadcrumb = (props: BreadcrumbProps) => {
  const { items } = props;

  const pathname = usePathname();

  return (
    <ZeeveBreadcrumb className="flex-wrap gap-3 text-xs text-[#696969]" activeLink={pathname} separator={"/"}>
      {items.length
        ? items.map((item, index) => {
            const Component = item.as ?? NextLink;
            return (
              <BreadcrumbItem
                isActive={item.isActive}
                key={index}
                separator={"/"}
                as={Component}
                href={item.href}
                onClick={item.onClick}
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
