"use client";

import { Skeleton } from "@zeeve-platform/ui";
import InfoCardsGrid from "@/components/info-cards-grid";
import CopyButton from "@/components/vizion/copy-button";
import { toShortString } from "@/utils/helpers";

interface Metric {
  label: string;
  value: string;
}

interface MetricsGridProps {
  metrics: Metric[];
  isLoading?: boolean;
  validatorAddress?: string | null;
  showValidatorAddress?: boolean;
}

const MetricsGrid = ({
  metrics,
  isLoading = false,
  validatorAddress,
  showValidatorAddress = false,
}: MetricsGridProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-xl font-medium text-[#09122D]">Key Metrics</h3>
        {showValidatorAddress && (
          <div className="flex items-center gap-4">
            {isLoading ? (
              <Skeleton role="status" as="div" className="h-10 w-52 rounded bg-gray-200" />
            ) : (
              validatorAddress && (
                <div className="flex items-center gap-2 rounded-lg border bg-[#F5F5F5] px-3 py-1">
                  <span className="text-sm font-normal text-[#696969]">Validator Address:</span>
                  <span className="text-sm font-normal text-[#09122D]">
                    {toShortString(validatorAddress, 15, 0) || "—"}
                  </span>
                  <CopyButton text={validatorAddress} />
                </div>
              )
            )}
          </div>
        )}
      </div>
      <InfoCardsGrid title="" items={metrics} isLoading={isLoading} columns="5" />
    </div>
  );
};

export type { Metric };
export default MetricsGrid;
