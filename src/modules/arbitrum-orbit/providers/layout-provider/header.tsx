/* eslint-disable prettier/prettier */
"use client";
import React, { useCallback, useMemo } from "react";
import { IconUser } from "@zeeve-platform/icons/user/outline";
import { ZeeveHeader, ZeeveHeaderDropdownMenu } from "@zeeve-platform/ui-common-components";
import { IconDocument1 } from "@zeeve-platform/icons/document/outline";
import { IconEndpoints1, IconEndpoints2, IconNodes } from "@zeeve-platform/icons/programming/outline";
import { IconArrowLeftFromBucket } from "@zeeve-platform/icons/arrow/outline";
import TokenManager from "@zeeve-platform/login-utility";
import { IconPhoneVolume } from "@zeeve-platform/icons/phone/outline";
import ROUTES from "@orbit/routes";
import { useUserStore } from "@orbit/store/user";
import { deleteCookie } from "@orbit/utils/cookies";
import { getConfig } from "@/config";

interface HeaderProps {
  handleMobileSidebarOpen: () => void;
}

const Header = (props: HeaderProps) => {
  const { handleMobileSidebarOpen } = props;

  const config = getConfig();
  const user = useUserStore((state) => state.user);

  /** reset user state, delete cookies and logout */
  const resetUser = useUserStore((state) => state.reset);
  const logout = useCallback(async () => {
    resetUser();
    deleteCookie("refresh_token");
    await TokenManager.getInstance().logout();
  }, [resetUser]);

  // access token
  let accessToken = "";
  if (config.environment !== "local") {
    accessToken = TokenManager.getInstance().getAccessToken();
  }

  const oldPlatformFrontendUrl = config.url?.external?.platformOld?.frontend;
  const zdfsFrontendUrl = config.url?.external?.zdfs?.frontend;
  const inAppNotificationsBackendUrl = config.url?.external?.inAppNotifications?.backend;
  const helpUrl = config.other?.help;
  const documentationUrl = config.other?.documentation;

  // create dropdown menu
  const createDropdownMenu = useMemo<ZeeveHeaderDropdownMenu>(() => {
    return [
      {
        group: {
          title: "Nodes",
          items: [
            {
              icon: <IconNodes className="text-xl" />,
              title: "Full Node",
              onClick: () => {
                window.open(`${oldPlatformFrontendUrl}${ROUTES.PLATFORM.PAGE.MANAGE_FULL_NODES}`, "_self");
              },
            },
            {
              icon: <IconEndpoints2 className="text-xl" />,
              title: "Validator Node",
              onClick: () => {
                window.open(`${oldPlatformFrontendUrl}${ROUTES.PLATFORM.PAGE.MANAGE_VALIDATOR_NODES}`, "_self");
              },
            },
          ],
        },
      },
      {
        group: {
          items: [
            {
              icon: <IconEndpoints1 className="text-xl" />,
              title: "Endpoints",
              onClick: () => {
                window.open(`${oldPlatformFrontendUrl}${ROUTES.PLATFORM.PAGE.MANAGE_ENDPOINTS}`, "_self");
              },
            },
          ],
        },
      },
      {
        group: {
          items: [
            {
              icon: <IconDocument1 className="text-xl" />,
              title: "File",
              onClick: () => {
                window.open(`${zdfsFrontendUrl}${ROUTES.ZDFS.PAGE.FILES}`, "_self");
              },
            },
          ],
        },
      },
    ];
  }, [oldPlatformFrontendUrl, zdfsFrontendUrl]);

  // profile dropdown menu
  const profileDropdownMenu = useMemo<ZeeveHeaderDropdownMenu>(() => {
    return [
      {
        group: {
          items: [
            {
              icon: <IconUser className="text-xl" />,
              title: "My Account",
              onClick: () => {
                window.open(`${oldPlatformFrontendUrl}${ROUTES.PLATFORM.PAGE.ACCOUNT}`, "_self");
              },
            },
            {
              icon: <IconPhoneVolume className="text-xl" />,
              title: "Helpdesk",
              onClick: () => {
                window.open(helpUrl, "_self");
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
  }, [logout, oldPlatformFrontendUrl]);

  return (
    <div className="relative z-[9999]">
      <ZeeveHeader
        // createDropdownMenu={createDropdownMenu}
        profileDropdownMenu={profileDropdownMenu}
        onMenuButtonClick={handleMobileSidebarOpen}
        notificationsWSURL={inAppNotificationsBackendUrl}
        accessToken={accessToken}
        user={{
          email: user?.usercred as string,
          firstName: user?.first_name as string,
          lastName: user?.last_name,
        }}
      />
    </div>
  );
};

export default Header;
