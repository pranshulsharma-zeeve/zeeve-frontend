import React from "react";
import { Metadata } from "next";
import DeployPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Deploy",
  description: "Deploy Arbitrum-Orbit network.",
};

// getting search query from url
const DeployPage = ({
  searchParams,
}: {
  searchParams?: {
    demoNetworkId?: string;
    [key: string]: string | string[] | undefined;
  };
}) => {
  return <DeployPageClient demoNetworkId={searchParams?.demoNetworkId} />;
};

export default DeployPage;
