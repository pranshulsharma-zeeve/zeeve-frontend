"use client";
import {
  Button,
  DropdownMenu,
  DropdownMenuButton,
  DropdownMenuItem,
  DropdownMenuList,
  IconButton,
  Link,
  Tooltip,
  useToggle,
} from "@zeeve-platform/ui";
import { IconChart5Square } from "@zeeve-platform/icons/business/outline";
import { IconBoxSquare } from "@zeeve-platform/icons/delivery/outline";
import { useParams } from "next/navigation";
import { IconTrash } from "@zeeve-platform/icons/essential/outline";
import useAnalyticsService from "@orbit/services/analytics/use-analytics-service";
import { useNetworkStore } from "@orbit/store/network";
import { useModalStore } from "@orbit/store/modal";
import { useUserStore } from "@orbit/store/user";
import {
  getAnalyticsId,
  getL1ExplorerUrl,
  getL2ExplorerUrl,
  getL3ExplorerUrl,
  getNetworkName,
  getNetworkOwner,
  getNetworkStatus,
} from "@orbit/utils/network-overview";

const AnalyticsAction = ({ isNodeDetailPage }: { isNodeDetailPage?: boolean }) => {
  const { isOpen, handleToggle, handleClose } = useToggle();
  const params = useParams();
  const networkId = params.id as string;
  const { openModal } = useModalStore();
  const user = useUserStore((state) => state.user);
  const networkInfo = useNetworkStore((state) => state.networkInfo);
  const {
    request: { isLoading, data },
  } = useAnalyticsService().dashboardUrls(getAnalyticsId(networkInfo.data) as string);
  const analyticsDashboards =
    Array.isArray(data) && data.length > 0
      ? data
      : [
          {
            dashboardName: "Dashboard",
            dashboardURL:
              "https://vision.prod.zeeve.net/zabbix.php?action=dashboard.view&dashboardid=423&from=now-5m&to=now",
          },
        ];

  return (
    <div className="flex flex-row gap-x-4">
      {isNodeDetailPage !== true ? (
        <div>
          <Link href={getL1ExplorerUrl(networkInfo.data) ?? ""} target={"_blank"}>
            <Button
              iconLeft={<IconBoxSquare className="text-xl" />}
              isLoading={networkInfo.isLoading}
              isDisabled={getNetworkStatus(networkInfo.data) !== "ready" || !getL1ExplorerUrl(networkInfo.data)}
              onClick={() => {
                const explorerUrl = getL1ExplorerUrl(networkInfo.data);
                if (explorerUrl && getNetworkStatus(networkInfo.data) === "ready") {
                  window.open(explorerUrl);
                }
              }}
            >
              L1 Explorer
            </Button>
          </Link>
          <Link href={getL2ExplorerUrl(networkInfo.data) ?? ""} target={"_blank"}>
            <Button
              iconLeft={<IconBoxSquare className="text-xl" />}
              isLoading={networkInfo.isLoading}
              isDisabled={getNetworkStatus(networkInfo.data) !== "ready" || !getL2ExplorerUrl(networkInfo.data)}
              onClick={() => {
                const explorerUrl = getL2ExplorerUrl(networkInfo.data);
                if (explorerUrl && getNetworkStatus(networkInfo.data) === "ready") {
                  window.open(explorerUrl);
                }
              }}
            >
              L2 Explorer
            </Button>
          </Link>
          <Link href={getL3ExplorerUrl(networkInfo.data) ?? ""} target={"_blank"}>
            <Button
              iconLeft={<IconBoxSquare className="text-xl" />}
              isLoading={networkInfo.isLoading}
              isDisabled={getNetworkStatus(networkInfo.data) !== "ready" || !getL3ExplorerUrl(networkInfo.data)}
              onClick={() => {
                const explorerUrl = getL3ExplorerUrl(networkInfo.data);
                if (explorerUrl && getNetworkStatus(networkInfo.data) === "ready") {
                  window.open(explorerUrl);
                }
              }}
            >
              L3 Explorer
            </Button>
          </Link>
        </div>
      ) : null}
      <DropdownMenu onClose={handleClose} isOpen={isOpen} placement="bottom-start">
        <DropdownMenuButton
          as={Button}
          onClick={handleToggle}
          isDisabled={getNetworkStatus(networkInfo.data) !== "ready" || analyticsDashboards.length === 0}
          iconLeft={<IconChart5Square className="text-xl" />}
          isLoading={isLoading || networkInfo.isLoading}
          isFullWidth
        >
          Analytics
        </DropdownMenuButton>
        <DropdownMenuList className="p-0">
          {analyticsDashboards.map((dashboard, index) => (
            <Link target="_blank" rel="noopener noreferrer" key={index} href={dashboard.dashboardURL}>
              <DropdownMenuItem className="border-b-[#DFDFDF] text-sm font-normal hover:bg-[#CED7FF] hover:text-brand-dark">
                {dashboard.dashboardName}
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuList>
      </DropdownMenu>
      {isNodeDetailPage !== true ? (
        <Tooltip text="Delete Network" placement={"top-start"}>
          <IconButton
            colorScheme="red"
            variant={"ghost"}
            isLoading={networkInfo.isLoading}
            isDisabled={
              !(
                ["provisioning", "ready", "failed"].includes(getNetworkStatus(networkInfo.data) ?? "") &&
                getNetworkOwner(networkInfo.data) === user?.usercred
              )
            }
            onClick={() => {
              openModal("deleteNetwork", {
                deleteNetwork: {
                  networkId,
                  networkName: getNetworkName(networkInfo.data) as string,
                },
              });
            }}
          >
            {<IconTrash className="text-xl" />}
          </IconButton>
        </Tooltip>
      ) : undefined}
    </div>
  );
};

export default AnalyticsAction;
