"use client";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@zeeve-platform/ui";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, Spinner, StatusIcon, Z4Navigation } from "@zeeve-platform/ui";
import NodeConfiguration from "../../full/[id]/_components/details/node-configuration/node-configuration";
import Logs from "../../full/[id]/_components/details/logs/logs";
import GeneralInfo from "./_components/details/general-info";
import ROUTES from "@/routes";
import { capitalizeFirstLetter, withBasePath } from "@/utils/helpers";
import usePlatformService from "@/services/platform/use-platform-service";
import { PROTOCOL_MAPPING } from "@/constants/protocol";
import loaderImage from "/public/assets/images/loaders/zeeve-loader.gif";
import VisionIFrame from "@/app/vizion/page-client";
import IconBarChart from "@/components/icons/bar-chart";
import IconLogs from "@/components/icons/logs";

type LiteNode = {
  node_name?: string;
  protocol_name?: string;
  status?: string;
  next_billing_date?: string | false | null;
  created_on?: string;
  protocol_id?: string;
  node_id?: string;
  networkId?: string;
  plan_type?: string;
  networkName?: string;
  networkStatus?: string;
  networkCreatedAt?: string;
  networkType?: string;
};

const ArchiveNodeDetailPageClient = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const networkId = params.id as string;
  const protocolId = searchParams.get("protocolId") as string;
  const nodeParam = searchParams.get("node");
  const nodeData: LiteNode | null = nodeParam ? (JSON.parse(decodeURIComponent(nodeParam)) as LiteNode) : null;

  // const {
  //   request: { data, isLoading },
  // } = usePlatformService().protocol.details(networkId);

  const {
    request: { data: nodeDetails, isLoading },
  } = usePlatformService().network.nodeDetails(networkId);

  // Temporarily allow staying on details even if payment isn’t confirmed

  const isProvisioning = nodeData?.status === "provisioning";
  // Do not auto-redirect during provisioning; keep user on page

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      <Z4Navigation
        heading={
          <div>
            {isLoading ? (
              <Spinner colorScheme={"cyan"} />
            ) : (
              <div className="flex flex-row items-center gap-2">
                Archive Nodes -
                <Image
                  src={withBasePath(`/assets/images/protocols/${PROTOCOL_MAPPING[protocolId]?.icon}`)}
                  alt={`${PROTOCOL_MAPPING[protocolId]?.name} Icon`}
                  width={24}
                  height={24}
                />{" "}
                {PROTOCOL_MAPPING[protocolId]?.name}
              </div>
            )}
          </div>
        }
        breadcrumb={{
          items: [
            { label: "Dashboard", href: withBasePath(`${ROUTES.PLATFORM.PAGE.DASHBOARD}`), as: "a" },
            { label: "Manage Archive Nodes", href: withBasePath(ROUTES.PLATFORM.PAGE.MANAGE_ARCHIVE_NODES) },
            {
              label: "Node Details",
              href: withBasePath(`${ROUTES.PLATFORM.PAGE.MANAGE_ARCHIVE_NODES}/${networkId}?protocolId=${protocolId}`),
              isActive: true,
            },
          ],
        }}
      />

      <div className="rounded-xl">
        {nodeData?.status !== "ready" ? (
          <Card className="mb-3 flex w-full flex-row items-center gap-6 border border-brand-yellow bg-brand-yellow/5 lg:h-14">
            <StatusIcon status={"warning"} />
            <div className="flex flex-row items-center justify-around gap-3">
              <div className="text-sm font-medium text-brand-dark md:text-base">
                Your node is currently in the {capitalizeFirstLetter(nodeData?.status ?? "")} status. You will be able
                to access the endpoints once it transitions to the Ready status.
              </div>
            </div>
          </Card>
        ) : null}

        {!isProvisioning && !isLoading ? (
          <Tabs orientation="horizontal" className="rounded-none border-none bg-transparent">
            <TabList className="mb-4 gap-4 overflow-x-auto rounded-xl border-0 bg-white">
              <Tab>
                <span className="flex items-center gap-x-1">
                  <IconBarChart />
                  Overview
                </span>
              </Tab>
              {PROTOCOL_MAPPING[protocolId]?.name === "Etherlink" ? (
                <Tab>
                  <span className="flex items-center gap-x-2">
                    <IconLogs />
                    Logs
                  </span>
                </Tab>
              ) : (
                <></>
              )}
            </TabList>
            <TabPanels>
              <TabPanel>
                <div className="grid grid-cols-10 gap-3 text-brand-dark lg:gap-6">
                  <GeneralInfo data={nodeDetails?.data} isLoading={isLoading} />
                  {PROTOCOL_MAPPING[protocolId]?.name === "Etherlink" && (
                    <NodeConfiguration nodeDetails={nodeDetails} />
                  )}
                  <div className="col-span-10 flex flex-col">
                    <VisionIFrame
                      networkId={networkId}
                      protocolId={protocolId}
                      createdAt={nodeData?.created_on}
                      theme="light"
                    />
                  </div>
                </div>
              </TabPanel>
              <TabPanel hidden={PROTOCOL_MAPPING[protocolId]?.name !== "Etherlink"}>
                <Logs nodeDetails={nodeDetails} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <Image src={loaderImage} alt="Loading" width={150} height={150} />
            <p className="mt-4 text-lg font-medium text-brand-dark">Checking your payment status...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchiveNodeDetailPageClient;
