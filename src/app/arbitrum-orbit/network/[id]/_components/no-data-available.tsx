"use client";
import { Card, tx } from "@zeeve-platform/ui";
import Image from "next/image";
import React from "react";
import { withBasePath } from "@orbit/utils/helpers";

const NoDataAvailable = ({ className }: { className?: string }) => {
  return (
    <Card className={tx("col-span-12 flex flex-col items-center justify-center border-none shadow-md p-6", className)}>
      <Image
        src={withBasePath("/assets/images/protocol/no-data.svg")}
        alt="No Data Available"
        width={200}
        height={200}
        className="size-52"
      />
      <p className="text-center font-semibold">No Data Available</p>
    </Card>
  );
};

export default NoDataAvailable;
