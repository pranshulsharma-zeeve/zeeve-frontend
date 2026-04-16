"use client";
import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Spinner } from "@zeeve-platform/ui";
import ROUTES from "@/routes";
import Navigation from "@/components/navigation/navigation";
import { capitalizeFirstLetter, withBasePath } from "@/utils/helpers";
import ProtocolForm from "@/components/protocol/protocol-selector";
import { ProtocolSelectionResponseData } from "@/services/platform/protocol/protocol-selection";
import usePlatformService from "@/services/platform/use-platform-service";
import { PROTOCOL_MAPPING } from "@/constants/protocol";

const ProtocolValidatorIdPageClient = () => {
  const params = useParams();
  const protocolId = params.protocolId as string;
  const {
    request: { data, isLoading },
  } = usePlatformService().protocol.protocolSelection(protocolId, true);

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      {/* page navigation */}
      <Navigation
        heading={
          <div>
            Dedicated Validator Nodes -{" "}
            {isLoading ? (
              <Spinner colorScheme={"cyan"} />
            ) : data ? (
              capitalizeFirstLetter(data.protocolName ?? "")
            ) : (
              protocolId
            )}
          </div>
        }
        className="gap-0"
        logo={
          <Image
            src={withBasePath(`/assets/images/protocols/${PROTOCOL_MAPPING[data?.protocolId as string]?.icon}`)}
            alt={`${data?.protocolName} Icon`}
            width={24}
            height={24}
          />
        }
        sub_heading={`New Subscription - Node Details`}
        breadcrumb={{
          items: [
            {
              label: "Dashboard",
              href: withBasePath(`${ROUTES.PLATFORM.PAGE.DASHBOARD}`),
              as: "a",
            },
            {
              label: `Manage Validator Nodes`,
              href: ROUTES.PLATFORM.PAGE.MANAGE_VALIDATOR_NODES,
            },
            // {
            //   label: "Protocol Selection",
            //   href: ROUTES.PLATFORM.PAGE.MANAGE_VALIDATOR_NODES_PROTOCOLS,
            // },
            {
              label: `Node Details`,
              href: ROUTES.PLATFORM.PAGE.MANAGE_VALIDATOR_NODES_PROTOCOLS,
              isActive: true,
            },
          ],
        }}
      />
      <ProtocolForm data={data as ProtocolSelectionResponseData} isLoading={isLoading} />
    </div>
  );
};

export default ProtocolValidatorIdPageClient;
