"use client";
import React from "react";
import { Card, StatusIcon, Link } from "@zeeve-platform/ui";
import { capitalizeFirstLetter } from "@/utils/helpers";

interface InfoBannerProps {
  name?: string;
  status?: string;
  validatorAddress?: string | null;
  isVizionOnboarded?: boolean;
}

const InfoBanner: React.FC<InfoBannerProps> = ({ name, status = "", validatorAddress, isVizionOnboarded }) => {
  let message: React.ReactNode = null;
  let linkText: string | undefined;
  let linkUrl: string | undefined;

  if (name === "Coreum" && !validatorAddress) {
    message = "To start earning rewards and participate as a validator, Stake your node. To learn more,";
    linkText = "Click Here.";
    linkUrl = "https://docs.zeeve.io/validator-nodes/coreum/manage-coreum-validator-node/edit-validator-details";
  } else if (name === "Shido" && status === "ready") {
    message =
      "Node configs are required for your node. Our support team will reach out to collect the necessary details for setting up your validator node.";
  } else if (status && status !== "ready") {
    message = `Your node is currently in the ${capitalizeFirstLetter(
      status,
    )} status. You will be able to access the endpoints once it transitions to the Ready status.`;
  } else if (name === "Coreum" && !isVizionOnboarded) {
    message = "We are working to display validator details. We expect them to be available in approximately 24 hours.";
  }

  return message ? (
    <Card className="mb-3 flex h-16 w-full flex-row items-center gap-6 border border-brand-yellow bg-brand-yellow/5">
      <StatusIcon status="warning" />
      <div className="flex flex-row items-center gap-3">
        <div className="font-medium text-brand-dark">{message}</div>
        {linkUrl && linkText && (
          <Link href={linkUrl} className="text-brand-cyan" target="_blank">
            {linkText}
          </Link>
        )}
      </div>
    </Card>
  ) : null;
};

export default InfoBanner;
