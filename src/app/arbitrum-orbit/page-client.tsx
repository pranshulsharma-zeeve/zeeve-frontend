"use client";
import { useState } from "react";
import NetworkList from "./_components/network-list";
import ROUTES from "@orbit/routes";
import useArbitrumOrbitService from "@orbit/services/arbitrum-orbit/use-arbitrum-orbit-service";
import PageHeader from "@/components/shared/PageHeader";

const ListPageClient = () => {
  localStorage.setItem("from", "arbitrum-orbit");

  // API request to get the Trail Information
  const {
    request: { data: trialInfoApiData },
  } = useArbitrumOrbitService().network.trialInfo();

  // Preload configuration (no UI changes; primes backend/cache)
  // Do NOT call configuration API here; it is loaded on the deploy page only.

  // check there is no network list
  const [disable, setDisable] = useState(false);
  const deployDisabled = !trialInfoApiData?.data?.status || disable;

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-6">
      <PageHeader
        title="Arbitrum Orbit"
        breadcrumbs={[
          { href: ROUTES.PLATFORM.PAGE.HOME, label: "Dashboard" },
          { href: ROUTES.ARBITRUM_ORBIT.PAGE.LIST, label: "Arbitrum Orbit", isActive: true },
        ]}
      />
      <NetworkList setDisable={setDisable} deployDisabled={deployDisabled} />
    </div>
  );
};

export default ListPageClient;
