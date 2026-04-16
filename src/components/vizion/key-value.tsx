import { Skeleton, tx } from "@zeeve-platform/ui";
import Image from "next/image";
import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import { withBasePath } from "@/utils/helpers";

interface KeyValueProps extends ComponentPropsWithoutRef<"div"> {
  label: string;
  value?: string | number | ReactNode;
  valueTwo?: string;
  highlight?: "red" | "orange" | "purple" | "blue" | "violet";
  isLoading?: boolean;
  valueThree?: string;
  valueFour?: string;
  eth?: string;
  isTheme?: boolean;
  valueClassName?: string;
  labelClassName?: string;
}

const labelColors: Record<string, string> = {
  "Reward per batch": "bg-[#26C0C7]",
  "Batch fee": "bg-[#5133D3]",
  "Staking Revenue": "bg-[#EA881B]",
  "Transaction Fees Collected": "bg-[#DC3090]",
  "Gas Fee Trends": "bg-[#9085FA]",
  "Revenue Per Transaction (RPT)": "bg-[#207CEB]",
};

const KeyValue = (props: KeyValueProps) => {
  const {
    className,
    label,
    eth,
    value,
    isTheme,
    valueTwo,
    valueThree,
    valueFour,
    valueClassName,
    labelClassName,
    isLoading,
    ...rest
  } = props;
  const colorBox = labelClassName;

  return (
    <div className={tx("flex flex-row items-center gap-3 w-full rounded-lg", className)} {...rest}>
      <div className={`flex w-full flex-col justify-center gap-0 overflow-visible`}>
        {isLoading ? (
          <Skeleton>
            <div className="h-6 w-full min-w-24 rounded bg-gray-700"></div>
          </Skeleton>
        ) : (
          <>
            <p className="flex items-center gap-1 text-lg font-medium text-[#FFFFFF]">
              <span className={`flex items-center gap-2 text-[#09122D] ${valueClassName || ""}`}>
                {typeof value === "string" || typeof value === "number" ? (
                  <>
                    {value}
                    {valueClassName &&
                      (eth && eth.toLowerCase() === "gwei" ? (
                        " GWei"
                      ) : eth ? (
                        <Image
                          src={withBasePath(`/assets/images/${eth}.svg`)}
                          onError={(e) => {
                            e.currentTarget.onerror = null; // prevent infinite loop
                            e.currentTarget.src = withBasePath(`/assets/images/protocol/${eth}.svg`);
                          }}
                          alt="ETH Icon"
                          width={14}
                          height={14}
                        />
                      ) : null)}
                  </>
                ) : (
                  value
                )}
              </span>
            </p>
            {valueTwo?.toLowerCase() === "healthy" && (
              <Image src={withBasePath(`/assets/images/vizion/healthy.svg`)} alt="Healthy" width={74} height={74} />
            )}
            {valueTwo?.toLowerCase() === "risky" && (
              <Image src={withBasePath(`/assets/images/vizion/disaster.svg`)} alt="disaster" width={74} height={74} />
            )}
            <div className="flex items-center gap-2">
              {valueTwo?.toLowerCase() === "moderate" && (
                <>
                  <Image
                    src={withBasePath(`/assets/images/vizion/moderate.svg`)}
                    alt="Moderate"
                    width={104}
                    height={104}
                  />
                  <a
                    href="/alerts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#405CCE] hover:underline"
                  >
                    View Alerts
                  </a>
                </>
              )}
            </div>
          </>
        )}

        <p className="flex items-center gap-1 truncate text-sm text-[#AAABB8]">
          <span className="flex items-center space-x-1">
            {/* {labelClassName && (
              <span
                className={`size-3 rounded-full ${
                  labelColors[
                    (Object.keys(labelColors).find(
                      (key) => key.toLowerCase() === label?.toLowerCase(),
                    ) as keyof typeof labelColors) || ""
                  ] || "bg-gray-300"
                }`}
              ></span>
            )} */}
            {valueFour?.toLowerCase() === "running" && (
              <Image src={withBasePath(`/assets/images/vizion/running.svg`)} alt="running" width={74} height={74} />
            )}
            {valueFour?.toLowerCase() === "enabled" && (
              <Image src={withBasePath(`/assets/images/vizion/enabled2.svg`)} alt="disaster" width={64} height={74} />
            )}
            {(valueFour?.toLowerCase() === "enabledlight" || valueFour?.toLowerCase() === "active") && (
              <Image
                src={withBasePath(`/assets/images/vizion/enabledlight.svg`)}
                alt="disaster"
                width={78}
                height={24}
              />
            )}
            {valueFour?.toLowerCase() === "disabled" && (
              <Image src={withBasePath(`/assets/images/vizion/disabled.svg`)} alt="disaster" width={64} height={74} />
            )}
            {valueFour?.toLowerCase() === "inactive" && (
              <Image src={withBasePath(`/assets/images/vizion/inactive.svg`)} alt="inactive" width={96} height={100} />
            )}
            {valueFour?.toLowerCase() === "loaddisabled" && (
              <Image
                src={withBasePath(`/assets/images/vizion/loaddisabled.svg`)}
                alt="inactive"
                width={84}
                height={74}
              />
            )}
            {/* {valueFour?.toLowerCase() === "active" && (
              <Image
                src={withBasePath(`/assets/images/active.svg`)}
                alt="active"
                width={55}
                height={24}
              />
            )} */}
            <span className={`truncate text-sm font-normal ${labelClassName}`}>{label}</span>
          </span>
        </p>
        <span>{valueThree}</span>
      </div>
    </div>
  );
};

export default KeyValue;
