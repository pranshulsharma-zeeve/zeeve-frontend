import Image from "next/image";
import { withBasePath } from "@/utils/helpers";

interface RestrictedBadgeProps {
  ipCount: number;
}

export default function RestrictedBadge({ ipCount }: RestrictedBadgeProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-1 rounded-md border border-[#DE4841] bg-[#DE484133] px-1.5 py-0.5">
        <Image src={withBasePath(`/assets/images/shield.svg`)} alt="Good" width={12} height={12} />
        <span className="font-poppins text-[12px] font-medium text-[#DE4841]">Restricted {ipCount} IP</span>
      </div>
    </div>
  );
}
