import { Card as UiCard, Skeleton } from "@zeeve-platform/ui";
import CopyButton from "@/components/vizion/copy-button";
import { convertMicroToUnit, toShortString } from "@/utils/helpers";

type RestakeBalance = {
  amount?: string | null;
  denom?: string | null;
} | null;

interface RestakeInfoCardProps {
  restakeAddress?: string | null;
  restakeBalance?: RestakeBalance;
  minimumReward?: number | string | null;
  frequencyHours?: number | string | null;
  networkType?: string | null;
  isLoading?: boolean;
}

const getRestakeTokenSymbol = (networkType?: string | null) => {
  if (!networkType) {
    return "CORE";
  }
  return networkType.toLowerCase().includes("test") ? "TESTCORE" : "CORE";
};

const formatBalance = (balance?: RestakeBalance): string => {
  const amount = balance?.amount?.trim();
  const denom = balance?.denom?.trim();
  if (!amount && !denom) {
    return "N/A";
  }
  const normalizedDenom = denom?.toLowerCase();
  const isMicroDenom = normalizedDenom === "utestcore" || normalizedDenom === "ucore";
  const displayDenom =
    normalizedDenom === "utestcore" ? "TESTCORE" : normalizedDenom === "ucore" ? "CORE" : (denom ?? "N/A");
  if (!amount) {
    return displayDenom;
  }
  const numericAmount = Number.parseFloat(amount);
  const convertedAmount =
    Number.isFinite(numericAmount) && isMicroDenom ? convertMicroToUnit(numericAmount) : numericAmount;
  const formattedAmount = Number.isFinite(convertedAmount)
    ? convertedAmount.toLocaleString("en-US", { maximumFractionDigits: 6 })
    : amount;
  if (!denom) {
    return formattedAmount;
  }
  return `${formattedAmount} ${displayDenom}`;
};

const formatMinimumReward = (minimumReward?: number | string | null, networkType?: string | null): string => {
  if (minimumReward === undefined || minimumReward === null || minimumReward === "") {
    return "N/A";
  }
  const numeric = typeof minimumReward === "string" ? Number.parseFloat(minimumReward) : minimumReward;
  const converted = Number.isFinite(numeric) ? convertMicroToUnit(numeric) : numeric;
  const formatted = Number.isFinite(converted)
    ? converted.toLocaleString("en-US", { maximumFractionDigits: 6 })
    : String(minimumReward);
  return `${formatted} ${getRestakeTokenSymbol(networkType)}`;
};

const formatFrequency = (frequencyHours?: number | string | null): string => {
  if (frequencyHours === undefined || frequencyHours === null || frequencyHours === "") {
    return "N/A";
  }
  const numeric = typeof frequencyHours === "string" ? Number.parseFloat(frequencyHours) : frequencyHours;
  if (!Number.isFinite(numeric)) {
    return String(frequencyHours);
  }
  const hoursLabel = numeric === 1 ? "hour" : "hours";
  return `Every ${numeric} ${hoursLabel}`;
};

const RestakeInfoCard = ({
  restakeAddress,
  restakeBalance,
  minimumReward,
  frequencyHours,
  networkType,
  isLoading = false,
}: RestakeInfoCardProps) => {
  const addressValue = restakeAddress?.trim();
  const balanceValue = formatBalance(restakeBalance);
  const minimumRewardValue = formatMinimumReward(minimumReward, networkType);
  const frequencyValue = formatFrequency(frequencyHours);

  const details = [
    {
      label: "Restake Wallet Address",
      value: addressValue ? toShortString(addressValue, 10, 8) : "N/A",
      copyText: addressValue,
    },
    {
      label: "Restake Balance",
      value: balanceValue,
    },
    {
      label: "Minimum Reward",
      value: minimumRewardValue,
    },
    {
      label: "Frequency",
      value: frequencyValue,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-medium text-[#09122D]">Restake Info</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {details.map((detail) => (
          <UiCard
            key={detail.label}
            className="flex flex-col gap-3 overflow-visible rounded-2xl border border-[#F0F0F0] bg-[#F8FAFC] p-4 shadow-sm"
          >
            {isLoading ? (
              <>
                <Skeleton role="status" as="div" className="h-6 w-24 rounded bg-gray-200" />
                <Skeleton role="status" as="div" className="h-4 w-32 rounded bg-gray-200" />
              </>
            ) : (
              <>
                <div className="flex items-start gap-2">
                  <span className="break-all text-lg font-semibold text-[#09122D]">{detail.value}</span>
                  {detail.copyText ? (
                    <span className="mt-0.5 shrink-0">
                      <CopyButton text={detail.copyText} />
                    </span>
                  ) : null}
                </div>
                <span className="text-sm font-medium text-[#5C5F80]">{detail.label}</span>
              </>
            )}
          </UiCard>
        ))}
      </div>
    </div>
  );
};

export default RestakeInfoCard;
