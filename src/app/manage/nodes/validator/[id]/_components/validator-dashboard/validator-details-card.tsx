import { Card as UiCard, Skeleton, Tooltip } from "@zeeve-platform/ui";
import type { ReactNode } from "react";
import CopyButton from "@/components/vizion/copy-button";
import { toShortString } from "@/utils/helpers";

const StatusBadge = ({
  active,
  activeLabel,
  inactiveLabel,
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
}) => {
  return (
    <span
      className={`mr-1 rounded-md px-3 py-1 text-xs font-medium ${
        active
          ? "border border-brand-green bg-green-100 text-brand-green"
          : "border border-brand-red bg-red-100 text-brand-red"
      }`}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
};

export { StatusBadge };

interface ValidatorDetailsCardProps {
  fields: { label: string; value: ReactNode }[];
  validatorAddress?: string | null;
  delegationAddress?: string | null;
  peerId?: string | null;
  isLoading?: boolean;
}

const renderSkeletonCard = (index: number) => (
  <UiCard
    key={`skeleton-${index}`}
    className="flex flex-col gap-3 rounded-2xl border border-[#E2E6F3] bg-gradient-to-br from-[#F8FAFF] via-white to-[#EEF2FF] p-4 shadow-sm"
  >
    <Skeleton role="status" as="div" className="h-6 w-24 rounded bg-gray-200" />
    <Skeleton role="status" as="div" className="h-4 w-32 rounded bg-gray-200" />
  </UiCard>
);

const ValidatorDetailsCard = ({
  fields,
  validatorAddress,
  delegationAddress,
  peerId,
  isLoading = false,
}: ValidatorDetailsCardProps) => {
  const skeletonCount = fields.length > 0 ? fields.length : 6;

  const renderAddressSection = (label: string, value?: string | null) => (
    <div className="flex items-center gap-2 rounded-lg border bg-[#F5F5F5] px-3 py-1">
      <span className="text-sm font-normal text-[#696969]">{label}:</span>
      <span className="text-sm font-normal text-[#09122D]">{toShortString(value ?? "", 15, 0) || "—"}</span>
      <CopyButton text={value ?? ""} />
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-xl font-medium text-[#09122D]">Validator Details</h3>
        <div className="flex flex-wrap items-center gap-4">
          {isLoading ? (
            <>
              <Skeleton role="status" as="div" className="h-10 w-52 rounded bg-gray-200" />
              <Skeleton role="status" as="div" className="h-10 w-52 rounded bg-gray-200" />
            </>
          ) : (
            <>
              {!peerId ? renderAddressSection("Delegation Address", delegationAddress) : null}
              {peerId
                ? renderAddressSection("Peer ID", peerId)
                : renderAddressSection("Validator Address", validatorAddress)}
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {isLoading
          ? Array.from({ length: skeletonCount }, (_, index) => renderSkeletonCard(index))
          : fields.map((field, index) => {
              const isTruncatable = field.label === "Website" || field.label === "Description";
              const rawValue = typeof field.value === "string" ? field.value : undefined;
              const hasValue = rawValue && rawValue !== "N/A";
              const isLong =
                typeof rawValue === "string" &&
                (field.label === "Website" ? rawValue.length > 28 : rawValue.length > 60);

              const truncatedValue =
                typeof rawValue === "string" ? <span className="block truncate">{rawValue}</span> : field.value;

              const valueNode =
                isTruncatable && hasValue && isLong ? (
                  <Tooltip text={rawValue} placement="top">
                    <span className="block">{truncatedValue}</span>
                  </Tooltip>
                ) : (
                  truncatedValue
                );

              return (
                <UiCard
                  key={field.label ?? index}
                  className="flex flex-col justify-between gap-3 rounded-2xl border border-[#E2E6F3] bg-gradient-to-br from-[#F8FAFF] via-white to-[#EEF2FF] p-4 shadow-sm"
                >
                  <div className="min-h-7 text-lg font-semibold text-[#09122D]">{valueNode}</div>
                  <div className="text-sm font-medium text-[#5C5F80]">{field.label}</div>
                </UiCard>
              );
            })}
      </div>
    </div>
  );
};

export default ValidatorDetailsCard;
