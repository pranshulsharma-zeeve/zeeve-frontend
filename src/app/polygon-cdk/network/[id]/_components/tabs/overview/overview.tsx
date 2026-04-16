"use client";
import React from "react";
import PolygonCdkInfo from "./polygon-cdk-info";
import NodesOverview from "./nodes-summary";
import Parameters from "./parameters";
import LocalGethL1Info from "./local-geth-l1-info";
import CloudInfra from "./cloud-infra";
import Alerts from "./alerts";
import DemoSupernetInfo from "@/components/demo-supernet-info";

const Overview = () => {
  return (
    <div className="grid grid-cols-12 gap-3 text-brand-dark lg:gap-6">
      {/* <DemoSupernetInfo /> */}
      <PolygonCdkInfo />
      <Parameters />

      <NodesOverview />
      <LocalGethL1Info />
      {/* <CloudInfra /> */}
      <Alerts />
    </div>
  );
};

export default Overview;
