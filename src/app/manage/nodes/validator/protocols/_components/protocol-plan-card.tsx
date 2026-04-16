"use client";
import { Z4Button } from "@zeeve-platform/ui";
import React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { IconArrow1RightCircle } from "@zeeve-platform/icons/arrow/outline";
import { ProtocolsCardLoader } from "./protocols-loader";
import { PLAN_FIELDS } from "./plan-header";
import ROUTES from "@/routes";
import { ProtocolPlanApi } from "@/types/api/protocols";
import { withBasePath } from "@/utils/helpers";

interface ProtocolPlanCardProps {
  planName: string;
  plan: ProtocolPlanApi;
  protocolId: string;
  protocolName: string;
  isSelected: boolean;
  isLoading: boolean;
  onSelect: () => void;
}

const ProtocolPlanCard = ({
  planName,
  plan,
  protocolId,
  protocolName,
  isSelected,
  isLoading,
  onSelect,
}: ProtocolPlanCardProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryParams = new URLSearchParams();

  return (
    <div
      className={`group col-span-4 mb-6 rounded-2xl border p-0 shadow-md transition-all lg:col-span-1 ${
        isSelected ? "border-brand-validator bg-brand-validator-10 text-white !shadow-none" : "bg-white"
      }`}
    >
      {isLoading ? <ProtocolsCardLoader /> : null}

      {/* Plan Type */}
      <div className="col-span-1 flex flex-col items-center rounded-t-2xl">
        {planName.toLowerCase() === "advance" && (
          <div
            className="mt-3 flex h-[29px] w-[139px] items-center
              justify-center rounded-full border-2 border-[#FF9653]
              px-4 py-[2px] text-xs tracking-[1px] text-[#FF9653] lg:mt-5"
          >
            MOST POPULAR
          </div>
        )}

        <div
          className={`py-3 text-sm tracking-[7px] text-brand-cyan ${
            planName.toLowerCase() === "advance" ? "mt-4 lg:mt-4" : "mt-3 lg:mt-16"
          }`}
        >
          {planName.toLocaleUpperCase()}
        </div>

        {/* Price */}
        <div className="py-3 text-sm text-black">
          <span className="text-4xl font-semibold">${Number(plan.amount_month ?? 0)}</span>
          <span className="text-base font-semibold"> / Month</span>
        </div>

        {/* Features */}
        {PLAN_FIELDS.map(({ key, label }, index) => {
          const bgColor = index % 2 === 0 ? "bg-gray-100" : "bg-white";
          const value = plan[key];

          if (typeof value === "boolean") {
            return (
              <div
                key={String(key)}
                className={`flex w-full items-center justify-between px-3 py-5 text-sm text-gray-700 lg:justify-center ${bgColor}`}
              >
                <span className="lg:hidden">{label}</span>
                <span className="flex items-center justify-center">
                  {value ? (
                    <Image
                      src={withBasePath(`/assets/images/purchase/circlecheck.svg`)}
                      alt="Check"
                      width={22}
                      height={22}
                    />
                  ) : (
                    <Image
                      src={withBasePath(`/assets/images/purchase/circlecross.svg`)}
                      alt="Cross"
                      width={22}
                      height={22}
                    />
                  )}
                </span>
              </div>
            );
          }

          const formattedValue = Array.isArray(value)
            ? value.join(", ")
            : value === null || value === undefined || value === ""
              ? "NA"
              : value.toString();

          return (
            <div
              key={String(key)}
              className={`flex w-full items-center justify-between py-5 text-sm text-gray-700 ${bgColor} px-3 text-center lg:justify-center lg:px-3`}
            >
              <span className="lg:hidden">{label}</span>
              {formattedValue}
            </div>
          );
        })}

        <div className="w-full border-[0.5px] border-brand-outline" />

        {/* CTA Button */}
        <div className={`w-full px-5 py-10`}>
          <Z4Button
            className={`w-full rounded-[4px] !py-6 text-sm font-semibold ${
              isSelected ? "bg-white text-brand-validator" : "bg-brand-validator text-white"
            }`}
            onClick={() => {
              if (isSelected && protocolId) {
                const from = searchParams.get("from");
                const protocol = searchParams.get("protocol");
                if (from) queryParams.set("from", from);
                if (protocol) queryParams.set("protocol", protocol);
                queryParams.set("planType", planName);
                queryParams.set("id", protocolId);
                queryParams.set("protocolName", protocolName);
                router.push(
                  `${ROUTES.PLATFORM.PAGE.MANAGE_VALIDATOR_NODES_PROTOCOLS}/purchase?${queryParams.toString()}`,
                );
              } else {
                onSelect();
              }
            }}
          >
            {isSelected ? (
              <div className="flex items-center justify-center">
                <IconArrow1RightCircle className="mr-2 text-2xl" />
                <span className="text-[16px] font-semibold">Continue</span>
              </div>
            ) : (
              <span className="text-[16px] font-semibold">Select Plan</span>
            )}
          </Z4Button>
        </div>
      </div>
    </div>
  );
};

export { ProtocolPlanCard };
