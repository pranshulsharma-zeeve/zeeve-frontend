"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { Card, StatusIcon, tx } from "@zeeve-platform/ui";
import Link from "next/link";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import ROUTES from "@orbit/routes";
import { withBasePath } from "@orbit/utils/helpers";

interface InfoProps {
  className?: string;
}
const DemoNetworkInfo = ({ className }: InfoProps) => {
  const isDemo = useSearchParams().get("demo") ?? false;

  return isDemo ? (
    <Card
      className={tx(
        "col-span-12 flex flex-row items-center border border-brand-yellow bg-brand-yellow/5 gap-3",
        className,
      )}
    >
      <StatusIcon status={"warning"} />
      <div className="2xl:flex 2xl:grow 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <div className="font-medium text-brand-dark">
          This is a fully functional demo Arbitrum Orbit testnet. This instance is available to all users. If You want
          to deploy your own network (for which only you or your organization has access), you can do that from the
          <Link href={withBasePath(ROUTES.ARBITRUM_ORBIT.PAGE.LIST)} className="text-brand-primary">
            {" "}
            Deploy Testnet
            <IconArrowUpRightFromSquare className="mx-1 inline" />
          </Link>{" "}
          option.
        </div>
      </div>
    </Card>
  ) : null;
};

export default DemoNetworkInfo;
