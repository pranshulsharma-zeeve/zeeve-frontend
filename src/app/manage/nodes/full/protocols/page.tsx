/* eslint-disable react/jsx-no-undef */
import React from "react";
import { Metadata } from "next";
import NodesSubscriptionsPageClient from "./page-client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "RPC Node Protocols",
    description: `RPC Node Protocols List.`,
  };
}

const NodesSubscriptionsPage = () => {
  return <NodesSubscriptionsPageClient />;
};

export default NodesSubscriptionsPage;
