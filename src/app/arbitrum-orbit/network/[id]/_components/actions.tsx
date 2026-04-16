"use client";
import {
  Button,
  IconButton,
  Link,
  useToggle,
} from "@zeeve-platform/ui";
import { useParams } from "next/navigation";
import { IconTrash } from "@zeeve-platform/icons/essential/outline";
import { IconDocument1 } from "@zeeve-platform/icons/document/outline";
import { IconArrowUpRightFromSquare } from "@zeeve-platform/icons/arrow/outline";
import { IconBoxSquare } from "@zeeve-platform/icons/delivery/outline";
import { useModalStore } from "@orbit/store/modal";
import useAnalyticsService from "@orbit/services/analytics/use-analytics-service";
import { useNetworkStore } from "@orbit/store/network";
import { useUserStore } from "@orbit/store/user";
import {
  getAnalyticsId,
  getBridgeUrl,
  getFaucetUrl,
  getL2TokenInfo,
  getL2ExplorerUrl,
  getNetworkName,
  getNetworkOwner,
  getNetworkStatus,
  getL3ExplorerUrl,
} from "@orbit/utils/network-overview";

const Actions = () => {
  const {
    isOpen: isAnalyticsDropdownOpen,
    handleToggle: handleAnalyticsDropdownToggle,
    handleClose: handleAnalyticsDropdownClose,
  } = useToggle();
  const params = useParams();
  const networkId = params.id as string;
  const { openModal } = useModalStore();
  const user = useUserStore((state) => state.user);
  const networkInfo = useNetworkStore((state) => state.networkInfo);
  const networkStatus = getNetworkStatus(networkInfo.data);
  const bridgeUrl = getBridgeUrl(networkInfo.data);
  const faucetUrl = getFaucetUrl(networkInfo.data);
  const explorerUrl = getL3ExplorerUrl(networkInfo.data);
  const l2TokenInfo = getL2TokenInfo(networkInfo.data);
  const {
    request: { data, isLoading },
  } = useAnalyticsService().dashboardUrls(getAnalyticsId(networkInfo.data) as string);
  return (
    <div className="flex flex-row gap-x-4 overflow-x-auto scrollbar-hide">
      {/* <Z4Button
        variant={"outline"}
        colorScheme={"blue"}
        isLoading={networkInfo.isLoading}
        isDisabled={networkStatus !== "ready"}
        onClick={() => {}}
      >
        RPC Endpoint
      </Z4Button> */}
      {/* Explorer Button */}
      <Button
        iconLeft={<IconBoxSquare className="text-xl" />}
        isLoading={networkInfo.isLoading}
        isDisabled={networkStatus !== "active" || !explorerUrl}
        onClick={() => {
          if (explorerUrl && networkStatus === "active") {
            window.open(explorerUrl);
          }
        }}
      >
        Explorer
      </Button>
      <Button
        iconLeft={<IconDocument1 className="text-xl" />}
        isLoading={networkInfo.isLoading}
        isDisabled={networkStatus !== "active"}
        onClick={() => {
          window.open("https://docs.zeeve.io/rollups/arbitrum-orbit", "_blank");
        }}
      >
        Docs
      </Button>
      {/* Bridge Button */}
      <Button
        iconLeft={<IconArrowUpRightFromSquare className="text-xl" />}
        isLoading={networkInfo.isLoading}
        isDisabled={networkStatus !== "active" || !bridgeUrl}
        onClick={() => {
          if (bridgeUrl) {
            window.open(bridgeUrl);
          }
        }}
      >
        Bridge
      </Button>
      {/* Faucet Button */}
      {l2TokenInfo?.type?.toLowerCase() === "custom" && (
        <Button
          iconLeft={<IconArrowUpRightFromSquare className="text-xl" />}
          isLoading={networkInfo.isLoading}
          isDisabled={networkStatus !== "active" || !faucetUrl}
          onClick={() => {
            if (faucetUrl) {
              window.open(faucetUrl);
            }
          }}
        >
          Faucet
        </Button>
      )}
      {/* Analytics Dropdown */}
      {/* <DropdownMenu onClose={handleAnalyticsDropdownClose} isOpen={isAnalyticsDropdownOpen} placement="bottom-start">
        <DropdownMenuButton
          as={Button}
          onClick={handleAnalyticsDropdownToggle}
          // isDisabled={networkStatus !== "ready" || analyticsDashboards.length === 0}
          // iconLeft={<IconChart5Square className="text-xl" />}
          variant={"outline"}
          colorScheme={"blue"}
          className="rounded-md"
          isLoading={isLoading || networkInfo.isLoading}
          isFullWidth
        >
          Analytics
        </DropdownMenuButton>
        <DropdownMenuList className="p-0">
          {analyticsDashboards.map((dashboard, index) => (
            <Link key={index} href={dashboard.dashboardURL} target={"_blank"}>
              <DropdownMenuItem className="border-b-[#DFDFDF] text-sm font-normal hover:bg-[#CED7FF] hover:text-brand-dark">
                {dashboard.dashboardName}
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuList>
      </DropdownMenu> */}
      {/* Network Delete Button */}
      {/* <Tooltip text="Delete Network" placement={"top-start"}>
        <IconButton
          colorScheme="red"
          variant={"outline"}
          isLoading={networkInfo.isLoading}
          isDisabled={
            !(
              ["provisioning", "ready", "failed"].includes(networkStatus ?? "") &&
              getNetworkOwner(networkInfo.data) === user?.usercred
            )
          }
          onClick={() => {
            openModal("deleteNetwork", {
              deleteNetwork: { networkId, networkName: getNetworkName(networkInfo.data) as string },
            });
          }}
        >
          {<IconTrash className="text-xl" />}
        </IconButton>
      </Tooltip> */}
    </div>
  );
};

export default Actions;
