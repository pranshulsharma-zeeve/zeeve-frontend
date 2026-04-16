/* eslint-disable react/jsx-no-undef */
import React from "react";
import { Metadata } from "next";
import ValidatorNodePurchasePageClient from "./page-client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Purchase Protocol",
    description: `Purchase Protocol Page.`,
  };
}

const PurchaseValidatorNodePage = () => {
  return <ValidatorNodePurchasePageClient />;
};

export default PurchaseValidatorNodePage;
