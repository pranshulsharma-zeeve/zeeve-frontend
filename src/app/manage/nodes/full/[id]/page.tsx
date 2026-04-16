import { Metadata } from "next";
import React from "react";
import FullNodeDetailPageClient from "./page-client";

export const metadata: Metadata = {
  title: "RPC Node Detail Page",
};

const FullNodeDetailIdPage = () => {
  return <FullNodeDetailPageClient />;
};

export default FullNodeDetailIdPage;
