"use client";
import React from "react";
import Link from "next/link";
import { IconPlusSquare } from "@zeeve-platform/icons/essential/outline";
import { Card } from "@zeeve-platform/ui";
import ROUTES from "@orbit/routes";
import { TrialInfoResponse } from "@orbit/services/arbitrum-orbit/network/trialInfo";

interface NoDataProps {
  trialInfoApiData?: TrialInfoResponse;
}
const NoData = ({ trialInfoApiData }: NoDataProps) => {
  return (
    <Card className="col-span-12 min-h-[255px] items-center justify-center rounded-lg border-0">
      {trialInfoApiData?.status &&
      trialInfoApiData?.status !== "purchase_initiated" &&
      trialInfoApiData?.status !== "ended" ? (
        <Link href={ROUTES.ARBITRUM_ORBIT.PAGE.DEPLOY}>
          <IconPlusSquare className="m-auto text-4xl text-brand-blue" />
          <p className="text-center text-base font-semibold">Deploy Testnet</p>
          <p className="text-sm text-brand-gray">Hey! There is no testnet deployed right now, deploy a new one.</p>
        </Link>
      ) : null}
    </Card>
  );
};

export default NoData;
