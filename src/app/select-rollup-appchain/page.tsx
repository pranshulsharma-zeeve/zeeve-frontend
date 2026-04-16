import { Metadata } from "next";
import React from "react";
import SelectRollupAppchainPageClient from "./page-client";

/** generate dynamic metadata */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Select Appchain/Rollup",
    description: `Appchain/Rollup Selection Page`,
  };
}

const SelectRollupAppchainPage = () => {
  return <SelectRollupAppchainPageClient />;
};

export default SelectRollupAppchainPage;
