/* eslint-disable prettier/prettier */
"use client";
import React from "react";
import { useToggle } from "@zeeve-platform/ui";
import { Layout, LayoutRightSection, LayoutMainSection } from "@zeeve-platform/ui-common-components";
import Sidebar from "./sidebar";
import Header from "@/providers/layout-provider/header";
import { withBasePath } from "@orbit/utils/helpers";

/**
 * Setup global layout for the application.
 */
const LayoutProvider = (props: React.PropsWithChildren) => {
  const { children } = props;

  // mobile sidebar states
  const {
    isOpen: isMobileSidebarOpen,
    handleOpen: handleMobileSidebarOpen,
    handleClose: handleMobileSidebarClose,
  } = useToggle(false);

  return (
    <Layout>
      <Sidebar isMobileSidebarOpen={isMobileSidebarOpen} handleMobileSidebarClose={handleMobileSidebarClose} />
      <LayoutRightSection>
        {/* Use the common platform header across modules */}
        <Header handleMobileSidebarOpen={handleMobileSidebarOpen} />
        <LayoutMainSection
          className="!p-0"
          style={{
            backgroundImage: `URL("${withBasePath("/assets/images/protocol/background.svg")}")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "50% 75%",
          }}
        >
          <div className="p-6">{children}</div>
        </LayoutMainSection>
      </LayoutRightSection>
    </Layout>
  );
};

export default LayoutProvider;
