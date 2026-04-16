"use client";

import React from "react";
import Image from "next/image";
import { tx } from "@zeeve-platform/ui";
import { withBasePath } from "@/utils/helpers";

interface EmptyStateCardProps {
  title: string;
  description: string;
  descriptionBold?: string;
  imageSrc: string;
  className?: string;
  variant?: "subscriptions" | "alerts";
}

const EmptyStateCard = ({ title, description, descriptionBold, imageSrc, className, variant }: EmptyStateCardProps) => {
  const basePath = "/assets/images/dashboard-v2";
  const showDecorations = variant === "subscriptions" || variant === "alerts";
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-[#0E2B6E] dark:text-white">{title}</p>
      <div
        className={tx(
          "relative flex min-h-[200px] items-center justify-between gap-6 overflow-hidden rounded-2xl border border-[#E4EBF8] bg-white px-8 py-8 shadow-sm dark:border-white/10 dark:bg-[var(--surface-1-dark)]",
          className,
        )}
      >
        <div className="flex-1">
          {descriptionBold && <p className="text-base font-bold text-[#0E2B6E] dark:text-white">{descriptionBold}</p>}
          <p className="mt-2 text-sm font-normal leading-normal text-[#0E2B6E] dark:text-slate-300">{description}</p>
        </div>
        <div className="relative flex size-20 items-center justify-center">
          {showDecorations ? (
            <>
              <Image
                src={withBasePath(`${basePath}/outer-circle.svg`)}
                alt=""
                width={96}
                height={96}
                className="absolute inset-0 m-auto size-24 object-contain"
              />
              <Image
                src={withBasePath(`${basePath}/mid-circle.png`)}
                alt=""
                width={86}
                height={86}
                className="absolute inset-0 m-auto h-[86px] w-[86px] object-contain"
              />
              <Image
                src={withBasePath(`${basePath}/inner-circle.png`)}
                alt=""
                width={70}
                height={70}
                className="absolute inset-0 m-auto h-[70px] w-[70px] object-contain"
              />
            </>
          ) : null}
          {variant === "subscriptions" ? (
            <>
              <Image
                src={withBasePath(`${basePath}/empty-subsciptions.png`)}
                alt="Empty subscriptions"
                width={72}
                height={72}
                className="relative h-[72px] w-[72px] object-contain"
              />
            </>
          ) : variant === "alerts" ? (
            <>
              <Image
                src={withBasePath(`${basePath}/alert.png`)}
                alt="Alerts"
                width={80}
                height={80}
                className="relative z-10 h-[80px] w-[80px] object-contain"
              />
              <Image
                src={withBasePath(`${basePath}/alert-left.png`)}
                alt=""
                width={18}
                height={18}
                className="absolute left-1 top-4 z-20 h-4 w-4 object-contain"
              />
              <Image
                src={withBasePath(`${basePath}/alert-right.png`)}
                alt=""
                width={22}
                height={22}
                className="absolute right-0 top-2 z-20 h-5 w-5 object-contain"
              />
            </>
          ) : (
            <div className="flex size-16 items-center justify-center rounded-2xl border border-[#E6EDF8] bg-[#F5F8FF] shadow-sm dark:border-white/10 dark:bg-[var(--surface-2-dark)]">
              <Image
                src={withBasePath(imageSrc)}
                alt={title}
                width={44}
                height={44}
                className="max-h-32 object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmptyStateCard;
