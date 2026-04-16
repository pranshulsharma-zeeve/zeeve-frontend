import React from "react";
import { ProtocolsCardLoader } from "./protocols-loader";
import { ProtocolPlanApi } from "@/types/api/protocols";

const PLAN_FIELDS: { key: keyof ProtocolPlanApi; label: string }[] = [
  { key: "uptimeSLA", label: "SLA" },
  { key: "regions", label: "Location" },
  { key: "bandwidth", label: "Bandwidth" },
  { key: "support", label: "Support" },
  { key: "monthlyLimit", label: "Monthly Limit" },
  { key: "ipWhitelist", label: "IP Whitelist" },
  { key: "domainCustomization", label: "Domain Customization" },
  // { key: "softwareUpgrades", label: "Software Upgrades" },
];

const PlanHeader = ({ plan, isLoading }: { plan: ProtocolPlanApi | undefined; isLoading: boolean }) => {
  return (
    <div className="collapse col-span-1 h-0 px-3 lg:visible lg:col-span-1 lg:pt-[170px]">
      {isLoading ? <ProtocolsCardLoader /> : null}
      {PLAN_FIELDS.map(({ key, label }) => (
        <div key={key} className="border-b py-[18px] text-[16px] font-medium leading-[24px] text-gray-700">
          {label}
        </div>
      ))}
    </div>
  );
};

export default PlanHeader;
export { PLAN_FIELDS };
