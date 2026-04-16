"use client";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import NetworkCard from "./network-card";
import NetworkLoadingCard from "./network-loading-card";
import CustomNetworkCard from "./custom-network-card";
import useOrbitRollupServices from "@orbit/services/rollup/services";
import { NodeNetworkStates } from "@orbit/types/node";

type TrialProps = {
  setDisable: Dispatch<SetStateAction<boolean>>;
  deployDisabled?: boolean;
};

const NetworkList = ({ setDisable, deployDisabled }: TrialProps) => {
  // Fetch Orbit services from backend (demo/testnet/mainnet)
  const { request, normalizedServices } = useOrbitRollupServices("arbitrum-orbit");

  const isLoading = Boolean(request.isLoading && !request.data);

  // Identify services by environment
  const demoService = useMemo(() => normalizedServices.find((s) => s.is_demo === true), [normalizedServices]);
  const testnetService = useMemo(
    () => normalizedServices.find((s) => s.is_demo !== true && s.network_type === "testnet"),
    [normalizedServices],
  );
  const mainnetService = useMemo(
    () => normalizedServices.find((s) => s.is_demo !== true && s.network_type === "mainnet"),
    [normalizedServices],
  );

  // Map services to Network cards
  const demoCard = useMemo(
    () =>
      demoService
        ? {
            networkId: demoService.service_id,
            networkName: demoService.name,
            networkEnvironment: "testnet" as const, // demo is a testnet environment
            networkStatus: (demoService.status as unknown as NodeNetworkStates) ?? undefined,
            networkCreatedAt: demoService.created_at
              ? new Date(demoService.created_at)
              : (undefined as unknown as Date),
            isDemo: true,
            serviceInputs: demoService.inputs,
          }
        : undefined,
    [demoService],
  );
  const testnetCard = useMemo(
    () =>
      testnetService
        ? {
            networkId: testnetService.service_id,
            networkName: testnetService.name,
            networkEnvironment: "testnet" as const,
            networkStatus: (testnetService.status as unknown as NodeNetworkStates) ?? undefined,
            networkCreatedAt: testnetService.created_at
              ? new Date(testnetService.created_at)
              : (undefined as unknown as Date),
            isDemo: false,
            serviceInputs: testnetService.inputs,
          }
        : undefined,
    [testnetService],
  );
  const mainnetCard = useMemo(
    () =>
      mainnetService
        ? {
            networkId: mainnetService.service_id,
            networkName: mainnetService.name,
            networkEnvironment: "mainnet" as const,
            networkStatus: (mainnetService.status as unknown as NodeNetworkStates) ?? undefined,
            networkCreatedAt: mainnetService.created_at
              ? new Date(mainnetService.created_at)
              : (undefined as unknown as Date),
            isDemo: false,
            serviceInputs: mainnetService.inputs,
          }
        : undefined,
    [mainnetService],
  );

  useEffect(() => {
    // Disable deploy if user already has testnet or mainnet
    setDisable(Boolean(deployDisabled || testnetCard || mainnetCard));
  }, [deployDisabled, testnetCard, mainnetCard, setDisable]);

  return (
    <div className="grid grid-cols-12 gap-3 text-brand-dark lg:gap-6">
      {isLoading ? [1, 2, 3].map((value) => <NetworkLoadingCard key={`orbit-loader-${value}`} />) : null}

      {/* Demo card (if available) */}
      {!isLoading && demoCard ? <NetworkCard data={demoCard} /> : null}

      {/* Testnet: show View if deployed, else Deploy */}
      {!isLoading && testnetCard ? <NetworkCard data={testnetCard} /> : <CustomNetworkCard type={"testnet"} />}

      {/* Mainnet: show View if deployed, else Contact Us */}
      {!isLoading && mainnetCard ? <NetworkCard data={mainnetCard} /> : <CustomNetworkCard type={"mainnet"} />}
    </div>
  );
};

export default NetworkList;
