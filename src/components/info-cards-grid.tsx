"use client";

import { Card, Skeleton } from "@zeeve-platform/ui";
import type { ReactNode } from "react";

interface InfoCard {
  label: string;
  value: ReactNode;
  helper?: string;
}

interface InfoCardsGridProps {
  title: string;
  items: InfoCard[];
  isLoading?: boolean;
  columns?: "2" | "3" | "4" | "5";
  enableCardHoverEffect?: boolean;
}

const renderSkeletonCard = (index: number, hasHelper?: boolean) => (
  <Card
    key={`skeleton-${index}`}
    className="flex flex-col gap-3 rounded-2xl border border-[#E2E6F3] bg-gradient-to-br from-[#F8FAFF] via-white to-[#EEF2FF] p-4 shadow-sm"
  >
    <Skeleton role="status" as="div" className="h-6 w-24 rounded bg-gray-200" />
    {hasHelper && <Skeleton role="status" as="div" className="h-3 w-16 rounded bg-gray-200" />}
    <Skeleton role="status" as="div" className="h-4 w-32 rounded bg-gray-200" />
  </Card>
);

const InfoCardsGrid = ({
  title,
  items,
  isLoading = false,
  columns = "5",
  enableCardHoverEffect = false,
}: InfoCardsGridProps) => {
  const skeletonCount = items.length > 0 ? items.length : 6;
  const hasHelper = items.some((item) => item.helper);

  const gridColsClass = {
    "2": "md:grid-cols-2",
    "3": "md:grid-cols-3",
    "4": "md:grid-cols-2 xl:grid-cols-4",
    "5": "md:grid-cols-2 xl:grid-cols-5",
  }[columns];

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-medium text-[#09122D]">{title}</h3>
      <div className={`grid grid-cols-1 gap-4 ${gridColsClass}`}>
        {isLoading
          ? Array.from({ length: skeletonCount }, (_, index) => renderSkeletonCard(index, hasHelper))
          : items.map((item, index) => (
              <Card
                key={item.label ?? index}
                className={`flex flex-col gap-3 rounded-2xl border border-[#E2E6F3] bg-gradient-to-br from-[#F8FAFF] via-white to-[#EEF2FF] p-4 shadow-sm ${
                  enableCardHoverEffect
                    ? "transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CCD5EF] hover:shadow-md"
                    : ""
                }`}
              >
                <div className="text-lg font-semibold text-[#09122D]">{item.value}</div>
                {item.helper ? <span className="text-xs text-[#7D809C]">{item.helper}</span> : null}
                <div className="text-sm font-medium text-[#5C5F80]">{item.label}</div>
              </Card>
            ))}
      </div>
    </div>
  );
};

export type { InfoCard };
export default InfoCardsGrid;
