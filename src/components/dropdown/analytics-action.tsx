"use client";
import {
  Button,
  DropdownMenu,
  DropdownMenuButton,
  DropdownMenuItem,
  DropdownMenuList,
  Link,
  useToggle,
} from "@zeeve-platform/ui";
import { IconChart5Square } from "@zeeve-platform/icons/business/outline";
import { IconDocument1 } from "@zeeve-platform/icons/document/outline";
import useAnalyticsService from "@/services/analytics/use-analytics-service";
import { useSuperNetStore } from "@/store/super-net";
import { useUserStore } from "@/store/user";

const AnalyticsAction = () => {
  const { isOpen, handleToggle, handleClose } = useToggle();
  const superNetInfo = useSuperNetStore((state) => state.superNetInfo);
  const user = useUserStore((state) => state.user);

  const {
    request: { isLoading, data },
  } = useAnalyticsService().dashboardUrls(superNetInfo.data?.analyticsId);

  return (
    <>
      {superNetInfo.data?.ownedBy !== user?.usercred ? (
        <Link href={"https://docs.zeeve.io/rollups/polygon-cdk-zkrollups/demo-network"} target={"_blank"}>
          <Button iconLeft={<IconDocument1 className="text-xl" />}>Docs</Button>
        </Link>
      ) : undefined}
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

export default AnalyticsAction;
