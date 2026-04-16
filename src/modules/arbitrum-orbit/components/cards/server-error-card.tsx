"use client";
import React from "react";
import { Card } from "@zeeve-platform/ui";
import { IconExclamationCircle } from "@zeeve-platform/icons/essential/outline";

const ServerErrorCard = ({
  message = "Some internal server error occurred, please try again after sometime.",
}: {
  message?: string;
}) => {
  return (
    <Card className="flex flex-row items-center gap-2 border-brand-red bg-red-50/50 p-3 text-sm text-brand-gray lg:p-6 lg:text-base">
      <IconExclamationCircle className="shrink-0 text-brand-red" />
      <p>{message}</p>
    </Card>
  );
};

export default ServerErrorCard;
