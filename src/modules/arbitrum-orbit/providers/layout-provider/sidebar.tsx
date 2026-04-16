/* eslint-disable prettier/prettier */
"use client";
import React, { useEffect } from "react";
import { SideDrawer, SideDrawerOverlay, SideDrawerContent } from "@zeeve-platform/ui";
import { getConfig } from "@/config";

interface SidebarProps {
  isMobileSidebarOpen: boolean;
  handleMobileSidebarClose: () => void;
}

const Sidebar = (props: SidebarProps) => {
  const { isMobileSidebarOpen, handleMobileSidebarClose } = props;

  const config = getConfig();
  const sidebarModuleUrl = config.url?.module?.sidebar;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "zeeve:sidebar:navigate") {
        handleMobileSidebarClose();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handleMobileSidebarClose]);

  return (
    <>
      {/* sidebar */}
      <iframe src={sidebarModuleUrl} className="hidden bg-brand-dark lg:block lg:w-72" title="sidebar" />
      {/* mobile sidebar*/}
      <SideDrawer isOpen={isMobileSidebarOpen} handleClose={handleMobileSidebarClose} placement="left">
        <SideDrawerOverlay />
        <SideDrawerContent
          focusLockProps={{
            disabled: true,
          }}
          className="w-4/5 bg-brand-dark md:w-72 lg:hidden"
        >
          <iframe src={sidebarModuleUrl} height="100%" width="100%" className="bg-brand-dark" title="mobile sidebar" />
        </SideDrawerContent>
      </SideDrawer>
    </>
  );
};

export default Sidebar;
