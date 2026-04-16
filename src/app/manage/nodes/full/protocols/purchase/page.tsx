/* eslint-disable react/jsx-no-undef */
import React from "react";
import { Metadata } from "next";
import PurchaseFullNodePageClient from "./page-client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Purchase Protocol",
    description: `Purchase Protocol Page.`,
  };
}

const PurchaseFullNodePage = () => {
  return <PurchaseFullNodePageClient />;
};

export default PurchaseFullNodePage;
