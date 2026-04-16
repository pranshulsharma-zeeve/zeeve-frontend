"use client";

import { IconCard1Plus } from "@zeeve-platform/icons/money/outline";
import { Button } from "@zeeve-platform/ui";
import { useRouter } from "next/navigation";
import React from "react";
import ROUTES from "@orbit/routes";
import { TrialInfoResponse } from "@orbit/services/arbitrum-orbit/network/trialInfo";

type TrialProps = {
  trialInfoApiData?: TrialInfoResponse;
  trialInfoApiLoading: boolean;
};

const Actions = ({ trialInfoApiData, trialInfoApiLoading }: TrialProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-row gap-x-4">
      <Button
        iconLeft={<IconCard1Plus className="text-xl" />}
        isLoading={trialInfoApiLoading}
        isDisabled={trialInfoApiData?.status === "purchased" || trialInfoApiData?.status === "ongoing"}
        onClick={() => {
          router.push(ROUTES.ARBITRUM_ORBIT.PAGE.PURCHASE);
        }}
      >
        Buy Subscription
      </Button>
      {/* <Button
        iconLeft={<IconPlusSquare className="text-xl" />}
        isLoading={trialInfoApiLoading}
        isDisabled={
          (trialInfoApiData?.status === "not-started" ||
            trialInfoApiData?.status === "purchased" ||
            trialInfoApiData?.status === "ongoing") &&
          !disable
            ? false
            : true
        }
        onClick={() => {
          router.push(ROUTES.ARBITRUM_ORBIT.PAGE.DEPLOY);
        }}
      >
        Deploy Devnet
      </Button> */}
    </div>
  );
};

export default Actions;
