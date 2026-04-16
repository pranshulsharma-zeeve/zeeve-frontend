import { Metadata } from "next";
import React from "react";
import ArchiveNodeDetailPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Archive Node Detail Page",
};

const ArchiveNodeDetailIdPage = () => {
  return <ArchiveNodeDetailPageClient />;
};

export default ArchiveNodeDetailIdPage;
