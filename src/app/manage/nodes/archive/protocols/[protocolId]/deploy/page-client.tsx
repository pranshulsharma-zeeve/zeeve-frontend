"use client";
import React from "react";
import { Spinner, Z4Navigation } from "@zeeve-platform/ui";
import { useParams, useSearchParams } from "next/navigation";
import ArchiveNodeDeploymentForm from "./_components/deploy-form";
import ROUTES from "@/routes";
import { capitalizeFirstLetter, withBasePath } from "@/utils/helpers";
import usePlatformService from "@/services/platform/use-platform-service";
import { ProtocolSelectionResponseData } from "@/services/platform/protocol/protocol-selection";

const ProtocolDeployPageClient = () => {
  const params = useParams();
  const protocolId = params.protocolId as string;
  const {
    request: { data, isLoading },
  } = usePlatformService().protocol.protocolSelection(protocolId, false);

  const searchParams = useSearchParams();
  const networkType = searchParams.get("networkType") ?? "";
  const continentType = searchParams.get("continentType") ?? "";
  const addOnCodesParam = searchParams.get("addOnCodes");
  const regionId = searchParams.get("regionId") ?? "";
  const regionName = searchParams.get("regionName") ?? "";

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      {/* page navigation */}
      <Z4Navigation
        heading={
          <div>
            {isLoading ? (
              <Spinner colorScheme={"cyan"} />
            ) : data ? (
              capitalizeFirstLetter(data.protocolName ?? "")
            ) : (
              protocolId
            )}
          </div>
        }
        // logo={
        //   <Image
        //     src={withBasePath(`/assets/images/protocols/${PROTOCOL_MAPPING[data?.protocolId as string]?.icon}`)}
        //     alt={`${data?.protocolName} Icon`}
        //     width={24}
        //     height={24}
        //   />
        // }
        // className="gap-0"
        sub_heading={`Zeeve Managed, ${networkType}, ${continentType} `}
        breadcrumb={{
          items: [
            {
              label: "Dashboard",
              href: withBasePath(`${ROUTES.PLATFORM.PAGE.DASHBOARD}`),
              as: "a",
            },
            {
              label: `Manage Archive Nodes`,
              href: withBasePath(ROUTES.PLATFORM.PAGE.MANAGE_ARCHIVE_NODES),
            },
            {
              label: `Deploy Node`,
              href: withBasePath(ROUTES.PLATFORM.PAGE.MANAGE_ARCHIVE_NODES_PROTOCOLS),
              isActive: true,
            },
          ],
        }}
      />
      <ArchiveNodeDeploymentForm
        data={data as ProtocolSelectionResponseData}
        continentType={continentType}
        networkType={networkType}
        regionId={regionId}
        regionName={regionName}
        addOnCodesParam={addOnCodesParam as string}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProtocolDeployPageClient;
