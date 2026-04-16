"use client";
import React from "react";
import { Card } from "@zeeve-platform/ui";

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const SectionCard = ({ title, subtitle, actions, className, children }: SectionCardProps) => {
  return (
    <Card className={className ?? "p-4 md:p-6"}>
      {(title || actions) && (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title ? <h3 className="text-lg font-semibold">{title}</h3> : null}
            {subtitle ? <p className="text-sm opacity-80">{subtitle}</p> : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      )}
      {children}
    </Card>
  );
};

export default SectionCard;
