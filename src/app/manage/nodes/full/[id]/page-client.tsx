"use client";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@zeeve-platform/ui";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, Spinner, StatusIcon, Z4Navigation } from "@zeeve-platform/ui";
import GeneralInfo from "./_components/details/general-info";
import NodeConfiguration from "./_components/details/node-configuration/node-configuration";
import Logs from "./_components/details/logs/logs";
import { useUserStore } from "@/store/user";
import ROUTES from "@/routes";
import { capitalizeFirstLetter, withBasePath } from "@/utils/helpers";
import usePlatformService from "@/services/platform/use-platform-service";
import { PROTOCOL_MAPPING } from "@/constants/protocol";
import VisionIFrame from "@/app/vizion/page-client";
import loaderImage from "/public/assets/images/loaders/zeeve-loader.gif";
import IconBarChart from "@/components/icons/bar-chart";
import IconLogs from "@/components/icons/logs";
import { NodeDetailsResponse } from "@/services/platform/network/node-details";

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

const GeneralInfoLite = ({ node }: { node: LiteNode }) => {
  const user = useUserStore((s) => s.user);
  const name = node.node_name || node.networkName || "NA";
  const status = (node.status || node.networkStatus || "requested") as string;
  const createdOn = node.created_on || node.networkCreatedAt || "";
  const networkType = node.networkType || "NA";
  const ownedBy = user?.usercred || "NA";

  return (
    <div className="col-span-10 flex flex-col rounded-2xl border border-[#E1E1E14D] bg-white shadow-sm">
      <div className="flex items-center justify-between px-5 py-3 lg:px-6">
        <span className="text-[18px] font-semibold text-[#09122D]">General Information</span>
      </div>
      <div className="h-px w-full border-b border-[#E1E1E14D]" />
      <div className="grid grid-cols-1 gap-y-5 px-5 py-4 md:grid-cols-2 lg:grid-cols-5 lg:gap-y-0 lg:px-6 lg:py-5">
        <div className="min-w-0">
          <div className="text-sm font-medium text-[#7C8DB5]">Name</div>
          <div className="mt-1 truncate text-sm font-semibold text-[#09122D]">{name}</div>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-[#7C8DB5]">Network Type</div>
          <div className="mt-1 truncate text-sm font-semibold text-[#09122D]">{networkType || "NA"}</div>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-[#7C8DB5]">Status</div>
          <div className="mt-1 flex items-center text-sm font-semibold text-[#09122D]">{status}</div>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-[#7C8DB5]">Owned By</div>
          <div className="mt-1 truncate text-sm font-semibold text-[#09122D]">{ownedBy}</div>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-[#7C8DB5]">Created On</div>
          <div className="mt-1 truncate text-sm font-semibold text-[#09122D]">{createdOn || "NA"}</div>
        </div>
      </div>
    </div>
  );
};

const FullNodeDetailStandard = ({
  networkId,
  protocolId,
  nodeDetails,
}: {
  networkId: string;
  protocolId: string;
  nodeDetails?: NodeDetailsResponse;
}) => {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  // Map tab query param to tab index: infrastructure -> 0 (default), overview -> 0
  const defaultTabIndex = 0; // RPC nodes currently only have Overview tab

  const {
    request: { data, isLoading },
  } = usePlatformService().protocol.details(networkId);
  const isProvisioning = nodeDetails?.data?.status === "provisioning";
  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      <Z4Navigation
        heading={
          <div>
            {isLoading ? (
              <Spinner colorScheme={"cyan"} />
            ) : (
              <div className="flex flex-row items-center gap-2">
                RPC Nodes -
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
            { label: "Manage RPC Nodes", href: withBasePath(ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES) },
            {
              label: "Node Details",
              href: withBasePath(`${ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES}/${networkId}?protocolId=${protocolId}`),
              isActive: true,
            },
          ],
        }}
      />
      <div className="rounded-xl ">
        {nodeDetails?.data?.status !== "ready" ? (
          <Card className="mb-3 flex w-full flex-row items-center gap-6 border border-brand-yellow bg-brand-yellow/5 lg:h-14">
            <StatusIcon status={"warning"} />
            <div className="flex flex-row items-center justify-around gap-3">
              <div className="text-sm font-medium text-brand-dark md:text-base">
                Your node is currently in the {capitalizeFirstLetter(data?.network?.status ?? "")} status. You will be
                able to access the endpoints once it transitions to the Ready status.
              </div>
            </div>
          </Card>
        ) : null}
        {!isProvisioning && !isLoading ? (
          <Tabs
            orientation="horizontal"
            className="rounded-none border-none bg-transparent"
            defaultIndex={defaultTabIndex}
          >
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
                      networkId={data?.network.id}
                      protocolId={protocolId}
                      createdAt={data?.network.createdAt}
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
            <p className="mt-4 text-lg font-medium text-brand-dark">Loading node details...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const FullNodeDetailLite = ({
  node,
  protocolId,
  nodeDetails,
}: {
  node: LiteNode;
  protocolId: string;
  nodeDetails?: NodeDetailsResponse;
}) => {
  const params = useParams();
  const networkId = params.id as string;
  const status = (node.status || node.networkStatus || "requested") as string;
  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      <Z4Navigation
        heading={
          <div>
            <div className="flex flex-row items-center gap-2">
              RPC Nodes -
              <Image
                src={withBasePath(`/assets/images/protocols/${PROTOCOL_MAPPING[protocolId]?.icon}`)}
                alt={`${PROTOCOL_MAPPING[protocolId]?.name} Icon`}
                width={24}
                height={24}
              />{" "}
              {PROTOCOL_MAPPING[protocolId]?.name}
            </div>
          </div>
        }
        breadcrumb={{
          items: [
            { label: "Dashboard", href: withBasePath(`${ROUTES.PLATFORM.PAGE.DASHBOARD}`), as: "a" },
            { label: "Manage RPC Nodes", href: withBasePath(ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES) },
            {
              label: "Node Details",
              href: withBasePath(`${ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES}/${networkId}?protocolId=${protocolId}`),
              isActive: true,
            },
          ],
        }}
      />
      <div className="rounded-xl ">
        {status !== "ready" ? (
          <Card className="mb-3 flex w-full flex-row items-center gap-6 border border-brand-yellow bg-brand-yellow/5 lg:h-14">
            <StatusIcon status={"warning"} />
            <div className="flex flex-row items-center justify-around gap-3">
              <div className="text-sm font-medium text-brand-dark md:text-base">
                Your node is currently in the {capitalizeFirstLetter(status)} status. You will be able to access the
                endpoints once it transitions to the Ready status.
              </div>
            </div>
          </Card>
        ) : null}
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
                <GeneralInfoLite node={node} />
                {PROTOCOL_MAPPING[protocolId]?.name === "Etherlink" && <NodeConfiguration nodeDetails={nodeDetails} />}
                <div className="col-span-10 flex flex-col">
                  <VisionIFrame
                    networkId={(node.node_id || node.networkId) as string}
                    protocolId={protocolId}
                    createdAt={(node.created_on || node.networkCreatedAt) as string}
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
      </div>
    </div>
  );
};

const FullNodeDetailPageClient = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const networkId = params.id as string;
  const protocolId = searchParams.get("protocolId") as string;
  const nodeParam = searchParams.get("node");
  const nodeData: LiteNode | null = nodeParam ? (JSON.parse(decodeURIComponent(nodeParam)) as LiteNode) : null;
  const {
    request: { data: nodeDetails },
  } = usePlatformService().network.nodeDetails(networkId);

  if (nodeData) return <FullNodeDetailLite node={nodeData} protocolId={protocolId} nodeDetails={nodeDetails} />;
  return <FullNodeDetailStandard networkId={networkId} protocolId={protocolId} nodeDetails={nodeDetails} />;
};

export default FullNodeDetailPageClient;
