"use client";
import React from "react";
import { Card, StatusIcon, tx } from "@zeeve-platform/ui";
interface ChainStatusInfoProps {
  isVisible?: boolean;
}
const ChainStatusInfo = ({ isVisible = false }: ChainStatusInfoProps) => {
  return isVisible ? (
    <Card className={tx("col-span-12 flex flex-row items-center border border-brand-yellow bg-brand-yellow/5 gap-3")}>
      <StatusIcon status={"warning"} />
      <div className="2xl:flex 2xl:grow 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <div className="font-medium text-brand-dark">
          The installation of the blockchain is currently in progress. Consequently, access to blockchain information
          will be made available upon completion of the setup.
        </div>
      </div>
    </Card>
  ) : null;
};

export default ChainStatusInfo;
