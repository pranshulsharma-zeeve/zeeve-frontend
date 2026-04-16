"use client";

import Link from "next/link";
import { Card, StatusIcon, tx } from "@zeeve-platform/ui";

interface NoNodesBannerProps {
  message: string;
  href: string;
  ctaLabel?: string;
  className?: string;
}

const NoNodesBanner = ({ message, href, ctaLabel = "Purchase subscription", className }: NoNodesBannerProps) => {
  return (
    <Card
      className={tx(
        "flex w-full items-start gap-4 rounded-2xl border border-[#FAD200]/40 bg-gradient-to-r from-[#FFFBEB] via-white to-[#FFF6D4] px-6 py-4 shadow-[0_8px_24px_rgba(250,210,0,0.15)]",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#FEF08A] text-[#CA8A04]">
          <StatusIcon status="warning" className="text-xl" />
        </div>
        <div className="flex flex-col gap-1 text-sm leading-relaxed text-[#0B1220]">
          <p className="text-base font-semibold">{message}</p>
          <p className="text-[13px] text-[#4B5563]">
            Provision a Node to start collecting Health Metrics and unlock Tailored Insights.
          </p>
        </div>
      </div>
      <Link
        href={href}
        className="ml-auto inline-flex w-fit items-center rounded-full bg-[#1D4ED8] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#1A3FB5]"
      >
        {ctaLabel}
      </Link>
    </Card>
  );
};

NoNodesBanner.displayName = "NoNodesBanner";

export type { NoNodesBannerProps };
export { NoNodesBanner };
