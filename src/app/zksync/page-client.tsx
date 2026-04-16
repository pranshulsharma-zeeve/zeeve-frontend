"use client";
import { Z4Navigation } from "@zeeve-platform/ui";
import Link from "next/link";
import CustomNetworkCard from "./_components/custom-network-card";
import DemoNetworkCard from "./_components/demo-network-card";
import DeployedNetworkCard from "./_components/deployed-network-card";
import useRollupServicesByType from "@/services/rollups/services-by-type";
import ROUTES from "@/routes";
import { ZKSYNC_DEMO_SERVICE_ID } from "@/constants/zksync";
import {
  CheckoutSessionBlockingScreen,
  useCheckoutSessionVerification,
} from "@/components/subscription/checkout-session-verifier";

export const normalizeStatus = (status: string | null | undefined): string => {
  const normalized = status?.toLowerCase?.() ?? "";
  const explicitMap: Record<string, string> = {
    active: "ready",
    deploying: "provisioning",
  };
  if (explicitMap[normalized]) {
    return explicitMap[normalized];
  }
  return normalized;
};

const ZkSyncLandingPageClient = () => {
  const { normalizedServices } = useRollupServicesByType("zksync");
  const demoServiceId = ZKSYNC_DEMO_SERVICE_ID;
  const demoService = normalizedServices.find((s) => s.service_id === demoServiceId);
  const testnetService = normalizedServices.find((s) => s.service_id !== demoServiceId && s.network_type === "testnet");
  const mainnetService = normalizedServices.find((s) => s.service_id !== demoServiceId && s.network_type === "mainnet");
  const { isBlocking, verificationStatus } = useCheckoutSessionVerification();

  // Set verifying state from search params
  // useEffect(() => {
  //   const status = searchParams.get("status");
  //   const token = searchParams.get("token");
  //   const checkIfVerifying =
  //     status === "success" && !!token && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token);
  //   setIsVerifying(checkIfVerifying);
  // }, [searchParams]);

  // Redirect to zksync listing page after 30 seconds when payment verification is in progress
  // useEffect(() => {
  //   if (!testnetService && isVerifying) {
  //     const timeoutId = setTimeout(() => {
  //       window.location.href = "/zksync";
  //     }, 30_000);
  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [isVerifying, testnetService]);

  if (isBlocking) {
    return <CheckoutSessionBlockingScreen status={verificationStatus} />;
  }

  return (
    <div className="relative flex flex-col gap-y-3 lg:gap-y-6">
      <Z4Navigation
        heading={"zkSync Hyperchains"}
        breadcrumb={{
          items: [
            { href: ROUTES.PLATFORM.PAGE.DASHBOARD, label: "Dashboard", isActive: false, as: Link },
            { href: "/zksync", label: "zkSync Hyperchains", isActive: true, as: Link },
          ],
        }}
      />
      <div className="relative grid grid-cols-12 gap-3 lg:gap-6">
        {demoService ? (
          <DemoNetworkCard
            id={demoService.service_id}
            name={demoService.name}
            status={normalizeStatus(demoService.status)}
          />
        ) : null}
        {testnetService ? (
          <DeployedNetworkCard
            id={testnetService.service_id}
            name={testnetService.name}
            status={testnetService.status}
            environment="testnet"
            inputs={testnetService.inputs}
          />
        ) : (
          <CustomNetworkCard type="testnet" deployHref={"/zksync/deploy?env=testnet"} />
        )}
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

export default ZkSyncLandingPageClient;
