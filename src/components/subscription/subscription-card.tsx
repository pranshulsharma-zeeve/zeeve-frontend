"use client";
import { Button, Card, Heading } from "@zeeve-platform/ui";
import Link from "next/link";
import React, { ComponentPropsWithoutRef, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { IconGlobal } from "@zeeve-platform/icons/navigation/outline";
import { IconNetwork } from "@zeeve-platform/icons/product/outline";
import { IconBubbles } from "@zeeve-platform/icons/essential/outline";
import { capitalizeFirstLetter, withBasePath } from "@/utils/helpers";
import ROUTES from "@/routes";
import { PROTOCOL_MAPPING } from "@/constants/protocol";

type Attribute = {
  addon_code?: string;
  attribute_name?: string;
  selection_type?: string;
};

interface SubscriptionCardProps extends ComponentPropsWithoutRef<"div"> {
  protocolId: string;
  protocolName: string;
  cloudName: string;
  frontendBaseSubUrl: string;
  platformEnabled?: boolean;
  attributes: Attribute[];
  planCode: string;
  managedCloud: boolean;
  regionId: string;
  regionName: string;
}

const filterAttributes = (attributes: Attribute[], selectionType: string): string[] => {
  return attributes
    .filter((attr) => attr.selection_type === selectionType && attr.attribute_name !== undefined)
    .map((attr) => attr.attribute_name as string);
};
const filterAddOnCodes = (attributes: Attribute[], selectionType: string): string[] => {
  return attributes
    .filter((attr) => attr.selection_type === selectionType && attr.addon_code !== undefined)
    .map((attr) => attr.addon_code as string);
};

const constructQueryParams = (
  networkTypeName: string[],
  continentTypeName: string[],
  addOnCodes: { [key: string]: string[] },
  regionId: string,
  regionName: string,
) => {
  return {
    networkType: networkTypeName.join(","),
    continentType: continentTypeName.join(","),
    addOnCodes: JSON.stringify(addOnCodes),
    regionId: regionId,
    regionName: regionName,
  };
};

const SubscriptionCard = (props: SubscriptionCardProps) => {
  const path = window.location.pathname;
  const isFullNode = path.includes("full");
  const [networkTypeName, setNetworkTypeName] = useState<string[]>([]);
  const [continentTypeName, setContinentTypeName] = useState<string[]>([]);
  const [addOnCodes, setAddOnCodes] = useState<{ [key: string]: string[] }>({});
  const { protocolId, protocolName, cloudName, managedCloud, attributes, regionId, regionName } = props;

  const href = useMemo(() => {
    if (props.platformEnabled === true) {
      return `${props.frontendBaseSubUrl}/nodes/${
        isFullNode ? "full" : "validator"
      }/deploy?protocolId=${protocolId}&count=1&planCode=${
        props.planCode
      }&regionId=${regionId}&regionName=${encodeURIComponent(regionName)}&attr=${encodeURIComponent(
        JSON.stringify(props.attributes),
      )}`;
    } else {
      const queryParams = constructQueryParams(networkTypeName, continentTypeName, addOnCodes, regionId, regionName);
      const queryString = new URLSearchParams(queryParams).toString();
      return `${ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES_PROTOCOLS}/${protocolId}/deploy?${queryString}`;
    }
  }, [
    props.platformEnabled,
    props.frontendBaseSubUrl,
    props.planCode,
    props.attributes,
    isFullNode,
    protocolId,
    networkTypeName,
    continentTypeName,
    addOnCodes,
    regionId,
    regionName,
  ]);

  useEffect(() => {
    setNetworkTypeName(filterAttributes(attributes, "networkType"));
    setContinentTypeName(filterAttributes(attributes, "continentType"));
    setAddOnCodes({
      networkType: filterAddOnCodes(attributes, "networkType"),
      continentType: filterAddOnCodes(attributes, "continentType"),
      typeOfInfra: filterAddOnCodes(attributes, "typeOfInfra"),
      nodeType: filterAddOnCodes(attributes, "nodeType"),
    });
  }, [attributes]);
  return (
    <Card className="m-2 w-[300px] shrink-0 rounded-lg">
      <div className="flex flex-row items-center gap-3">
        <div className="rounded-lg bg-brand-outline p-2">
          <Image
            src={withBasePath(`/assets/images/protocols/${PROTOCOL_MAPPING[protocolId]?.icon}`)}
            alt={`${protocolName} Icon`}
            width={24}
            height={24}
          />
        </div>
        <div>
          <Heading as={"h5"}>{capitalizeFirstLetter(protocolName ?? "MA")}</Heading>
        </div>
      </div>
      <div className="border-b pb-2">
        <div className="flex items-center justify-between py-1 text-xs">
          <div className="flex items-baseline gap-2">
            <IconBubbles className="text-brand-primary" />
            <div className="text-brand-gray">Cloud</div>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src={withBasePath(
                `/assets/images/clouds/${managedCloud ? "zeeve-managed" : cloudName.toLowerCase()}.svg`,
              )}
              width={24}
              height={24}
              alt={`${cloudName || "zeeve-managed"} Logo`}
              className="bg-white"
            />
            <div>{managedCloud ? "ZEEVE MANAGED" : cloudName ? cloudName.toUpperCase() : "NA"}</div>
          </div>
        </div>
        <div className="flex items-center justify-between py-1 text-xs">
          <div className="flex items-baseline gap-2">
            <IconNetwork className="text-brand-primary" />
            <div className="text-brand-gray">Network Type</div>
          </div>
          <div className="flex items-center gap-2">
            <div>{networkTypeName.join(", ")}</div>
          </div>
        </div>
        <div className="flex items-center justify-between py-1 text-xs">
          <div className="flex items-baseline gap-2">
            <IconGlobal className="text-brand-primary" />
            <div className="text-brand-gray">Location</div>
          </div>
          <div className="flex items-center gap-2">
            <div>{continentTypeName.join(", ")}</div>
          </div>
        </div>
      </div>
      <Link href={href}>
        <Button
          className="w-full"
          isDisabled={
            props.platformEnabled === false
              ? !props.planCode || !props.attributes || !isFullNode
              : !props.frontendBaseSubUrl || !props.planCode || !props.attributes
          }
        >
          {props.platformEnabled === false ? "Provisioning" : "Deploy"}
        </Button>
      </Link>
    </Card>
  );
};

SubscriptionCard.displayName = "Subscription Card";
export type { SubscriptionCardProps };
export { SubscriptionCard };
