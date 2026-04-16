"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import Actions from "./_components/actions";
import IdPageTabs from "./_components/tabs/tabs";
import { ActionsDropDown } from "./_components/actions-dropdown";
import ROUTES from "@orbit/routes";
import { getConfig } from "@/config";
import { useNetworkStore } from "@orbit/store/network";
import { withBasePath } from "@orbit/utils/helpers";
import PageHeader from "@/components/shared/PageHeader";
import { getNetworkName } from "@orbit/utils/network-overview";
import useOpStackService from "@/modules/arbitrum-orbit/services/arbitrum-orbit/use-arbitrum-orbit-service";

const IdPageClient = () => {
  const params = useParams();
  const networkId = params.id as string;
  const {
    request: { data: networkOverviewApiData, isLoading }
  } = useOpStackService().network.overview(networkId);
  const setNetworkInfo = useNetworkStore((state) => state.setNetworkInfo);
  const overviewData = networkOverviewApiData?.data;

  useEffect(() => {
    setNetworkInfo(isLoading);
    if (overviewData) {
      setNetworkInfo(isLoading, overviewData);
    }
  }, [setNetworkInfo, isLoading, overviewData]);

  const config = getConfig();
  const oldPlatformFrontendUrl = config.url?.external?.platformOld?.frontend;

  const from = localStorage.getItem("from") || "";
  const path_url = localStorage.getItem("workspace_url") || "";
  const items = [
    {
      href: ROUTES.PLATFORM.PAGE.HOME,
      label: "Dashboard",
      as: Link,
    },
    {
      href: withBasePath("/opstack"),
      label: "OP Stack",
      as: Link,
      isActive: false,
    },
    {
      href: withBasePath(`${"/opstack/network"}/${networkId}`),
      label: getNetworkName(overviewData) ?? networkId,
      as: Link,
      isActive: true,
    },
  ];
  //Adding workspace name to the breadcrumb
  if (from === "workspace") {
    const breadcrumbPart = {
      href: `${oldPlatformFrontendUrl}${ROUTES.PLATFORM.PAGE.WORKSPACE}/${path_url}`,
      label: localStorage.getItem("workspaceName") as string,
      as: Link,
    };

    items.splice(2, 0, breadcrumbPart);
  }

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      <PageHeader
        title="OP Stack"
        breadcrumbs={items.map((i) => ({ href: i.href as string, label: i.label, isActive: i.isActive }))}
        actions={
          <>
            <div className="hidden md:block">
              <Actions />
            </div>
            <div className="block md:hidden">
              <ActionsDropDown />
            </div>
          </>
        }
      />
      <IdPageTabs />
    </div>
  );
};

export default IdPageClient;
