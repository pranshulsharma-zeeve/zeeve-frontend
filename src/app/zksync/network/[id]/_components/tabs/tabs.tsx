"use client";
import { useParams } from "next/navigation";
import { Z4Tabs, Z4TabList, Z4Tab, TabPanels, TabPanel, Z4Button } from "@zeeve-platform/ui";
import React from "react";
import { IconChart2Square } from "@zeeve-platform/icons/business/outline";
import { IconBubbles } from "@zeeve-platform/icons/essential/outline";
import { IconEmptyWallet } from "@zeeve-platform/icons/money/outline";
import { IconDocument2Text } from "@zeeve-platform/icons/document/outline";
import { IconMonitor } from "@zeeve-platform/icons/electronic/outline";
import MonitoringDashboard from "../monitoring/monitoring";
import Overview from "./overview/overview";
import BlockchainConfig from "./blockchain-config/blockchain-config";
import Wallet from "./wallet/wallet";
import SmartContracts from "./smart-contracts/smart-contracts";
import Nodes from "./nodes/nodes";
import { useZkSyncDashboard } from "./dashboard-context";
import DemoNetworkInfo from "./demo-network-info";
import IconBlocks from "@/components/icons/blocks";

const DashboardTabs = () => {
  const { isLoading, error, refresh } = useZkSyncDashboard();

  if (isLoading) {
    return (
      <div className="rounded-lg border border-dashed border-brand-outline p-6 text-center text-sm text-brand-gray">
        Loading ZkSync dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-brand-red/50 p-6 text-center text-sm text-brand-dark">
        <p>Failed to load ZkSync data: {error}</p>
        <Z4Button colorScheme="primary" onClick={() => refresh()}>
          Retry
        </Z4Button>
      </div>
    );
  }

  return (
    <>
      <DemoNetworkInfo className="mb-4" />
      <Z4Tabs orientation="horizontal" className="rounded-none border-none">
        <Z4TabList className="mb-4 gap-4 overflow-x-auto border">
          <Z4Tab className="whitespace-nowrap font-semibold">
            {<IconChart2Square className="me-2 size-5" />} Overview
          </Z4Tab>
          <Z4Tab className="whitespace-nowrap font-semibold">
            {<IconBlocks className="me-2 size-5" />} Rollup Config
          </Z4Tab>
          {/* <Z4Tab className="whitespace-nowrap font-semibold">Bridge</Z4Tab> */}
          <Z4Tab className="whitespace-nowrap font-semibold">{<IconBubbles className="me-2 size-5" />} Services</Z4Tab>
          <Z4Tab className="whitespace-nowrap font-semibold">
            {<IconEmptyWallet className="me-2 size-5" />} Wallets
          </Z4Tab>
          <Z4Tab className="whitespace-nowrap font-semibold">
            {<IconDocument2Text className="me-2 size-5" />} Smart Contracts
          </Z4Tab>
          <Z4Tab className="whitespace-nowrap font-semibold">
            {<IconMonitor className="me-2 size-5" />} Monitoring
          </Z4Tab>
          {/* <Z4Tab className="whitespace-nowrap font-semibold">Cloud Infra</Z4Tab> */}
          {/* {supernetInfo.data?.ownedBy !== user?.usercred && !supernetInfo.isLoading ? (
                      <Tab>Data Availability</Tab>
                  ) : (
                      <> </>
                  )} */}
          {/* <Z4Tab className="whitespace-nowrap font-semibold">Sample Apps</Z4Tab> */}
        </Z4TabList>
        <TabPanels>
          <TabPanel>
            <Overview />
          </TabPanel>
          <TabPanel>
            <BlockchainConfig />
          </TabPanel>
          {/* <TabPanel>
            <Bridge />
          </TabPanel> */}
          <TabPanel>
            <Nodes />
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
            <CloudInfra />
          </TabPanel> */}
          {/* {supernetInfo.data?.ownedBy !== user?.usercred && !supernetInfo.isLoading ? (
                      <TabPanel>
                          <DataAvailability />
                      </TabPanel>
                  ) : (
                      <> </>
                  )} */}
          {/* <TabPanel>
            <UniswapPage />
          </TabPanel> */}
        </TabPanels>
      </Z4Tabs>
    </>
  );
};

const NetworkIdPageTabs = () => {
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

export default NetworkIdPageTabs;
