/* eslint-disable react/jsx-no-undef */
"use client";
import { Card } from "@zeeve-platform/ui";
import React, { useEffect, useState } from "react";
import { IconEndpoints2 } from "@zeeve-platform/icons/programming/outline";
import SearchInput from "../ui/search-input";
import DedicatedSubscriptionLoadingCard from "./dedicated-subscription-loading-card";
import { DedicatedSubscriptionCard } from "@/components/dedicated-subscriptions/dedicated-subscription-card";
import Navigation from "@/components/navigation/navigation";
import ROUTES from "@/routes";
import { useConfigStore } from "@/store/config";
import usePlatformService from "@/services/platform/use-platform-service";
import { NodeType } from "@/types/protocol";
import useDebounce from "@/hooks/use-debounce";
import { ProtocolListResponseData } from "@/services/platform/protocol/list";
import { withBasePath } from "@/utils/helpers";

const DedicatedSubscriptions = () => {
  const config = useConfigStore((state) => state.config);
  const disabledProtocolIds = config?.disabledProtocolIds as string[];
  const path = window.location.pathname;
  const isFullNode = path.includes("full");
  const {
    request: { data: protocolListData, isLoading: isProtocolListDataLoading },
  } = usePlatformService().protocol.list(isFullNode ? "full" : "validator");

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [filteredProtocols, setFilteredProtocols] = useState<ProtocolListResponseData[]>([]);

  useEffect(() => {
    if (protocolListData && protocolListData.length > 0) {
      const filtered = protocolListData.filter(
        (protocol) =>
          protocol?.protocolName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) &&
          !disabledProtocolIds.includes(protocol?.protocolId),
      );
      setFilteredProtocols(filtered as []);
    } else {
      setFilteredProtocols([]);
    }
  }, [debouncedSearchTerm, protocolListData, disabledProtocolIds]);

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      <Navigation
        heading={`Dedicated ${isFullNode ? "Full" : "Validator"} Nodes`}
        logo={<IconEndpoints2 className="text-2xl text-brand-cyan lg:text-3xl" />}
        className="gap-0"
        sub_heading={"New Subscription - Protocol Selection"}
        breadcrumb={{
          items: [
            {
              href: withBasePath(`${ROUTES.PLATFORM.PAGE.DASHBOARD}`),
              label: "Dashboard",
              as: "a",
            },
            {
              href: `${
                isFullNode ? ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES : ROUTES.PLATFORM.PAGE.MANAGE_VALIDATOR_NODES
              }`,
              label: `Manage ${isFullNode ? "Full" : "Validator"} Nodes`,
            },
            {
              href: `${
                isFullNode
                  ? ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES_PROTOCOLS
                  : ROUTES.PLATFORM.PAGE.MANAGE_VALIDATOR_NODES_PROTOCOLS
              }`,
              label: "Protocol Selection",
              isActive: true,
            },
          ],
        }}
      >
        <div className="flex items-center justify-end">
          <SearchInput
            autoComplete="off"
            searchValue={searchTerm}
            placeholder="Search By Protocol Name"
            className="h-6 border-brand-cyan bg-white focus:border-brand-cyan focus:ring-brand-cyan"
            onClearButtonClick={() => setSearchTerm("")}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Navigation>
      <Card className="grid grid-cols-12 gap-3 rounded-lg bg-white p-3 lg:gap-6 lg:p-6">
        {isProtocolListDataLoading && (
          <>
            {[1, 2, 3, 4].map((value) => (
              <DedicatedSubscriptionLoadingCard key={value} />
            ))}
          </>
        )}
        {!isProtocolListDataLoading && filteredProtocols && filteredProtocols.length > 0 ? (
          <>
            {filteredProtocols.map((protocol, index) => (
              <DedicatedSubscriptionCard
                key={index}
                showDescription
                protocolId={protocol.protocolId}
                protocolName={protocol.protocolName}
                description={protocol.protocolDesc}
                nodeType={protocol.nodeType as NodeType}
              />
            ))}
          </>
        ) : (
          !isProtocolListDataLoading && (
            <div className="col-span-12 ">
              <div className="w-full text-center">No Data Found</div>
            </div>
          )
        )}
      </Card>
    </div>
  );
};

export default DedicatedSubscriptions;
