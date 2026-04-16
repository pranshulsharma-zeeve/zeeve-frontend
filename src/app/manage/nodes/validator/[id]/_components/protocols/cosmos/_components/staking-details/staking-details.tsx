import React from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import CopyButton from "@/components/vizion/copy-button";
import Card from "@/components/vizion/card";
import { toCapitalize, convertMicroToUnit, getExplorerUrl, toShortString } from "@/utils/helpers";
import { StakingValidatorRequestResponse } from "@/services/vizion/staking-validator";
import { ValidatorDetailResponse } from "@/services/vizion/validator-details";
import KeyValueEvm from "@/components/vizion/key-value-evm";
import { ValidatorNodeResponse } from "@/services/vizion/validator-node-details";

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
      className={`rounded-md px-3 py-1 text-xs font-medium ${
        active
          ? "border border-brand-red bg-red-100 text-brand-red"
          : "border border-brand-green bg-green-100 text-brand-green"
      }`}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
};
const StakingDetails = ({
  stakingDetails,
  validatorData,
  networkType,
  validatorNodeDetails,
}: {
  stakingDetails?: StakingValidatorRequestResponse;
  validatorData?: ValidatorDetailResponse;
  networkType: string;
  validatorNodeDetails: ValidatorNodeResponse | undefined;
}) => {
  const params = useParams();
  const router = useRouter();
  const networkId = params.id as string;
  const notation = getExplorerUrl(networkType.toLowerCase()).notation;
  const formatAmount = (val?: string | number) =>
    `${convertMicroToUnit(Number(val || 0)).toLocaleString("en-US")} ${toCapitalize(notation)}`;

  const staking = stakingDetails?.data?.stakingDetails;
  const nodeInfo = stakingDetails?.data?.nodeInfo;

  const stakingFields = [
    { label: "Balance", value: formatAmount(staking?.balance) },
    { label: "Total Staked", value: formatAmount(staking?.totalStaked) },
    { label: "Reward", value: formatAmount(staking?.stakingReward) },
    { label: "Commission", value: formatAmount(staking?.commission) },
    { label: "Self Delegation", value: formatAmount(staking?.selfDelegation) },
    { label: "Total Delegators Updated", value: Number(staking?.totalDelegators).toLocaleString("en-US") },
    {
      label: "Voting Power",
      value: convertMicroToUnit(nodeInfo?.votingPower ?? 0).toLocaleString("en-US"),
    },
    {
      label: "Commission Rate",
      value: `${(
        parseFloat(String(validatorNodeDetails?.data?.[0]?.inputs?.commissionRate) ?? "0") * 100
      ).toLocaleString("en-US", { maximumFractionDigits: 2 })}%`,
    },
    {
      label: "Jailed Status",
      value: (
        <StatusBadge active={Number(nodeInfo?.jailedStatus) === 0} activeLabel="Jailed" inactiveLabel="Unjailed" />
      ),
    },
    {
      label: "Bond Status",
      value: <StatusBadge active={Number(nodeInfo?.bondStatus) === 1} activeLabel="Bonded" inactiveLabel="Unbonded" />,
    },
  ];
  return (
    <div className={`col-span-10 rounded-2xl border border-[#E1E1E1]`}>
      <Card
        className={`col-span-10 grid grid-cols-10 gap-3 overflow-hidden rounded-2xl bg-white p-5 text-xl font-medium text-[#09122D] lg:gap-6`}
      >
        <div className="col-span-10 flex flex-row items-center justify-between">
          {/* Left: title */}
          <span className="text-xl font-medium text-[#09122D]">Staking Details</span>

          {/* Right: addresses */}
          <div className="flex flex-row items-center gap-4">
            {/* Wallet Address */}
            <div className="flex items-center gap-2 rounded-lg bg-[#F5F5F5] px-3 py-1">
              <KeyValueEvm
                horizontal={true}
                label="Wallet Address"
                value={toShortString(validatorData?.data?.delegationAddress ?? "", 15, 0)}
                valueClassName="text-sm font-normal text-[#09122D]"
                labelClassName="text-sm font-normal text-[#696969]"
              />
              <CopyButton text={validatorData?.data?.delegationAddress ?? ""} />
            </div>

            {/* Validator Address */}
            <div className="flex items-center gap-2 rounded-lg bg-[#F5F5F5] px-3 py-1">
              <KeyValueEvm
                horizontal={true}
                label="Validator Address"
                value={toShortString(validatorData?.data?.validatorAddress ?? "", 15, 0)}
                valueClassName="text-sm font-normal text-[#09122D]"
                labelClassName="text-sm font-normal text-[#696969]"
              />
              <CopyButton text={validatorData?.data?.validatorAddress ?? ""} />
            </div>
          </div>
        </div>
        {/* Staking Details Body Section*/}
        <div className="col-span-10 grid grid-cols-5 gap-6 text-sm font-semibold text-[#09122D]">
          {stakingFields.map((field, i) => (
            <KeyValueEvm
              key={i}
              label={field.label}
              value={field.value}
              valueClassName="text-xl font-semibold text-[#09122D]"
              labelClassName="text-sm font-normal text-[#696969]"
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StakingDetails;
