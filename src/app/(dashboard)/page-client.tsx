"use client";

import React, { useState } from "react";
import DashboardHero from "./_components/dashboard-hero";
import SubscriptionsCard from "./_components/subscriptionsCard";
import EmptyStateCard from "./_components/empty-state-card";
import AlertsCard from "./_components/alerts-card";
import { StartServiceSection, ServiceSpotlightSection } from "./_components/first-time-user-cards";
import ZeeveLoader from "@/components/shared/ZeeveLoader";
import usePlatformService from "@/services/platform/use-platform-service";
import { SubscriptionSummaryItem } from "@/services/platform/subscription/summary";

const mergeSubscriptionItemsArray = (
  nodeSubscriptions?: SubscriptionSummaryItem[],
  rollupSubscriptions?: SubscriptionSummaryItem[],
): (SubscriptionSummaryItem & { protocolType: string })[] => {
  const nodeItems = nodeSubscriptions
    ? nodeSubscriptions.map((item) => ({
        ...item,
        protocolType: "public",
      }))
    : [];

  const rollupItems = rollupSubscriptions
    ? rollupSubscriptions.map((item) => ({
        ...item,
        protocolType: "rollup",
      }))
    : [];

  return [...rollupItems, ...nodeItems];
};

const DashboardPageClient = () => {
  const [isNavigating, setIsNavigating] = useState(false);

  // Fetching subscription summary data
  const {
    request: { data: subscriptionSummaryData, isLoading: isSubscriptionSummaryDataLoading },
  } = usePlatformService().subscription.summary();

  const subscriptionItems = mergeSubscriptionItemsArray(
    subscriptionSummaryData?.data?.subscriptions,
    subscriptionSummaryData?.data?.rollups,
  );
  const hasSubscriptions = subscriptionItems.length > 0;

  return (
    <div className="relative min-h-full">
      {isNavigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <ZeeveLoader />
        </div>
      )}
      <div className="flex w-full flex-col gap-8 px-4 py-6 lg:px-6">
        <DashboardHero
          subscriptionData={subscriptionItems}
          isLoading={isSubscriptionSummaryDataLoading}
          onNavigate={() => setIsNavigating(true)}
        />
        <StartServiceSection onNavigate={() => setIsNavigating(true)} />
        {hasSubscriptions ? (
          <>
            <SubscriptionsCard subscriptionData={subscriptionItems} isLoading={isSubscriptionSummaryDataLoading} />
            <AlertsCard />
          </>
        ) : (
          <>
            {/* <ServiceSpotlightSection /> */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <EmptyStateCard
                title="Subscriptions"
                descriptionBold="Get started with your first service."
                description="Launch a rollup, appchain, or smart node to see it here."
                imageSrc="/assets/images/dashboard-v2/empty_subscription.svg"
                variant="subscriptions"
              />
              <EmptyStateCard
                title="Alerts"
                descriptionBold="Nothing running yet."
                description="Once services are active, alert notifications will appear here."
                imageSrc="/assets/images/vizion/no-alerts.svg"
                variant="alerts"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPageClient;
