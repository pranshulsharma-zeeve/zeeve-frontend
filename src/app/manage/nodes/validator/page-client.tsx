/* eslint-disable react/jsx-no-undef */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button, Card, tx } from "@zeeve-platform/ui";
import { IconCard1Plus } from "@zeeve-platform/icons/money/outline";
import { NodesTable } from "./[id]/_components/nodes-table";
import ROUTES from "@/routes";
import { BuySubscription } from "@/components/subscription/buy-subscription";
import usePlatformService from "@/services/platform/use-platform-service";
import { getNodeType, withBasePath } from "@/utils/helpers";
import PageHeader from "@/components/shared/PageHeader";

const ValidatorNodesPage = () => {
  const {
    request: { data: subscriptionListData, isLoading: isSubscriptionListDataLoading },
  } = usePlatformService().subscription.list("validator", 1, 5);

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const nodeType = getNodeType();
  const subscriptions = subscriptionListData?.data?.list ?? [];

  const {
    request: { data: networkListData, isLoading: networkListLoading },
  } = usePlatformService().network.list("validator", pageIndex + 1, pageSize);
  // console.log(networkListData);
  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      <div>
        <PageHeader
          title="Validator Nodes"
          breadcrumbs={[
            { href: withBasePath(`${ROUTES.PLATFORM.PAGE.DASHBOARD}`), label: "Dashboard" },
            { href: withBasePath(`${ROUTES.PLATFORM.PAGE.MANAGE_VALIDATOR_NODES}`), label: "Manage Validator Nodes" },
          ]}
          actions={
            <Link href={ROUTES.PLATFORM.PAGE.MANAGE_VALIDATOR_NODES_PROTOCOLS}>
              <Button iconLeft={<IconCard1Plus className="text-xl" />}>Buy Subscription</Button>
            </Link>
          }
        />
      </div>

      <Card className="gap-3 rounded-lg bg-white p-3 lg:gap-6 lg:p-6">
        {/* {!isSubscriptionListDataLoading && subscriptionListData?.data && subscriptionListData.data.length > 0 ? (
          <div className="flex items-center justify-between">
            <Heading as="h4">Pending Deployments</Heading>
          </div>
        ) : null}
        {isSubscriptionListDataLoading ? (
          <div className="flex items-center justify-between">
            <Heading as="h4">Pending Deployments</Heading>
          </div>
        ) : null} */}
        {/* {isSubscriptionListDataLoading ? (
          <div
            className={tx("flex snap-x snap-mandatory justify-start overflow-x-auto overflow-y-hidden", {
              "border-b pb-4":
                (!isSubscriptionListDataLoading &&
                  subscriptionListData?.data &&
                  subscriptionListData.data.length > 0) ||
                isSubscriptionListDataLoading,
            })}
          >
            {[1, 2, 3].map((value) => (
              <SubscriptionLoadingCard key={value} />
            ))}
          </div>
        ) : null} */}
        {!isSubscriptionListDataLoading &&
        subscriptions.length === 0 &&
        (!networkListData ||
          !networkListData.data ||
          !networkListData.data.list ||
          networkListData.data.list.length === 0) ? (
          <div
            className={tx("flex snap-x snap-mandatory justify-start overflow-x-auto overflow-y-hidden", {
              "border-b pb-4":
                (!isSubscriptionListDataLoading && subscriptions.length > 0) || isSubscriptionListDataLoading,
            })}
          >
            <BuySubscription href={ROUTES.PLATFORM.PAGE.MANAGE_VALIDATOR_NODES_PROTOCOLS} nodeType={nodeType} />
          </div>
        ) : null}
        {/* {!isSubscriptionListDataLoading && subscriptionListData?.data && subscriptionListData?.data.length > 0 ? (
          <div
            className={tx("flex snap-x snap-mandatory justify-start overflow-x-auto overflow-y-hidden", {
              "border-b pb-4":
                (!isSubscriptionListDataLoading &&
                  subscriptionListData?.data &&
                  subscriptionListData.data.length > 0) ||
                isSubscriptionListDataLoading,
            })}
          >
            {subscriptionListData?.data.map((subscription, index) => (
              <SubscriptionCard
                key={index}
                protocolId={subscription.protocolId}
                protocolName={subscription.protocolName}
                cloudName={subscription.cloudName}
                frontendBaseSubUrl={subscription.frontendBaseSubUrl}
                attributes={subscription.attributes}
                planCode={subscription.planCode}
                managedCloud={subscription.managedCloud ?? true}
                platformEnabled={subscription.platformEnabled}
                regionId={subscription.regionId}
                regionName={subscription.regionName}
              />
            ))}
          </div>
        ) : null} */}
        <NodesTable
          isLoading={networkListLoading}
          data={networkListData}
          pageSize={pageSize}
          pageIndex={pageIndex}
          setPagination={setPagination}
        />
      </Card>
    </div>
  );
};

export default ValidatorNodesPage;
