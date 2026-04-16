"use client";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@zeeve-platform/ui";
import React from "react";
import Overview from "./overview/overview";
import Sequencer from "./sequencer/sequencer";
import Aggregator from "./aggregator/aggregator";
import Synchronizer from "./synchronizer/synchronizer";

const ZkEVMNodeIdPageTabs = () => {
  return (
    <Tabs orientation="horizontal" className="rounded-none border-none">
      <TabList className="mb-4 gap-4 overflow-x-auto border-0">
        <Tab>Overview</Tab>
        <Tab>Sequencer</Tab>
        <Tab>Aggregator</Tab>
        <Tab>Synchronizer</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Overview />
        </TabPanel>
        <TabPanel>
          <Sequencer />
        </TabPanel>
        <TabPanel>
          <Aggregator />
        </TabPanel>
        <TabPanel>
          <Synchronizer />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default ZkEVMNodeIdPageTabs;
