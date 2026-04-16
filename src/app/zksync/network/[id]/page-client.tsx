"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Spinner } from "@zeeve-platform/ui";
import NetworkIdPageTabs from "./_components/tabs/tabs";
import NetworkAction from "./_components/dropdown/network-actions";
import ExplorersAction from "./_components/dropdown/explorers-action";
import { ZkSyncDashboardProvider } from "./_components/tabs/dashboard-context";
import Navigation from "@/components/navigation/navigation";
import { useConfigStore } from "@/store/config";
import ROUTES from "@/routes";
import { withBasePath } from "@/utils/helpers";
import { useZksyncStore } from "@/store/zksync";
import ZksyncAnalyticsAction from "@/components/dropdown/zksync-analytics-action";

const NetworkIdPageClient = () => {
  const params = useParams();
  const networkId = params.id as string;

  const platformFrontendUrl = useConfigStore((state) => state.config?.url?.external?.platformOld?.frontend);
  const newPlatformFrontendUrl = useConfigStore((state) => state.config?.url?.external?.platformNew?.frontend);
  const superNetInfo = useZksyncStore((state) => state.zksyncInfo);

  const from = localStorage.getItem("from") || "";
  const path_url = localStorage.getItem("workspace_url") || "";
  const items = [
    {
      href: withBasePath(`${ROUTES.PLATFORM.PAGE.DASHBOARD}`),
      label: "Dashboard",
    },
    {
      href: from === "workspace" ? `${platformFrontendUrl}${ROUTES.PLATFORM.PAGE.WORKSPACE}` : "/zksync",
      label: from === "workspace" ? "Workspaces" : "ZkSync",
    },
    {
      href: `/zksync/network/${networkId}`,
      label: superNetInfo.isLoading ? (
        <Spinner colorScheme={"cyan"} className="size-4" />
      ) : (
        (superNetInfo.data?.name ?? networkId)
      ),
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
    <ZkSyncDashboardProvider serviceId={networkId}>
      <div className="flex flex-col gap-y-2 lg:gap-y-6">
        <Navigation
          heading={"ZkSync"}
          logo={
            <Image
              src={withBasePath("/assets/images/protocol/Polygon_icon.svg")}
              width={200}
              height={100}
              alt="ZkSync"
            />
          }
          breadcrumb={{ items: items }}
        >
          {/* page actions */}
          <div className="flex flex-row gap-x-4">
            <ExplorersAction />
            <ZksyncAnalyticsAction />
            <NetworkAction />
          </div>
        </Navigation>
        <div className="rounded-lg px-3 pb-3 pt-2 lg:px-6 lg:pb-6">
          <NetworkIdPageTabs />
        </div>
      </div>
    </ZkSyncDashboardProvider>
  );
};

export default NetworkIdPageClient;
