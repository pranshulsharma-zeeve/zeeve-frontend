"use client";
import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useToggle } from "@zeeve-platform/ui";
import Header from "./header";
import Sidebar from "./sidebar";
import LayoutBackground from "@/components/layout-background";
import NotificationProvider from "@/features/notifications/NotificationProvider";
import ROUTES from "@/routes";
import { normalizePathname } from "@/utils/path";

const AUTH_ROUTES = [
  ROUTES.AUTH.PAGE.ROOT,
  ROUTES.AUTH.PAGE.LOGIN,
  ROUTES.AUTH.PAGE.REGISTER,
  ROUTES.AUTH.PAGE.FORGOT_PASSWORD,
  ROUTES.AUTH.PAGE.RESET_PASSWORD,
  ROUTES.AUTH.PAGE.VERIFY_OTP,
];

/**
 * Setup global layout for the application.
 */
const LayoutProvider = (props: React.PropsWithChildren) => {
  const { children } = props;
  const pathname = usePathname();
  const normalizedPath = useMemo(() => normalizePathname(pathname), [pathname]);
  const hideHeader = normalizedPath.includes("vizion");
  const isAuthRoute = useMemo(() => {
    return AUTH_ROUTES.some((route) => normalizedPath === route || normalizedPath.startsWith(`${route}/`));
  }, [normalizedPath]);

  // mobile sidebar states
  const {
    isOpen: isMobileSidebarOpen,
    handleOpen: handleMobileSidebarOpen,
    handleClose: handleMobileSidebarClose,
  } = useToggle(false);

  if (isAuthRoute) {
    return <>{children}</>;
  }

  const isDashboard = normalizedPath === "/";

  return (
    <NotificationProvider>
      <div className="flex min-h-screen">
        <Sidebar
          className="min-h-screen"
          isMobileSidebarOpen={isMobileSidebarOpen}
          handleMobileSidebarClose={handleMobileSidebarClose}
        />
        <div
          className={`flex min-h-screen min-w-0 flex-1 flex-col ${
            isDashboard
              ? "bg-gradient-to-br from-[#F7F9FF] via-[#F3F6FF] to-[#EDF2FF] dark:from-[var(--dashboard-dark-from)] dark:via-[var(--dashboard-dark-via)] dark:to-[var(--dashboard-dark-to)]"
              : ""
          }`}
        >
          {!hideHeader && (
            <div>
              <Header handleMobileSidebarOpen={handleMobileSidebarOpen} />
            </div>
          )}
          <main
            className={`relative min-w-0 flex-1 overflow-y-auto ${
              hideHeader
                ? "!p-0"
                : isDashboard
                  ? "px-0 pb-3 pt-0 md:px-0 md:pb-5 md:pt-0 lg:px-0 lg:pb-5 lg:pt-0"
                  : "px-4 pb-6 pt-4 md:px-6 md:pb-8 md:pt-6 lg:px-10 lg:pt-8"
            }`}
          >
            <LayoutBackground />
            <div className="relative size-full">{children}</div>
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default LayoutProvider;
