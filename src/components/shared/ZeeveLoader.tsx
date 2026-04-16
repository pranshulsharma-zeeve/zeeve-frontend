"use client";
import Image from "next/image";
import { tx } from "@zeeve-platform/ui";
import { withBasePath } from "@/utils/helpers";

interface ZeeveLoaderProps {
  className?: string;
  label?: string;
}

const ZeeveLoader = ({ className, label = "Loading..." }: ZeeveLoaderProps) => {
  return (
    <div
      className={tx("flex flex-col items-center justify-center gap-3 text-sm font-medium text-[#4B5365]", className)}
    >
      <Image
        src={withBasePath("/assets/images/loaders/zeeve-loader.gif")}
        alt="Zeeve loader"
        width={80}
        height={80}
        className="size-20"
        priority
      />
      <span>{label}</span>
    </div>
  );
};

export default ZeeveLoader;
