"use client";
import React from "react";
import { Card } from "@zeeve-platform/ui";

interface EmptyStateProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const EmptyState = ({ title, description, actions }: EmptyStateProps) => {
  return (
    <Card className="flex flex-col items-center gap-3 p-10 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      {description ? <p className="max-w-prose text-sm opacity-80">{description}</p> : null}
      {actions}
    </Card>
  );
};

export default EmptyState;
