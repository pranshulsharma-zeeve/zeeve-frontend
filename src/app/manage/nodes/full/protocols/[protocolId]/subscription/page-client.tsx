"use client";
import React from "react";
import { Spinner, Z4Navigation } from "@zeeve-platform/ui";
import { useParams } from "next/navigation";
import ROUTES from "@/routes";
import { capitalizeFirstLetter, withBasePath } from "@/utils/helpers";
import ProtocolForm from "@/components/protocol/protocol-selector";
import { ProtocolSelectionResponseData } from "@/services/platform/protocol/protocol-selection";
import usePlatformService from "@/services/platform/use-platform-service";

const ProtocolFullIdPageClient = () => {
  const params = useParams();
  const protocolId = params.protocolId as string;
  const {
    request: { data, isLoading },
  } = usePlatformService().protocol.protocolSelection(protocolId, true);

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      {/* page navigation */}
      <Z4Navigation
        heading={
          <div>
            RPC Nodes -{" "}
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
        sub_heading={`New Subscription - Node Details`}
        // className="gap-0"
        breadcrumb={{
          items: [
            {
              label: "Dashboard",
              href: withBasePath(`${ROUTES.PLATFORM.PAGE.DASHBOARD}`),
              as: "a",
            },
            {
              label: `Manage RPC Nodes`,
              href: withBasePath(ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES),
            },
            // {
            //   label: "Protocol Selection",
            //   href: withBasePath(ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES_PROTOCOLS),
            // },
            {
              label: `Node Details`,
              href: withBasePath(ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES_PROTOCOLS),
              isActive: true,
            },
          ],
        }}
      />
      <ProtocolForm data={data as ProtocolSelectionResponseData} isLoading={isLoading} />
    </div>
  );
};

export default ProtocolFullIdPageClient;
