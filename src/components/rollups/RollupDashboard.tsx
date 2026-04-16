"use client";
import React from "react";
import { Card, Z4Navigation } from "@zeeve-platform/ui";
import Link from "next/link";
import type { RollupConfig } from "@/rollups/types";
import { getPreferredBasePath } from "@/utils/path";
import ROUTES from "@/routes";

interface RollupDashboardProps {
  config: RollupConfig;
}

const RollupDashboard = ({ config }: RollupDashboardProps) => {
  const base = getPreferredBasePath();
  const isOrbit = config.key === "arbitrum-orbit";

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      <Z4Navigation
        heading={config.displayName}
        breadcrumb={{
          items: [
            { href: `${base}${ROUTES.PLATFORM.PAGE.DASHBOARD}`, label: "Dashboard", as: Link },
            { href: `${base}/rollups/${config.key}`, label: config.displayName, isActive: true, as: Link },
          ],
        }}
      />
      {isOrbit ? (
        // Reuse existing Arbitrum Orbit list component
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        React.createElement(require("@/app/arbitrum-orbit/_components/network-list").default)
      ) : (
        <Card className="p-6">
          <div className="flex flex-col gap-2">
            <p className="text-base">{config.displayName} integration is available via the unified Rollup flow.</p>
            <p className="text-sm opacity-80">Contact Zeeve support to enable full deployment for this rollup.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RollupDashboard;
