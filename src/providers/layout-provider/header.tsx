"use client";
import React, { useCallback, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuButton,
  DropdownMenuItem,
  DropdownMenuList,
  useToggle,
  tx,
} from "@zeeve-platform/ui";
import { IconBook2 } from "@zeeve-platform/icons/school/outline";
import { IconVideoSquare } from "@zeeve-platform/icons/media/outline";
import { IconSetting1 } from "@zeeve-platform/icons/setting/outline";
import { IconUser } from "@zeeve-platform/icons/user/outline";
import { ZeeveHeader, ZeeveHeaderDropdownMenu } from "@zeeve-platform/ui-common-components";
import { IconArrowLeftFromBucket } from "@zeeve-platform/icons/arrow/outline";
import { useConfigStore } from "@/store/config";
import { useUserStore } from "@/store/user";
import { useVisionUserStore } from "@/store/vizionUser";
import useAxios from "@/hooks/use-axios";
import { clearAccessToken, getStoredAccessToken } from "@/utils/auth-token";
import { withBasePath } from "@/utils/helpers";
import { authAxiosInstance } from "@/utils/auth-axios";
import { withApiBasePath } from "@/constants/api";
import SETTINGS_ROUTES from "@/routes/settings/routes";
import NotificationBell from "@/features/notifications/NotificationBell";

interface HeaderProps {
  handleMobileSidebarOpen: () => void;
}

const Header = (props: HeaderProps) => {
  const { handleMobileSidebarOpen } = props;

  const config = useConfigStore((state) => state.config);
  const user = useUserStore((state) => state.user);
  const { isOpen: isLearnMenuOpen, handleClose: closeLearnMenu, handleToggle: toggleLearnMenu } = useToggle();

  /** reset user state, delete cookies and logout */
  const resetUser = useUserStore((state) => state.reset);
  const resetVisionUser = useVisionUserStore((state) => state.reset);

  const { setAuthToken } = useAxios();

  const logout = useCallback(async () => {
    try {
      // Call logout without a body; cookies sent via withCredentials
      await authAxiosInstance.post(withApiBasePath("/logout"));
    } catch (err) {
      // Log and continue with client-side cleanup
      console.error("Logout failed:", err);
    } finally {
      resetUser();
      resetVisionUser();
      clearAccessToken();
      setAuthToken(null);
      if (typeof window !== "undefined") {
        const loginPath = withBasePath("/account/login");
        try {
          const loginUrl = new URL(loginPath, window.location.origin);
          loginUrl.searchParams.set("serviceURL", window.location.href);
          window.open(loginUrl.toString(), "_self");
        } catch (navigationError) {
          console.error("Failed to redirect to login after logout:", navigationError);
          window.open(`${window.location.origin}${loginPath}`, "_self");
        }
      }
    }
  }, [resetUser, resetVisionUser, setAuthToken]);

  const accessToken = getStoredAccessToken() ?? "";

  const inAppNotificationsBackendUrl = config?.url?.external?.inAppNotifications?.backend;
  const documentationUrl = config?.other?.documentation;
  const demoVideoUrl = config?.other?.videos;
  const hasLearnLinks = Boolean(documentationUrl || demoVideoUrl);

  // profile dropdown menu
  const profileDropdownMenu = useMemo<ZeeveHeaderDropdownMenu>(() => {
    return [
      {
        group: {
          items: [
            {
              icon: <IconUser className="text-xl" />,
              title: "Profile",
              onClick: () => {
                window.open(`${SETTINGS_ROUTES.PAGE.ROOT}`, "_self");
              },
            },
            {
              icon: <IconSetting1 className="text-xl" />,
              title: "Settings",
              onClick: () => {
                window.open(`${SETTINGS_ROUTES.PAGE.ROOT}`, "_self");
              },
            },
          ],
        },
      },
      {
        group: {
          items: [
            {
              icon: <IconArrowLeftFromBucket className="text-xl" />,
              title: "Logout",
              onClick: () => {
                logout();
              },
            },
          ],
        },
      },
    ];
  }, [logout]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 right-4 z-10 flex items-center md:hidden">
        <div className="pointer-events-auto">
          <NotificationBell className="bg-white/80 backdrop-blur-sm hover:bg-white" />
        </div>
      </div>
      {hasLearnLinks ? (
        <div className="pointer-events-none absolute inset-y-0 right-40 z-10 hidden items-center md:flex lg:right-[19.5rem] xl:right-80">
          <div className="pointer-events-auto flex items-center gap-4">
            <DropdownMenu isOpen={isLearnMenuOpen} onClose={closeLearnMenu} placement="bottom-end">
              <DropdownMenuButton
                type="button"
                onClick={toggleLearnMenu}
                className={tx(
                  "inline-flex h-10 items-center gap-2 rounded-lg border border-brand-primary bg-brand-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary/90",
                  isLearnMenuOpen ? "bg-brand-primary/90" : "",
                )}
              >
                <IconBook2 className="text-base" />
                Resources
              </DropdownMenuButton>
              <DropdownMenuList className="min-w-[220px] rounded-2xl border border-slate-200 bg-white p-1 shadow-[0_18px_40px_rgba(15,23,42,0.15)]">
                {documentationUrl ? (
                  <DropdownMenuItem
                    className="flex items-center gap-3 rounded-xl p-3 !text-slate-700 hover:!bg-[#E8EDFF] hover:!text-brand-primary data-[highlighted]:!bg-[#E8EDFF] data-[highlighted]:!text-brand-primary data-[state=open]:!text-brand-primary"
                    onClick={() => window.open(documentationUrl, "_blank", "noopener,noreferrer")}
                  >
                    <IconBook2 className="text-base" />
                    Documentation
                  </DropdownMenuItem>
                ) : null}
                {demoVideoUrl ? (
                  <DropdownMenuItem
                    className="flex items-center gap-3 rounded-xl p-3 !text-slate-700 hover:!bg-[#E8EDFF] hover:!text-brand-primary data-[highlighted]:!bg-[#E8EDFF] data-[highlighted]:!text-brand-primary data-[state=open]:!text-brand-primary"
                    onClick={() => window.open(demoVideoUrl, "_blank", "noopener,noreferrer")}
                  >
                    <IconVideoSquare className="text-base" />
                    Demo Video
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuList>
            </DropdownMenu>
            <NotificationBell className="bg-white/80 backdrop-blur-sm hover:bg-white" />
          </div>
        </div>
      ) : null}
      <ZeeveHeader
        className={tx("!border-b-0 bg-transparent shadow-none pr-14 sm:pr-16 md:pr-10 lg:pr-5")}
        disableNotifications={true}
        profileDropdownMenu={profileDropdownMenu}
        onMenuButtonClick={handleMobileSidebarOpen}
        notificationsWSURL={inAppNotificationsBackendUrl}
        talkToExpertButton={{
          label: "Talk to an Expert",
          onClick: () => {
            window.open("https://zeeve.zohodesk.com/portal/en/signin", "_blank", "noopener noreferrer");
          },
          buttonClassName: "h-8 rounded-lg px-2 text-xs sm:h-9 sm:px-4 sm:text-sm lg:h-10 lg:px-5",
          iconClassName: "text-sm sm:text-lg",
        }}
        accessToken={accessToken}
        user={{
          email: user?.usercred as string,
          firstName: user?.first_name as string,
          lastName: user?.last_name,
        }}
        profileImageUrl={user?.image_url ? user.image_url : ""}
      />
    </div>
  );
};

export default Header;
