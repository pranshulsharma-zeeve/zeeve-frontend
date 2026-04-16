"use client";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import NodeActions from "./_components/node-actions";
import NodeGeneralInfo from "./_components/node-general-info";
import CloudInfra from "./_components/cloud-infra";
import Parameters from "./_components/parameters";
import RPCEndpoint from "./_components/rpc-endpoint";
import Configurations from "./_components/configurations";
import Navigation from "@/components/navigation/navigation";
import { useConfigStore } from "@/store/config";
import ROUTES from "@/routes";
import { useNodeStore } from "@/store/node";
import AnalyticsAction from "@/components/dropdown/analytics-action";
import DemoSupernetInfo from "@/components/demo-supernet-info";
import { withBasePath } from "@/utils/helpers";

const RPCNodeIdPageClient = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const networkName = searchParams.get("network");
  const networkId = params.id as string;
  const rpcNodeId = params.rpcNodeId as string;

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
      label: from === "workspace" ? "Workspaces" : "Polygon CDK",
    },
    {
      href: `/polygon-cdk/network/${networkId}`,
      label: networkName ?? networkId,
    },
    {
      href: `/polygon-cdk/network/${networkId}/nodes/rpc/${rpcNodeId}`,
      label: nodeInfo.data?.name ?? rpcNodeId,
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
        heading={"Polygon CDK"}
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
        {/* page actions */}
        <div className="flex flex-row gap-x-4">
          <AnalyticsAction />
          <NodeActions />
        </div>
      </Navigation>
      <div className="rounded-lg border border-brand-outline bg-white p-3 lg:p-6">
        <div className="grid grid-cols-12 gap-3 text-brand-dark lg:gap-6">
          {/* <DemoSupernetInfo /> */}
          <NodeGeneralInfo />
          <Parameters />
          <CloudInfra />
          <RPCEndpoint />
          <Configurations />
        </div>
      </div>
    </div>
  );
};

export default RPCNodeIdPageClient;
