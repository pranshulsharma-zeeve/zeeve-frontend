"use client";
import React from "react";
import { useZkSyncDashboard } from "../dashboard-context";
import ZkSyncInfo from "./zksync-info";
import NodesOverview from "./nodes-summary";
import Parameters from "./parameters";
import LocalGethL1Info from "./local-geth-l1-info";
import CloudInfra from "./cloud-infra";
import Alerts from "./alerts";
import DemoSupernetInfo from "@/components/demo-supernet-info";

const Overview = () => {
  const { normalized } = useZkSyncDashboard();
  const prividiumValue = normalized?.rollupMetadata?.isPrividium ?? normalized?.overview?.isPrividium;
  const isPrividium =
    typeof prividiumValue === "boolean"
      ? prividiumValue
      : typeof prividiumValue === "string"
        ? prividiumValue.toLowerCase() === "true"
        : false;

  return (
    <div className="grid grid-cols-12 gap-3 text-brand-dark lg:gap-6">
      {/* <DemoSupernetInfo /> */}
      <ZkSyncInfo />
      {!isPrividium && <Parameters />}

      <NodesOverview className={isPrividium ? "xl:col-span-7 2xl:col-span-7" : undefined} />
      <LocalGethL1Info />
      {/* <CloudInfra /> */}
      <Alerts />
    </div>
  );
};

export default Overview;
