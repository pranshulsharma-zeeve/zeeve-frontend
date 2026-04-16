import { Metadata } from "next";
import React from "react";
import FabricPageClient from "./page-client";

/** generate dynamic metadata */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Fabric",
    description: `Hyperledger Fabric`,
  };
}

const HyperledgerFabricPage = () => {
  return <FabricPageClient />;
};

export default HyperledgerFabricPage;
