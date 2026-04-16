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
  tx,
  useToggle,
} from "@zeeve-platform/ui";
import { IconChart5Square } from "@zeeve-platform/icons/business/outline";
import { IconDocument1 } from "@zeeve-platform/icons/document/outline";
import { useMemo } from "react";
import { IconInfoCircle } from "@zeeve-platform/icons/essential/outline";
import useAnalyticsService from "@/services/analytics/use-analytics-service";
import { useZksyncStore } from "@/store/zksync";
import { useUserStore } from "@/store/user";
import { useZkSyncDashboard } from "@/app/zksync/network/[id]/_components/tabs/dashboard-context";

const normalizeBridgeUrl = (value?: string) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
};

const ZksyncAnalyticsAction = () => {
  const { isOpen, handleToggle, handleClose } = useToggle();
  const superNetInfo = useZksyncStore((state) => state.zksyncInfo);
  const user = useUserStore((state) => state.user);

  const {
    request: { isLoading, data },
  } = useAnalyticsService().dashboardUrls(superNetInfo.data?.analyticsId);
  const { normalized, isLoading: dashboardLoading } = useZkSyncDashboard();
  const bridgeUrl = useMemo(() => {
    const candidate =
      (normalized?.bridge?.url as string | undefined) ??
      (normalized?.rollupMetadata?.l2?.bridgeUrl as string | undefined) ??
      (normalized?.rollupMetadata?.l1?.bridgeUrl as string | undefined);
    return normalizeBridgeUrl(candidate);
  }, [normalized]);

  return (
    <>
      {superNetInfo.data?.ownedBy !== user?.usercred ? (
        <Link href={"https://docs.zeeve.io/rollups/zksync-hyperchain/demo-network"} target={"_blank"}>
          <Button iconLeft={<IconDocument1 className="text-xl" />}>Docs</Button>
        </Link>
      ) : undefined}
      <div className="flex items-center gap-2">
        <Tooltip text={"Bridge"} placement={"top-start"}>
          <Link as={"a"} target="_blank" rel="noopener noreferrer" href={bridgeUrl}>
            <Button isDisabled={!bridgeUrl} iconLeft={<IconDocument1 className="text-xl" />}>
              Bridge
            </Button>
          </Link>
        </Tooltip>
      </div>
      {/* <DropdownMenu onClose={handleClose} isOpen={isOpen} placement="bottom-start">
        <DropdownMenuButton
          as={Button}
          onClick={handleToggle}
          isDisabled={superNetInfo.data?.status !== "ready" || !data || data.length === 0}
          iconLeft={<IconChart5Square className="text-xl" />}
          isLoading={isLoading || superNetInfo.isLoading}
          isFullWidth
        >
          Analytics
        </DropdownMenuButton>
        <DropdownMenuList>
          {data?.map((dashboard, index) => (
            <Link target="_blank" rel="noopener noreferrer" key={index} href={dashboard.dashboardURL}>
              <DropdownMenuItem>{dashboard.dashboardName}</DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuList>
      </DropdownMenu> */}
    </>
  );
};

export default ZksyncAnalyticsAction;
