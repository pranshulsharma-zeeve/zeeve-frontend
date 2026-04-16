import { Metadata } from "next";
import React from "react";
import BesuPageClient from "./page-client";

/** generate dynamic metadata */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Besu",
    description: `Hyperledger Besu`,
  };
}

const HyperledgerBesuPage = () => {
  return <BesuPageClient />;
};

export default HyperledgerBesuPage;
