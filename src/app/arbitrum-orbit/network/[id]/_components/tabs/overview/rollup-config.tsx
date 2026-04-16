"use client";
import React, { useState } from "react";
import { Heading, IconButton, Tab, TabList, TabPanel, TabPanels, Tabs, Tooltip } from "@zeeve-platform/ui";
import { IconDownload } from "@zeeve-platform/icons/product/outline";
import { useParams } from "next/navigation";
import RollUpConfigTab from "./rollup-config-tab";
import { OVERVIEW_INFO } from "@orbit/types/overview";
import { downloadFile } from "@orbit/utils/helpers";

type GeneralProps = {
  data?: OVERVIEW_INFO | undefined;
  isLoading: boolean;
};

const RollUpConfig = ({ data, isLoading }: GeneralProps) => {
  const [currentConfigFileIndex, setCurrentConfigFileIndex] = useState(0);
  const { id } = useParams();
  const networkId = id as string;
  const l2Config = data?.rollup_metadata?.configs?.l2;
  const l3Config = data?.rollup_metadata?.configs?.l3;
  return (
    <div className="col-span-12 flex flex-col overflow-hidden rounded-lg border border-brand-outline p-4 xl:col-span-6 2xl:col-span-5">
      <div className="flex items-center justify-between">
        <Heading as="h4">Config Files</Heading>
        <Tooltip
          text={`Download ${currentConfigFileIndex == 0 ? "L2 Config" : "L3 Config"} File`}
          placement="top-start"
        >
          <IconButton
            colorScheme="primary"
            variant={"ghost"}
            size={"small"}
            isDisabled={currentConfigFileIndex == 0 ? !l2Config : !l3Config}
            onClick={() => {
              if (currentConfigFileIndex == 0 ? l2Config : l3Config) {
                downloadFile(
                  JSON.stringify(currentConfigFileIndex == 0 ? l2Config : l3Config),
                  `${networkId}-${currentConfigFileIndex == 0 ? "L2-Config" : "L3-Config"}-file.json`,
                  "application/json",
                );
              }
            }}
          >
            <IconDownload className="text-xl" />
          </IconButton>
        </Tooltip>
      </div>
      <Tabs orientation="horizontal" className="rounded-none border-none">
        <TabList className="gap-4 overflow-x-auto border-0 pb-4">
          <Tab onClick={() => setCurrentConfigFileIndex(0)} className="flex-auto">
            L2 Config
          </Tab>
          <Tab onClick={() => setCurrentConfigFileIndex(1)} className="flex-auto">
            L3 Config
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <RollUpConfigTab data={l2Config} isLoading={isLoading} />
          </TabPanel>
          <TabPanel>
            <RollUpConfigTab data={l3Config} isLoading={isLoading} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default RollUpConfig;
