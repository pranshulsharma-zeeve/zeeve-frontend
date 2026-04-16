"use client";
import { Card } from "@zeeve-platform/ui";
import Image from "next/image";
import { withBasePath } from "@/utils/helpers";

interface KeyFeatureCardProps {
  title: string;
  content: string;
}

const KeyFeatureCard = ({ title, content }: KeyFeatureCardProps) => {
  return (
    <Card
      className="flex h-full min-w-0 flex-col rounded-2xl border border-white/80 p-5 backdrop-blur-[10px] sm:p-6"
      style={{
        backgroundImage: "linear-gradient(180deg, rgba(31, 162, 161, 0.3) -111.25%, rgba(255, 255, 255, 0.3) 50%)",
        boxShadow: "0px 5px 10px 0px #00000005",
      }}
    >
      <div className="flex h-full min-w-0 flex-col gap-3">
        <div className="min-w-0 text-base font-semibold leading-6 tracking-[0.1px] text-brand-secondary">{title}</div>
        <div className="min-w-0 text-sm leading-6 text-brand-secondary">{content}</div>
        {title === "Enterprise SLA" && (
          <Image
            src={withBasePath(`/assets/images/others/iso-certification.png`)}
            alt={`ISO certification logo`}
            className="mt-auto pt-3"
            width={90}
            height={90}
          />
        )}
      </div>
    </Card>
  );
};

export default KeyFeatureCard;
