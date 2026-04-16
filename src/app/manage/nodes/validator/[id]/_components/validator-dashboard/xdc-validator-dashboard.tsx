import { Card as UiCard, Skeleton } from "@zeeve-platform/ui";
import { formatPlainNumber } from "./helpers";
import CopyButton from "@/components/vizion/copy-button";
import InfoCardsGrid from "@/components/info-cards-grid";
import type { ValidatorSummary } from "@/services/platform/validator/overview";
import type { UpdatedValidatorNodeResponse } from "@/services/vizion/new-validator-node-details";

interface XdcValidatorDashboardProps {
  summary?: ValidatorSummary;
  updatedValidatorNodeDetails?: UpdatedValidatorNodeResponse;
  isLoading?: boolean;
}

interface StatRow {
  label: string;
  value: string;
}

interface DetailRowProps {
  rowIndex: number;
  label: string;
  value: string;
  isLoading?: boolean;
  copyable?: boolean;
}

const DetailRow = ({ rowIndex, label, value, isLoading = false, copyable = false }: DetailRowProps) => (
  <div
    className={`rounded-lg px-4 py-3 shadow-[inset_0_-1px_0_#E4EFFB] transition-colors duration-200 hover:bg-[#EAF4FF] ${
      rowIndex % 2 === 0 ? "bg-[#F7FBFF]" : "bg-white"
    }`}
  >
    {isLoading ? (
      <div className="space-y-2">
        <Skeleton role="status" as="div" className="h-4 w-28 rounded bg-gray-200" />
        <Skeleton role="status" as="div" className="h-5 w-full rounded bg-gray-200" />
      </div>
    ) : (
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <span className="text-sm font-medium text-[#466389]">{label}</span>
        <div className="flex items-center gap-2 lg:max-w-[72%]">
          <span className="break-all text-sm font-semibold text-[#102A5A]">{value}</span>
          {copyable && value !== "N/A" ? (
            <CopyButton text={value} className="text-[#2D68B2] hover:text-[#102A5A]" />
          ) : null}
        </div>
      </div>
    )}
  </div>
);

interface SectionCardProps {
  title: string;
  badgeLabel: string;
  rows: StatRow[];
  isLoading: boolean;
  copyableRows?: boolean;
}

const SectionCard = ({ title, badgeLabel, rows, isLoading, copyableRows = false }: SectionCardProps) => (
  <UiCard className="rounded-2xl border border-[#D5E4F7] bg-white p-5 shadow-[0_8px_20px_rgba(31,90,163,0.08)]">
    <div className="mb-4 flex items-center justify-between">
      <h4 className="text-xl font-semibold text-[#102A5A]">{title}</h4>
      <span className="rounded-full border border-[#D7E7FA] bg-[#F8FBFF] px-3 py-1 text-xs font-semibold text-[#376199]">
        {badgeLabel}
      </span>
    </div>
    <div className="space-y-3">
      {rows.map((row, index) => (
        <DetailRow
          key={row.label}
          rowIndex={index}
          label={row.label}
          value={row.value}
          isLoading={isLoading}
          copyable={copyableRows}
        />
      ))}
    </div>
  </UiCard>
);

const formatStartDate = (isoString?: string | null): string => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "N/A";
  const formatted = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `from ${formatted}`;
};

const XdcValidatorDashboard = ({
  summary,
  updatedValidatorNodeDetails,
  isLoading = false,
}: XdcValidatorDashboardProps) => {
  const signerAddress = updatedValidatorNodeDetails?.data?.validator_address ?? "N/A";
  const validatorRank =
    summary?.validator_rank !== undefined && summary?.validator_rank !== null
      ? formatPlainNumber(Number(summary.validator_rank))
      : "N/A";
  const activeLabel = formatStartDate(summary?.startDate);
  const ownerAddress = summary?.owner_address ?? "N/A";
  const stakingSmartContractAddress = summary?.staking_smart_contract_address ?? "N/A";

  const masternodesCards = [
    { label: "Validator Rank", value: validatorRank },
    { label: "Voting Power", value: "3.44%" },
    { label: "Active", value: activeLabel },
    { label: "Up Time", value: "100%" },
  ];

  const keyMetricCards = [
    { label: "Commission", value: "10%" },
    { label: "APR", value: "4%" },
    { label: "Self Bonded", value: "1,000 XDC" },
    { label: "Total Bonded", value: "305,889,555 XDC" },
    { label: "Validator ID", value: "18" },
  ];

  const addressRows = [
    { label: "Owner address", value: ownerAddress },
    { label: "Signer address", value: signerAddress },
    { label: "Staking smart contract", value: stakingSmartContractAddress },
  ];

  const overviewCards = [
    { label: "Checkpoints", value: "100%" },
    { label: "Heimdall blocks", value: "100%" },
    { label: "Bor blocks", value: "99.97%" },
    { label: "Heimdall fees", value: "112.65" },
    { label: "Signer balance", value: "5.15 ETH" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <InfoCardsGrid
          title="Overview"
          items={overviewCards}
          isLoading={isLoading}
          columns="5"
          enableCardHoverEffect={true}
        />
      </div>

      <div className="space-y-4">
        <InfoCardsGrid
          title="Masternodes Details"
          items={masternodesCards}
          isLoading={isLoading}
          columns="4"
          enableCardHoverEffect={true}
        />
      </div>

      <div className="space-y-4">
        <InfoCardsGrid
          title="Key Metrics"
          items={keyMetricCards}
          isLoading={isLoading}
          columns="5"
          enableCardHoverEffect={true}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SectionCard
          title="Addresses"
          badgeLabel={`${addressRows.length} items`}
          rows={addressRows}
          isLoading={isLoading}
          copyableRows={true}
        />
      </div>
    </div>
  );
};

export default XdcValidatorDashboard;
