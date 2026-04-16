"use client";
import { Z4Navigation } from "@zeeve-platform/ui";
import Link from "next/link";
import CustomNetworkCard from "./_components/custom-network-card";
import DemoNetworkCard from "./_components/demo-network-card";
import DeployedNetworkCard from "./_components/deployed-network-card";
import useRollupServicesByType from "@/services/rollups/services-by-type";
import { getConfig } from "@/config";
import ROUTES from "@/routes";

const OpStackLandingPageClient = () => {
  const config = getConfig();
  const platformFrontendUrl =
    config.url?.external?.platformNew?.frontend ??
    config.url?.external?.platformOld?.frontend ??
    config.url?.host ??
    "/";
  const { request, normalizedServices } = useRollupServicesByType("opstack");
  const demoService = normalizedServices.find((s) => s.is_demo === true);
  const testnetService = normalizedServices.find((s) => s.is_demo !== true && s.network_type === "testnet");
  const mainnetService = normalizedServices.find((s) => s.is_demo !== true && s.network_type === "mainnet");

  return (
    <div className="relative flex flex-col gap-y-3 lg:gap-y-6">
      <Z4Navigation
        heading={"OP Stack"}
        breadcrumb={{
          items: [
            { href: ROUTES.PLATFORM.PAGE.DASHBOARD, label: "Dashboard", as: Link, isActive: false },
            { href: "/opstack", label: "OP Stack", isActive: true, as: Link },
          ],
        }}
      />
      <div className="relative grid grid-cols-12 gap-3 lg:gap-6">
        {/* Demo card if available */}
        {demoService ? <DemoNetworkCard id={demoService?.service_id ?? undefined} /> : null}

        {/* Testnet card: deployed → View; otherwise Deploy */}
        {testnetService ? (
          <DeployedNetworkCard
            id={testnetService.service_id}
            name={testnetService.name}
            status={testnetService.status}
            environment="testnet"
            inputs={testnetService.inputs}
          />
        ) : (
          <CustomNetworkCard type="testnet" deployHref={"/opstack/deploy?env=testnet"} />
        )}

        {/* Mainnet card: deployed → View; otherwise Contact Us */}
        {mainnetService ? (
          <DeployedNetworkCard
            id={mainnetService.service_id}
            name={mainnetService.name}
            status={mainnetService.status}
            environment="mainnet"
            inputs={mainnetService.inputs}
          />
        ) : (
          <CustomNetworkCard type="mainnet" />
        )}
      </div>
      {/* Decorative background removed per request */}
    </div>
  );
};

export default OpStackLandingPageClient;
