import React from "react";
import Image from "next/image"; // Import Image from Next.js
import CopyButton from "@/components/vizion/copy-button";

interface SslRpcCardProps {
  sslDaysRemaining: number;
  title: string;
  url: string;
  rpcStatusCode: string; // Ensure it's a number
}

export default function SslRpcCard({ sslDaysRemaining, rpcStatusCode, url, title }: SslRpcCardProps) {
  return (
    <div className="mt-4 w-full min-w-[250px] max-w-[320px] rounded-lg border border-[#FFFFFF33] bg-gradient-to-b from-[#1A2E7E] to-[#181B3E] p-4 text-white shadow-lg">
      {/* SSL Status */}
      <h3 className="mb-2 flex items-center gap-2 font-semibold text-white">
        {title}
        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-500">
          <Image
            src="/assets/images/protocol/link.svg"
            alt="Link"
            width={12}
            height={12}
            className="brightness-0 invert"
          />
        </a>
      </h3>

      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-normal text-[#AAABB8]">SSL Status</span>
        <span
          className={`font-bold ${
            Number(sslDaysRemaining) < 5
              ? "text-[#DE4841]"
              : Number(sslDaysRemaining) >= 5 && Number(sslDaysRemaining) <= 15
                ? "text-[#CEB940]"
                : "text-[#0BB63B]"
          }`}
        >
          {sslDaysRemaining} Days <span className="text-white">To Expire</span>
        </span>{" "}
      </div>

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm font-normal text-[#AAABB8]">
          RPC Status <CopyButton text={url} />
        </span>

        <div className="flex items-center gap-2">
          <Image
            src={
              rpcStatusCode === "200" ? "/assets/images/protocol/healthy.svg" : "/assets/images/protocol/moderate.svg"
            }
            alt="status"
            width={84}
            height={84}
          />
        </div>
      </div>
    </div>
  );
}
