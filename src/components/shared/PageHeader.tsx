"use client";
import React from "react";
import Link from "next/link";
import { Z4Navigation } from "@zeeve-platform/ui";

export interface BreadcrumbItem {
  href: string;
  label: string;
  isActive?: boolean;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

const PageHeader = ({ title, breadcrumbs, actions }: PageHeaderProps) => {
  const items = (breadcrumbs ?? []).map((b) => ({
    href: b.href,
    label: b.label,
    isActive: b.isActive ?? false,
    as: Link,
  }));
  return (
    <Z4Navigation heading={<span>{title}</span>} breadcrumb={{ items }}>
      {actions}
    </Z4Navigation>
  );
};

export default PageHeader;
