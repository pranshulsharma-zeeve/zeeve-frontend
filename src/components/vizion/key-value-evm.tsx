import { Skeleton, tx } from "@zeeve-platform/ui";
import Image from "next/image";
import React, { ComponentPropsWithoutRef } from "react";
import RestrictedBadge from "../ui/restricted";
import { withBasePath } from "@/utils/helpers";

interface KeyValueEvmProps extends ComponentPropsWithoutRef<"div"> {
  label: string;
  value?: string | number | React.ReactNode;
  valueTwo?: string;
  highlight?: "red" | "orange" | "purple" | "blue" | "violet";
  isLoading?: boolean;
  valueThree?: string;
  valueClassName?: string;
  labelClassName?: string;
  horizontal?: boolean;
}

const labelColors: Record<string, string> = {
  "Reward per batch": "bg-[#26C0C7]",
  "Batch fee": "bg-[#5133D3]",
  "Staking Revenue": "bg-[#EA881B]",
  "Transaction Fees Collected": "bg-[#DC3090]",
  "Gas Fee Trends": "bg-[#9085FA]",
  "Revenue Per Transaction (RPT)": "bg-[#207CEB]",
};

const KeyValueEvm = (props: KeyValueEvmProps) => {
  const {
    className,
    label,
    value,
    valueTwo,
    valueThree,
    valueClassName,
    labelClassName,
    isLoading,
    horizontal,
    ...rest
  } = props;
  const colorBox = labelClassName;

  if (horizontal) {
    return (
      <div className="flex items-center gap-2" {...rest}>
        <span className={`text-sm font-normal ${labelClassName || ""}`}>{label}:</span>
        <span className={`text-sm font-normal ${valueClassName || ""}`}>{value}</span>
      </div>
    );
  }
  return (
    <div className={tx("flex flex-row mb-0.5 items-center w-full rounded-lg", className)} {...rest}>
      <div className={`flex w-full flex-col justify-center gap-1 overflow-hidden`}>
        {isLoading ? (
          <Skeleton>
            <div className="h-6 w-full min-w-24 rounded bg-gray-700"></div>
          </Skeleton>
        ) : (
          <>
            <p className={`flex items-center gap-1 ${valueClassName || ""}`}>{value}</p>
            <div className="flex justify-start">
              {label === "IP Whitelisting & Firewall Rules" ? (
                <RestrictedBadge ipCount={Number(valueTwo)} /> // Now aligned to the left
              ) : (
                <>
                  {valueTwo?.toLowerCase() === "0" && (
                    <Image src={withBasePath(`/assets/images/healthy.svg`)} alt="Healthy" width={74} height={74} />
                  )}
                  {valueTwo?.toLowerCase() === "1" && (
                    <Image src={withBasePath(`/assets/images/good.svg`)} alt="Good" width={54} height={54} />
                  )}
                  {valueTwo?.toLowerCase() === "2" && (
                    <Image
                      src={withBasePath(`/assets/images/restricted.svg`)}
                      alt="Restricted"
                      width={94}
                      height={94}
                    />
                  )}
                  {valueTwo?.toLowerCase() === "5" && (
                    <Image src={withBasePath(`/assets/images/disaster.svg`)} alt="Disaster" width={74} height={74} />
                  )}
                  {valueTwo?.toLowerCase() === "4" && (
                    <Image src={withBasePath(`/assets/images/low.svg`)} alt="Low" width={54} height={54} />
                  )}
                  {valueTwo?.toLowerCase() === "3" && (
                    <div className="flex items-center justify-start gap-2">
                      <Image
                        src={withBasePath(`/assets/images/moderate.svg`)}
                        alt="Moderate"
                        width={104}
                        height={104}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        <p className="flex items-center gap-1 truncate text-sm text-[#AAABB8]">
          <span className="flex items-center space-x-1">
            <span className={`truncate font-medium ${labelClassName || ""}`}>{label}</span>
          </span>
        </p>
        <span>{valueThree}</span>
      </div>
    </div>
  );
};

export default KeyValueEvm;
