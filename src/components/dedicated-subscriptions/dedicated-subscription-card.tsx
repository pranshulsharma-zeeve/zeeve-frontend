/* eslint-disable tailwindcss/no-custom-classname */
"use client";
import { Button, Card, Heading } from "@zeeve-platform/ui";
import Link from "next/link";
import React, { ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import { capitalizeFirstLetter, toShortString, withBasePath } from "@/utils/helpers";
import ROUTES from "@/routes";
import { NodeType } from "@/types/protocol";
import { PROTOCOL_MAPPING } from "@/constants/protocol";

interface DedicatedSubscriptionCardProps extends ComponentPropsWithoutRef<"div"> {
  protocolId: string;
  protocolName: string;
  description: string;
  nodeType: NodeType;
  showDescription?: boolean;
}

const DedicatedSubscriptionCard = (props: DedicatedSubscriptionCardProps) => {
  const { protocolId, protocolName, description, showDescription = true, nodeType } = props;

  return (
    <Card className="col-span-12 w-auto rounded-lg md:col-span-6 lg:col-span-3">
      <div className="flex h-10 flex-row items-center justify-between gap-3">
        <div>
          <Heading as={"h5"}>{capitalizeFirstLetter(protocolName ?? "NA")}</Heading>
        </div>
        <div className="rounded-lg bg-brand-outline p-2">
          <Image
            src={withBasePath(`/assets/images/protocols/${PROTOCOL_MAPPING[protocolId]?.icon}`)}
            alt={`${protocolName} Icon`}
            width={24}
            height={24}
          />
        </div>
      </div>
      {showDescription ? <div className="min-h-28 border-b pb-2 ">{toShortString(description, 50, 10)}</div> : null}
      <Link
        href={`${
          nodeType === "full"
            ? ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES_PROTOCOLS
            : ROUTES.PLATFORM.PAGE.MANAGE_VALIDATOR_NODES_PROTOCOLS
        }/${protocolId}/subscription`}
      >
        <Button className="w-full">Subscribe</Button>
      </Link>
    </Card>
  );
};

DedicatedSubscriptionCard.displayName = "Dedicated Subscription Card";
export type { DedicatedSubscriptionCardProps };
export { DedicatedSubscriptionCard };
