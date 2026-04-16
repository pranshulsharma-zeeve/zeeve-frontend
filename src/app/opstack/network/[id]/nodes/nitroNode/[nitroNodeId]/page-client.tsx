"use client";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Spinner } from "@zeeve-platform/ui";
import Parameters from "../../../_components/parameters";
import Alerts from "../../../_components/tabs/overview/alerts";
import NodeGeneralInfo from "../../node-general-info";
import RPCEndpoint from "../../rpc-endpoint";
import DemoNetworkInfo from "../../../_components/tabs/demo-network-info";
import Navigation from "@orbit/components/navigation/navigation";
import ROUTES from "@orbit/routes";
import AnalyticsAction from "@orbit/components/dropdown/analytics-action";
import { getConfig } from "@/config";
import { withBasePath } from "@orbit/utils/helpers";
import useOpStackService from "@orbit/services/arbitrum-orbit/use-arbitrum-orbit-service";

const NitroNodeIdPageClient = () => {
  const searchParams = useSearchParams();
  const networkName = searchParams.get("network");
  const { id, nitroNodeId } = useParams();

  const networkId = Array.isArray(id) ? id[0] : id;
  const nodeId = Array.isArray(nitroNodeId) ? nitroNodeId[0] : nitroNodeId;

  const {
    request: { data, isLoading },
  } = useOpStackService().node.detail(networkId, nodeId);

  const config = getConfig();
  const newPlatformFrontendUrl =
    config.url?.external?.platformNew?.frontend ??
    config.url?.external?.platformOld?.frontend ??
    config.url?.host ??
    "";
  const oldPlatformFrontendUrl = config.url?.external?.platformOld?.frontend;

  const from = localStorage.getItem("from") || "";
  const path_url = localStorage.getItem("workspace_url") || "";
  const networkPath = `${"/opstack/network"}/${networkId}`;
  const items = [
    {
      href: `${newPlatformFrontendUrl}`,
      label: "Dashboard",
    },
    {
      href:
        from === "workspace"
          ? `${oldPlatformFrontendUrl}${ROUTES.PLATFORM.PAGE.WORKSPACE}`
          : withBasePath("/opstack"),
      label: from === "workspace" ? "Workspaces" : "OP Stack",
    },
    {
      href: withBasePath(networkPath),
      label: networkName != undefined ? networkName : networkId,
    },
    {
      href: withBasePath(
        `${networkPath}/nodes/nitroNode/${nodeId}?network=${networkName != null ? networkName : networkId}`,
      ),
      label: isLoading ? <Spinner colorScheme={"cyan"} className="size-4" /> : (data?.data.nodeName ?? nodeId),
      isActive: true,
    },
  ];
  //Adding workspace name to the breadcrumb
  if (from === "workspace") {
    const breadcrumbPart = {
      href: `${oldPlatformFrontendUrl}${ROUTES.PLATFORM.PAGE.WORKSPACE}/${path_url}`,
      label: localStorage.getItem("workspaceName") as string,
    };

    items.splice(2, 0, breadcrumbPart);
  }

  return (
    <div className="flex flex-col gap-y-2 lg:gap-y-6">
      <Navigation
        heading={"OP Stack"}
        logo={
          <Image
            src={withBasePath("/assets/images/protocol/dashboard/op.svg")}
            alt="opstack-logo"
            width={32}
            height={32}
          />
        }
        breadcrumb={{ items: items }}
      >
        {/* page actions */}
        <div className="flex flex-row gap-x-4">
          <AnalyticsAction isNodeDetailPage={true} />
          {/* <NodeActions /> */}
        </div>
      </Navigation>
      <div className="rounded-xl bg-white p-3 lg:p-6">
        <div className="grid grid-cols-12 gap-3 text-brand-dark lg:gap-6">
          <DemoNetworkInfo />
          <NodeGeneralInfo data={data?.data} isLoading={isLoading} />
          <Parameters chain="l3" />
          <RPCEndpoint data={data?.data} isLoading={isLoading} />
          {/* <Alerts agentId={data?.data.agentId} /> */}
          <Alerts />
        </div>
      </div>
    </div>
  );
};

export default NitroNodeIdPageClient;
