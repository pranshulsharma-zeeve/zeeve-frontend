"use client";
import { TabPanels, TabPanel, Z4Tabs, Z4TabList, Z4Tab } from "@zeeve-platform/ui";
import React from "react";
import { IconChart2Square } from "@zeeve-platform/icons/business/outline";
import { IconBubbles } from "@zeeve-platform/icons/essential/outline";
import { IconEmptyWallet } from "@zeeve-platform/icons/money/outline";
import { IconDocument2Text } from "@zeeve-platform/icons/document/outline";
import { IconMonitor } from "@zeeve-platform/icons/electronic/outline";
import { useParams } from "next/navigation";
import MonitoringDashboard from "../monitoring/monitoring";
import Overview from "./overview/overview";
import MyNodes from "./my-nodes/my-nodes";
import SmartContracts from "./smart-contracts/smart-contracts";
import Wallet from "./wallet/wallet";
import { useNetworkStore } from "@/modules/arbitrum-orbit/store/network";

const DashboardTabs = () => {
  const networkInfo = useNetworkStore((state) => state.networkInfo);

  if (networkInfo?.isLoading) {
    return (
      <div className="rounded-lg border border-dashed border-brand-outline p-6 text-center text-sm text-brand-gray">
        Loading OP Stack dashboard...
      </div>
    );
  }

  if (!networkInfo?.isLoading && !networkInfo?.data) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-brand-red/50 p-6 text-center text-sm text-brand-dark">
        <p>Failed to load OP Stack data</p>
      </div>
    );
  }

  return (
    <Z4Tabs orientation="horizontal" className="rounded-none border-none">
      <Z4TabList className="mb-4 gap-8 overflow-x-auto border-0 bg-white scrollbar-hide">
        <Z4Tab className="whitespace-nowrap font-semibold">
          {<IconChart2Square className="me-2 size-5" />} Overview
        </Z4Tab>
        <Z4Tab className="whitespace-nowrap font-semibold">{<IconBubbles className="me-2 size-5" />} Nodes</Z4Tab>
        <Z4Tab className="whitespace-nowrap font-semibold">{<IconEmptyWallet className="me-2 size-5" />} Wallets</Z4Tab>
        <Z4Tab className="whitespace-nowrap font-semibold">
          {<IconDocument2Text className="me-2 size-5" />} Smart Contracts
        </Z4Tab>
        <Z4Tab className="whitespace-nowrap font-semibold">{<IconMonitor className="me-2 size-5" />} Monitoring</Z4Tab>
        {/* <Z4Tab className="font-semibold">Bridge</Z4Tab> */}
      </Z4TabList>
      <TabPanels>
        <TabPanel>
          <Overview />
        </TabPanel>
        <TabPanel>
          <MyNodes />
        </TabPanel>
        <TabPanel>
          <Wallet />
        </TabPanel>
        <TabPanel>
          <SmartContracts />
        </TabPanel>
        <TabPanel>
          <MonitoringDashboard />
        </TabPanel>
        {/* <TabPanel>
          <Bridge />
        </TabPanel> */}
      </TabPanels>
    </Z4Tabs>
  );
};

const IdPageTabs = () => {
  const { id } = useParams();
  const serviceId = typeof id === "string" ? id : Array.isArray(id) ? id[0] : undefined;

  if (!serviceId) {
    return (
      <div className="rounded-lg border border-dashed border-brand-outline p-6 text-center text-sm text-brand-gray">
        Missing service identifier in the URL.
      </div>
    );
  }

  return <DashboardTabs />;
};

export default IdPageTabs;
