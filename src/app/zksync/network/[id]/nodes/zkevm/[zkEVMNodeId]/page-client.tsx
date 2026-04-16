"use client";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import NodeActions from "./_components/node-actions";
import ZkEVMNodeIdPageTabs from "./_components/tabs/tabs";
import Navigation from "@/components/navigation/navigation";
import { useConfigStore } from "@/store/config";
import ROUTES from "@/routes";
import { useNodeStore } from "@/store/node";
import AnalyticsAction from "@/components/dropdown/analytics-action";
import DemoSupernetInfo from "@/components/demo-supernet-info";
import { withBasePath } from "@/utils/helpers";

const ZkEVMNodeIdPageClient = () => {
  // get dynamic params
  const {
    id: networkId,
    zkEVMNodeId,
  }: {
    id: string;
    zkEVMNodeId: string;
  } = useParams();

  // get network name to show as breadcrumb label
  const searchParams = useSearchParams();
  const networkName = searchParams.get("network");

  const platformFrontendUrl = useConfigStore((state) => state.config?.url?.external?.platformOld?.frontend);
  const newPlatformFrontendUrl = useConfigStore((state) => state.config?.url?.external?.platformNew?.frontend);

  const nodeInfo = useNodeStore((state) => state.nodeInfo);

  const from = localStorage.getItem("from") || "";
  const path_url = localStorage.getItem("workspace_url") || "";
  const items = [
    {
      href: `${newPlatformFrontendUrl}`,
      label: "Dashboard",
    },
    {
      href:
        from === "workspace" ? `${platformFrontendUrl}${ROUTES.PLATFORM.PAGE.WORKSPACE}` : ROUTES.VALIDIUM.PAGE.LIST,
      label: from === "workspace" ? "Workspaces" : "ZkSync",
    },
    {
      href: `/zksync/network/${networkId}`,
      label: networkName ?? networkId,
    },
    {
      href: `/zksync/network/${networkId}/nodes/zkevm/${zkEVMNodeId}`,
      label: nodeInfo.data?.name ?? zkEVMNodeId,
      isActive: true,
    },
  ];
  //Adding workspace name to the breadcrumb
  if (from === "workspace") {
    const breadcrumbPart = {
      href: `${platformFrontendUrl}${ROUTES.PLATFORM.PAGE.WORKSPACE}/${path_url}`,
      label: localStorage.getItem("workspaceName") as string,
    };

    items.splice(2, 0, breadcrumbPart);
  }

  return (
    <div className="flex flex-col gap-y-2 lg:gap-y-6">
      <Navigation
        heading={"ZkSync"}
        logo={
          <Image
            src={withBasePath("/assets/images/protocol/Polygon_icon.svg")}
            width={200}
            height={100}
            alt="Polygon-CDK"
          />
        }
        breadcrumb={{ items: items }}
      >
        <div className="flex flex-row gap-x-4">
          <AnalyticsAction />
          <NodeActions />
        </div>
      </Navigation>
      <div className="rounded-lg border border-brand-outline bg-white px-3 pt-2 lg:px-6 lg:pb-6">
        {/* <DemoSupernetInfo /> */}
        <ZkEVMNodeIdPageTabs />
      </div>
    </div>
  );
};

export default ZkEVMNodeIdPageClient;
