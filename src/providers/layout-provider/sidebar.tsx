"use client";
import React from "react";
import { SideDrawer, SideDrawerOverlay, SideDrawerContent } from "@zeeve-platform/ui";
import ZeeveSidebar from "@/components/sidebar";

interface SidebarProps {
  isMobileSidebarOpen: boolean;
  handleMobileSidebarClose: () => void;
  className?: string;
}

const Sidebar = (props: SidebarProps) => {
  const { isMobileSidebarOpen, handleMobileSidebarClose, className } = props;

  const desktopClassName = ["sidebar hidden lg:flex shrink-0 bg-brand-dark h-screen sticky top-0", className]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* sidebar */}
      <div className={desktopClassName}>
        <ZeeveSidebar className="size-full" />
      </div>
      {/* mobile sidebar*/}
      <SideDrawer isOpen={isMobileSidebarOpen} handleClose={handleMobileSidebarClose} placement="left">
        <SideDrawerOverlay />
        <SideDrawerContent
          focusLockProps={{
            disabled: true,
          }}
          className="w-4/5 bg-brand-dark md:w-72 lg:hidden"
        >
          <div className="size-full overflow-y-auto bg-brand-dark">
            <ZeeveSidebar className="size-full" disableAutoCollapse onNavigate={handleMobileSidebarClose} />
          </div>
        </SideDrawerContent>
      </SideDrawer>
    </>
  );
};

export default Sidebar;
